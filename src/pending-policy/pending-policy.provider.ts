import { REPOSITORIES } from '../core/utils';
import { PendingPolicy } from './entities/pending-policy.entity';

export const pendingPolicyProvider = [
  {
    provide: REPOSITORIES.PENDING_POLICY_REPOSITORY,
    useValue: PendingPolicy,
  },
];
