import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class CreatePolicyDto {
  @IsNumber()
  @IsNotEmpty()
  user_id: number;

  product_id: number;

  @IsNumber()
  @IsNotEmpty()
  plan_id: number;
}
