import { IsInt, IsNotEmpty } from 'class-validator';

export class ActivatePolicyDto {
  @IsInt()
  @IsNotEmpty()
  user_id: number;

  @IsInt()
  @IsNotEmpty()
  pending_policy_id: number;
}
