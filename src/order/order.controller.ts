import { Controller, Get, Post, Patch, Delete, Param, Body,Query ,Req  } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './schemas/order.schema';
import { Request } from 'express';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  /**
   * Create a new order
   * @param createOrderDto - Data transfer object containing user ID, product IDs, quantity, and status
   * @returns The created order
   */
  @Post()
  async create(@Body() createOrderDto: CreateOrderDto): Promise<Order> {
    return this.orderService.create(createOrderDto);
  }


  @Get('filter/status')
  async findAllByStatus(@Query('status') status: string) {
    return this.orderService.findAllByStatus(status);
  }

    // Endpoint to get an order by ID with only user name and product names
    @Get(':id/summary')
    async findOneWithUserAndProductNames(@Param('id') id: string): Promise<Order> {
      return this.orderService.findOneWithUserAndProductNames(id);
    }

  /**
   * Get all orders for a specific user
   * @param userId - The ID of the user whose orders are to be retrieved
   * @returns An array of orders associated with the specified user
   */
  @Get('user/:userId')
  async findAllByUser(@Param('userId') userId: string): Promise<Order[]> {
    return this.orderService.findAllByUser(userId);
  }

  /**
   * Get a specific order by its ID, including user and product details
   * @param id - The ID of the order to retrieve
   * @returns The specified order with populated user and product details
   */
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Order> {
    return this.orderService.findOne(id);
  }

  /**
   * Update an order by its ID
   * @param id - The ID of the order to update
   * @param updateOrderDto - Data transfer object containing the updated fields (product IDs, quantity, or status)
   * @returns The updated order
   */
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto): Promise<Order> {
    return this.orderService.update(id, updateOrderDto);
  }

  /**
   * Delete an order by its ID
   * @param id - The ID of the order to delete
   * @returns The deleted order
   */
  @Delete(':id')
  async delete(@Param('id') id: string, @Req() req): Promise<Order> {
    const userId = req.user.userId; // Extract user ID from authenticated user
    return this.orderService.delete(id, userId);
  }
}