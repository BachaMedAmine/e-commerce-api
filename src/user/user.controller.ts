import { Body, Controller, Delete, Get, Param, Patch, Post,Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/user.schema';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}



   // Endpoint to get users filtered by role
   @Get('filter/role')
   async findByRole(@Query('role') role: string) {
     return this.userService.findByRole(role);
   }


  // Create a new user
  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }

  // Get all users
  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  // Get a user by ID
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User> {
    return this.userService.findOne(id);
  }

  
   // Endpoint to get a user with basic order details (no product details)
   @Get(':id/orders/basic')
   async findUserWithBasicOrders(@Param('id') userId: string) {
     return this.userService.findUserWithBasicOrders(userId);
   }


  @Get(':id/orders/full')
  async findUserWithOrdersAndProducts(@Param('id') userId: string): Promise<User> {
    return this.userService.findUserWithOrdersAndProducts(userId);
  }

  // Update a user by ID
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<User> {
    return this.userService.update(id, updateUserDto);
  }

  // Delete a user by ID
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<User> {
    return this.userService.delete(id);
  }
}