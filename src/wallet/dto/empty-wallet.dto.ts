import { IsInt, IsNotEmpty } from 'class-validator';

export class EmptyWalletDto {
  @IsInt()
  @IsNotEmpty()
  userId: number;
}