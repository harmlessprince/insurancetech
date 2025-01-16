import { Module } from '@nestjs/common';
import { PendingPolicyService } from './pending-policy.service';
import { PendingPolicyController } from './pending-policy.controller';
import { pendingPolicyProvider } from './pending-policy.provider';
import { SequelizeModule } from '@nestjs/sequelize';
import { PendingPolicy } from './entities/pending-policy.entity';

@Module({
  controllers: [PendingPolicyController],
  providers: [PendingPolicyService, ...pendingPolicyProvider],
  imports: [SequelizeModule.forFeature([PendingPolicy])],
  exports: [PendingPolicyService],
})
export class PendingPolicyModule {}
