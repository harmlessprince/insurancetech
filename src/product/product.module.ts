import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { productsProvider } from './product.provider';
import { SequelizeModule } from '@nestjs/sequelize';
import { Product } from './entities/product.entity';

@Module({
  controllers: [ProductController],
  providers: [ProductService, ...productsProvider],
  imports: [SequelizeModule.forFeature([Product])],
  exports: [ProductService],
})
export class ProductModule {}
