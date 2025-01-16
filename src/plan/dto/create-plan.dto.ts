import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class CreatePlanDto {

  @IsNumber()
  @IsNotEmpty()
  user_id: number;

  @IsNumber()
  @IsNotEmpty()
  product_id: number;

  @IsPositive()
  @IsNumber()
  @IsNotEmpty()
  quantity: number;
}
