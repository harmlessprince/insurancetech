import { REPOSITORIES } from '../core/utils';
import { Plan } from './entities/plan.entity';

export const planProvider = [
  {
    provide: REPOSITORIES.PLAN_REPOSITORY,
    useValue: Plan,
  },
];
