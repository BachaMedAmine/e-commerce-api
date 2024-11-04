import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}


   // Method to retrieve users with a specific role
   async findByRole(role: string): Promise<User[]> {
    return this.userModel.find({ role }).exec(); // Filter users by role
  }

  
  // Create a new user
  async create(createUserDto: CreateUserDto): Promise<User> {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);
    const createdUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });
    return createdUser.save();
  }


  async findUserWithOrdersAndProducts(userId: string): Promise<User> {
    return this.userModel
      .findById(userId)
      .populate({
        path: 'orders',
        populate: {
          path: 'productIds',
          select: 'name price description',
        },
      })
      .exec();
  }

  async findUserWithBasicOrders(userId: string): Promise<User> {
    return this.userModel
      .findById(userId)
      .populate('orders', '_id quantity status createdAt updatedAt') // Only basic order info
      .exec();
  }


  // Get all users
  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  // Get a user by ID
  async findOne(id: string): Promise<User> {
    return this.userModel.findById(id).exec();
  }

  // Update a user by ID
  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    if (updateUserDto.password) {
      const salt = await bcrypt.genSalt();
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, salt);
    }
    
    return this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true }).exec();
  }

  // Delete a user by ID
  async delete(id: string): Promise<User> {
    return this.userModel.findByIdAndDelete(id).exec();
  }

}