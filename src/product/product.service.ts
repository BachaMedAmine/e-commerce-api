import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Product } from './schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(@InjectModel(Product.name) private productModel: Model<Product>) {}

  // Create a product
  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = new this.productModel(createProductDto);
    return product.save();
  }

  // Retrieve all products for a specific user
  async findAllByUser(userId: string): Promise<Product[]> {
    return this.productModel.find({ userId: new Types.ObjectId(userId) }).exec();
  }

  // Retrieve products within a specific price range
  async findByPriceRange(minPrice: number, maxPrice: number): Promise<Product[]> {
    return this.productModel.find({
      price: { $gte: minPrice, $lte: maxPrice },
    }).exec();
  }

  // Retrieve a single product by ID
  async findOne(id: string): Promise<Product> {
    const product = await this.productModel.findById(id).populate('userId', 'name email').exec();
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  // Update a product by ID
  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    const updatedProduct = await this.productModel.findByIdAndUpdate(id, updateProductDto, { new: true }).exec();
    if (!updatedProduct) {
      throw new NotFoundException('Product not found');
    }
    return updatedProduct;
  }

  // Delete a product by ID
  async delete(id: string): Promise<Product> {
    const deletedProduct = await this.productModel.findByIdAndDelete(id).exec();
    if (!deletedProduct) {
      throw new NotFoundException('Product not found');
    }
    return deletedProduct;
  }
}