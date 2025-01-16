import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { WalletService } from '../wallet/wallet.service';
import { ProductService } from '../product/product.service';
import { Wallet } from '../wallet/entities/wallet.entity';
import { Sequelize } from 'sequelize-typescript';
import { REPOSITORIES } from '../core/utils';
import { Plan } from './entities/plan.entity';
import { PendingPolicyService } from '../pending-policy/pending-policy.service';

@Injectable()
export class PlanService {
  constructor(
    @Inject(REPOSITORIES.PLAN_REPOSITORY)
    private readonly planRepository: typeof Plan,
    private readonly walletService: WalletService,
    private readonly productService: ProductService,
    private readonly pendingPolicyService: PendingPolicyService,
    private readonly sequelize: Sequelize
  ) {}

  /**
   * Buy a plan for a product.
   * @param createPlanDto - The ID of the product.
   * @returns The created plan.
   */
  async create(createPlanDto: CreatePlanDto) {
    if (createPlanDto.quantity <= 0) {
      throw new BadRequestException('Quantity must be greater than zero');
    }
    const wallet: Wallet = await this.walletService.getWalletByUserId(
      createPlanDto.user_id,
    );
    const product = await this.productService.findOne(createPlanDto.product_id);
    const category = product?.category;
    if (!category) {
      throw new BadRequestException(
        'The supplied product does not have an associated category',
      );
    }
    const totalPrice = category?.price * createPlanDto.quantity;

    if (wallet.getBalance() < totalPrice) {
      throw new BadRequestException('Insufficient wallet balance');
    }
    const transaction = await this.sequelize.transaction();
    try {
      await this.walletService.deductBalance(createPlanDto.user_id, totalPrice, transaction);

      const plan = await this.planRepository.create(
        {
          userId: createPlanDto.user_id,
          productId: createPlanDto.product_id,
          quantity: createPlanDto.quantity,
          totalPrice: totalPrice,
          price: +category?.price,
        },
        { transaction },
      );

      console.log(plan)


      await this.pendingPolicyService.createPendingPolicies(plan.id, createPlanDto.user_id, createPlanDto.quantity, transaction);

      await transaction.commit();
      return plan;
    }catch (error){
      await transaction.rollback();
      console.log('Transaction failed:', error);
      throw error;
    }
  }
}
