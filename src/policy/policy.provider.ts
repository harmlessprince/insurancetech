import { REPOSITORIES } from '../core/utils';
import { Policy } from './entities/policy.entity';

export const policyProvider = [
  {
    provide: REPOSITORIES.POLICY_REPOSITORY,
    useValue: Policy,
  },
];

