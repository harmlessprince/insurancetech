import { PartialType } from '@nestjs/mapped-types';
import { CreatePendingPolicyDto } from './create-pending-policy.dto';

export class UpdatePendingPolicyDto extends PartialType(CreatePendingPolicyDto) {}
