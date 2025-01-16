import { Module } from '@nestjs/common';
import { PolicyService } from './policy.service';
import { PolicyController } from './policy.controller';
import { policyProvider } from './policy.provider';
import { Policy } from './entities/policy.entity';
import { SequelizeModule } from '@nestjs/sequelize';
import { PendingPolicyModule } from '../pending-policy/pending-policy.module';

@Module({
  controllers: [PolicyController],
  providers: [PolicyService, ...policyProvider],
  imports: [SequelizeModule.forFeature([Policy]), PendingPolicyModule],
  exports: [PolicyService],
})
export class PolicyModule {}
