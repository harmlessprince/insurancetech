import { REPOSITORIES } from '../core/utils';
import { Category } from './entities/category.entity';

export const categoryProvider = [
  {
    provide: REPOSITORIES.CATEGORY_REPOSITORY,
    useValue: Category,
  },
];

