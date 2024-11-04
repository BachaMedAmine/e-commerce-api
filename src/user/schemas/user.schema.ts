import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Types } from 'mongoose';
import { UserRole } from 'src/auth/role.enum';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true, unique: true })
  username: string; // Ensure that this field exists in the schema

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: UserRole.USER }) // Default role is 'user'
  role: UserRole;

  

  @Prop({ type: [Types.ObjectId], ref: 'Order' })
  orders: Types.ObjectId[];

  @Prop()
  refreshToken?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);