import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreatePolicyDto } from './dto/create-policy.dto';
import { Policy } from './entities/policy.entity';
import { REPOSITORIES } from '../core/utils';
import { Plan } from '../plan/entities/plan.entity';
import { PendingPolicyService } from '../pending-policy/pending-policy.service';
import { ActivatePolicyDto } from './dto/activate-policy.dto';
import { PendingPolicy } from '../pending-policy/entities/pending-policy.entity';
import { Sequelize } from 'sequelize-typescript';
import sequelize, { Transaction } from 'sequelize';
import { Product } from '../product/entities/product.entity';
import { Category } from '../category/entities/category.entity';

@Injectable()
export class PolicyService {
  constructor(
    @Inject(REPOSITORIES.POLICY_REPOSITORY)
    private readonly policyRepository: typeof Policy,
    private readonly pendingPolicyService: PendingPolicyService,
    private readonly sequelize: Sequelize,
  ) {}

  async create(
    createPolicyDto: CreatePolicyDto,
    transaction?:   sequelize.Transaction | null,
  ) {
    return await this.policyRepository.create(
      {
        policy_number: this.generatePolicyCode(createPolicyDto),
        user_id: createPolicyDto.user_id,
        product_id: createPolicyDto.product_id,
        plan_id: createPolicyDto.plan_id,
      },
      { transaction },
    );
  }

  async activatePendingPolicy(activatePolicyDto: ActivatePolicyDto) {
    const pendingPolicy: PendingPolicy =
      await this.pendingPolicyService.findOnePendingPolicyById(
        activatePolicyDto.pending_policy_id,
      );

    if (pendingPolicy.userId != activatePolicyDto.user_id) {
      throw new BadRequestException(
        'The selected pending policy with id ' +
          activatePolicyDto.pending_policy_id +
          ' does not belong to the user',
      );
    }
    const plan: Plan = pendingPolicy?.plan;
    if (!plan) {
      throw new BadRequestException(
        'A Plan must be associated the selected pending policy',
      );
    }

    const productId = plan.dataValues?.product_id;

    // Check if a policy already exists for this user and product
    const existingPolicy = await this.findOneByProductIdAndUserId(
      productId,
      pendingPolicy.userId,
    );
    if (existingPolicy) {
      throw new BadRequestException(
        'Your already have a policy for this product in this plan',
      );
    }

    const transaction = await this.sequelize.transaction();
    try {
      const policyDto = new CreatePolicyDto();
      policyDto.product_id = productId;
      policyDto.user_id = pendingPolicy.userId;
      policyDto.plan_id = pendingPolicy.planId;

      await this.create(policyDto, transaction);
      // Activate policy and soft delete it
      await this.pendingPolicyService.markAsUsed(transaction, pendingPolicy.id);
      await transaction.commit();
    } catch (err) {
      console.log(err);
      await transaction.rollback();
      throw err;
    }
  }

  private generatePolicyCode(createPolicyDto: CreatePolicyDto): string {
    // Get the current date
    const date = new Date();

    // Extract the year, month, and day in the desired format
    const year = date.getFullYear();
    const month = date
      .toLocaleString('default', { month: 'short' })
      .toUpperCase(); // e.g., JAN
    const day = date.getDate().toString().padStart(2, '0'); // Ensure two digits

    return `PLO-${year}-${month}-${day}-PL-${createPolicyDto?.plan_id}-PR-${createPolicyDto?.product_id}-USR-${createPolicyDto?.user_id}`;
  }

  async findAll(planId?: number) {
    const whereClause = planId ? { plan_id: planId } : {};
    return this.policyRepository.findAll({ where: whereClause, include: [
        {
          model: Plan,
          attributes: ['id', 'price', 'quantity', 'total_price'],
        },
        {
          model: Product,
          attributes: ['id', 'type', 'name'],
          include: [Category]
        }
      ] });
  }

  async findOneByProductIdAndUserId(productId: number, userId: number) {
    return await this.policyRepository.findOne({
      where: {
        user_id: userId,
        product_id: productId,
      },
    });
  }
}
