import { Module } from '@nestjs/common';
import { PendingPolicyService } from './pending-policy.service';
import { PendingPolicyController } from './pending-policy.controller';

@Module({
  controllers: [PendingPolicyController],
  providers: [PendingPolicyService],
})
export class PendingPolicyModule {}
