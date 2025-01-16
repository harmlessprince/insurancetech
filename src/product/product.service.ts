import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { Category } from '../category/entities/category.entity';
import { REPOSITORIES } from '../core/utils';

@Injectable()
export class ProductService {
  constructor(
    @Inject(REPOSITORIES.PRODUCT_REPOSITORY)
    private readonly productRepository: typeof Product,
  ) {}

  async findAll() {
    return await this.productRepository.findAll({
      include: {
        model: Category,
        attributes: ['name', 'type', 'price'],
      },
    });
  }

  async findOne(id: number): Promise<Product | null> {
    const product = await this.productRepository.findByPk(id, {
      include: {
        model: Category,
        attributes: ['name', 'type', 'price'],
      }
    });
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    return product;
  }
}
