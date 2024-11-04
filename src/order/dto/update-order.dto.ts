import { IsOptional, IsNumber, IsString, IsArray, IsMongoId } from 'class-validator';

export class UpdateOrderDto {
  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  productIds?: string[]; // Allow updating product list in the order

  @IsNumber()
  @IsOptional()
  quantity?: number;

  @IsString()
  @IsOptional()
  status?: string; // Allow updating the status field
}