import { Injectable , ForbiddenException ,NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Order } from './schemas/order.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrderService {
  constructor(@InjectModel(Order.name) private orderModel: Model<Order>) {}

 // Method to create a new order
 async create(createOrderDto: CreateOrderDto): Promise<Order> {
  const { userId, productIds, quantity, status } = createOrderDto;
  const order = new this.orderModel({
    userId: new Types.ObjectId(userId), // Convert userId to ObjectId
    productIds: productIds.map(id => new Types.ObjectId(id)), // Convert productIds to ObjectId array
    quantity,
    status: status || 'pending',
  });
  return order.save();
}

  async findAllByUser(userId: string): Promise<Order[]> {
    return this.orderModel.find({ userId: new Types.ObjectId(userId) }).exec();
  }

    // Method to retrieve an order by ID with populated user and product details
    async findOne(id: string): Promise<Order> {
      return this.orderModel
        .findById(id)
        .populate('userId', 'name email') // Populate user details for the order
        .populate('productIds', 'name price description') // Populate product details within the order
        .exec();
    }


     // Method to retrieve all orders with a specific status
  async findAllByStatus(status: string): Promise<Order[]> {
    return this.orderModel.find({ status }).exec(); // Filter orders by status
  }

      // Method to retrieve an order with only the user's name and product names populated
  async findOneWithUserAndProductNames(id: string): Promise<Order> {
    return this.orderModel
      .findById(id)
      .populate('userId', 'name') // Populate only the user's name field
      .populate('productIds', 'name') // Populate only the name field of each product
      .exec();
  }

  

  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    if (updateOrderDto.productIds) {
      // Convert productIds to ObjectIds before updating
      updateOrderDto.productIds = updateOrderDto.productIds.map(id => new Types.ObjectId(id) as any);
    }
    return this.orderModel.findByIdAndUpdate(id, updateOrderDto, { new: true }).exec();
  }

  async delete(id: string, userId: string): Promise<Order> {
    const order = await this.orderModel.findById(id);
    if (!order) throw new NotFoundException('Order not found');
    if (order.userId.toString() !== userId) throw new ForbiddenException('You do not have permission to delete this order');
    return this.orderModel.findByIdAndDelete(id).exec();
  }
}