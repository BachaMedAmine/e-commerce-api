import { IsNotEmpty, IsMongoId, IsArray, IsNumber, IsString, IsOptional } from 'class-validator';

export class CreateOrderDto {
  @IsMongoId()
  userId: string;

  @IsArray()
  @IsMongoId({ each: true })
  productIds: string[];

  @IsNumber()
  quantity: number;

  @IsString()
  @IsOptional()
  status?: string; // Allow optional status for initial creation, with a default in the service
}