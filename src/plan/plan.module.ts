import { Module } from '@nestjs/common';
import { PlanService } from './plan.service';
import { PlanController } from './plan.controller';
import { planProvider } from './plan.provider';
import { SequelizeModule } from '@nestjs/sequelize';
import { Plan } from './entities/plan.entity';
import { ProductModule } from '../product/product.module';
import { WalletModule } from '../wallet/wallet.module';
import { PendingPolicyModule } from '../pending-policy/pending-policy.module';

@Module({
  controllers: [PlanController],
  providers: [PlanService, ...planProvider],
  imports: [SequelizeModule.forFeature([Plan]), ProductModule, WalletModule, PendingPolicyModule]
})
export class PlanModule {}
