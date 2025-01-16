import { REPOSITORIES } from '../core/utils';
import { User } from './entities/user.entity';

export const userProvider = [
  {
    provide: REPOSITORIES.USER_REPOSITORY,
    useValue: User,
  },
];
