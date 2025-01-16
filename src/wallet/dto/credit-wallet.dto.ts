import { IsInt, IsNotEmpty, IsNumber, IsPort, IsPositive } from 'class-validator';

export class CreditWalletDto {

  @IsInt()
  @IsNotEmpty()
  userId: number;

  @IsPositive()
  @IsNumber()
  @IsNotEmpty()
  amount: number;
}