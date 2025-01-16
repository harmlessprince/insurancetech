import { Module } from '@nestjs/common';

import { categoryProvider } from './category.provider';
import { SequelizeModule } from '@nestjs/sequelize';
import { Category } from './entities/category.entity';

@Module({
  controllers: [],
  providers: [...categoryProvider],
  imports: [SequelizeModule.forFeature([Category])],
})
export class CategoryModule {}
