
import { Product } from './entities/product.entity';
import { REPOSITORIES } from '../core/utils';

export const productsProvider = [
  {
    provide: REPOSITORIES.PRODUCT_REPOSITORY,
    useValue: Product,
  },
];
