import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true }) // Adds createdAt and updatedAt timestamps automatically
export class Order extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true }) // Reference to the User who placed the order
  userId: Types.ObjectId;

  @Prop([{ type: Types.ObjectId, ref: 'Product' }]) // Array of references to Products in this order
  productIds: Types.ObjectId[];

  @Prop({ required: true }) // Quantity of products ordered
  quantity: number;

  @Prop({ default: 'pending' }) // Default status of the order
  status: string;
}

// Create the schema for Order
export const OrderSchema = SchemaFactory.createForClass(Order);