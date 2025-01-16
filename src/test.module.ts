import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Plan } from './plan/entities/plan.entity';
import { Wallet } from './wallet/entities/wallet.entity';
import { Product } from './product/entities/product.entity';
import { Category } from './category/entities/category.entity';
import { PendingPolicy } from './pending-policy/entities/pending-policy.entity';
import { User } from './user/entities/user.entity';
import { Policy } from './policy/entities/policy.entity';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'sqlite',
      storage: ':memory:', // Use in-memory database
      autoLoadModels: true,
      synchronize: true, // Automatically sync models
    }),
    SequelizeModule.forFeature([Plan, Wallet, Product, Category, PendingPolicy, User, Policy]),
  ],
})
export class TestAppModule {}
