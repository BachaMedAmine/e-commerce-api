import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true }) // Adds createdAt and updatedAt timestamps
export class Product extends Document {
  @Prop({ required: true }) // Product name, required
  name: string;

  @Prop() // Product price
  price: number;

  @Prop() // Product description
  description: string;
}

// Create the schema for Product
export const ProductSchema = SchemaFactory.createForClass(Product);