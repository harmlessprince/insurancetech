import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import sequelize, { Transaction, where } from 'sequelize';
import { PendingPolicyStatus, REPOSITORIES } from '../core/utils';
import { PendingPolicy } from './entities/pending-policy.entity';
import { Plan } from '../plan/entities/plan.entity';

@Injectable()
export class PendingPolicyService {
  constructor(
    @Inject(REPOSITORIES.PENDING_POLICY_REPOSITORY)
    private readonly pendingPolicyRepository: typeof PendingPolicy,
  ) {}

  async findAll(
    planId?: number,
    status: string = PendingPolicyStatus.UNUSED,
  ): Promise<PendingPolicy[]> {
    const whereClause = planId
      ? { plan_id: planId, status: status }
      : { status: status };
    return await this.pendingPolicyRepository.findAll({ where: whereClause });
  }

  async findOnePendingPolicyByIdAndPlanId(
    pendingPolicyId: number,
    planId: number,
  ): Promise<PendingPolicy> {
    const pendingPolicy = await this.pendingPolicyRepository.findOne({
      where: {
        id: pendingPolicyId,
        plan_id: planId,
        status: PendingPolicyStatus.UNUSED,
      },
      include: {
        model: Plan,
        attributes: ['product_id', 'id'],
      },
    });
    if (!pendingPolicy) {
      throw new BadRequestException(
        'Pending policy not found or already activated',
      );
    }
    return pendingPolicy;
  }

  async findOnePendingPolicyById(
    pendingPolicyId: number,
  ): Promise<PendingPolicy> {
    const pendingPolicy = await this.pendingPolicyRepository.findOne({
      where: {
        id: pendingPolicyId,
        status: PendingPolicyStatus.UNUSED,
      },
      include: {
        model: Plan,
        attributes: ['product_id', 'id'],
      },
    });
    if (!pendingPolicy) {
      throw new BadRequestException(
        'Pending policy not found or already activated',
      );
    }
    return pendingPolicy;
  }

  async createPendingPolicies(
    planId: number,
    userId: number,
    quantity: number,
    transaction: sequelize.Transaction,
  ) {
    const pendingPolicies = Array.from({ length: quantity }, () => ({
      planId: planId,
      userId: userId,
      status: PendingPolicyStatus.UNUSED,
    }));
    await this.pendingPolicyRepository.bulkCreate(pendingPolicies, {
      transaction,
    });
  }

  async markAsUsed(
    transaction: Transaction,
    pendPolicyId: number,
  ): Promise<void> {
    await this.pendingPolicyRepository.update(
      { status: PendingPolicyStatus.USED, deletedAt: new Date() },
      { where: { id: pendPolicyId }, transaction },
    );
  }
}
