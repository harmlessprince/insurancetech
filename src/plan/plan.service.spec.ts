import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from '../product/product.service';
import { ProductTypes, REPOSITORIES } from '../core/utils';
import { PlanService } from './plan.service';
import { WalletService } from '../wallet/wallet.service';
import { PendingPolicyService } from '../pending-policy/pending-policy.service';
import { Sequelize } from 'sequelize-typescript';
import { BadRequestException } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Plan } from './entities/plan.entity';
import { PendingPolicy } from '../pending-policy/entities/pending-policy.entity';
import { User } from '../user/entities/user.entity';
import { Policy } from '../policy/entities/policy.entity';
import { Category } from '../category/entities/category.entity';
import { Product } from '../product/entities/product.entity';
import { Wallet } from '../wallet/entities/wallet.entity';


describe('PlanService', () => {
  let service: PlanService;
  const mockPlan = {
    id: 1,
    user_id: 1,
    product_id: 1,
    quantity: 2,
    total_price: 20000,
  };

  const mockPlanRepository = {
    create: jest.fn().mockResolvedValue(mockPlan),
  };

  const mockWalletService = {
    getWalletByUserId: jest.fn(),
    deductBalance: jest.fn(),
  };

  const mockProductService = {
    findOne: jest.fn(),
  };

  const mockPendingPolicyPolicyService = {
    createPendingPolicies: jest.fn(),
  };
  const mockTransaction = {
    commit: jest.fn(),
    rollback: jest.fn(),
  };

  beforeEach(async () => {

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlanService,
        { provide: REPOSITORIES.PLAN_REPOSITORY, useValue: mockPlanRepository },
        { provide: WalletService, useValue: mockWalletService },
        { provide: ProductService, useValue: mockProductService },
        { provide: PendingPolicyService, useValue: mockPendingPolicyPolicyService },
        {
          provide: Sequelize,
          useValue: {
            transaction: jest.fn().mockResolvedValue(mockTransaction),
          },
        },
      ],
      imports: [
        SequelizeModule.forRoot({
          dialect: 'sqlite',
          storage: ':memory:',
          autoLoadModels: true,
          synchronize: true,
        }),
        SequelizeModule.forFeature([Plan, User, PendingPolicy, Policy, Category, Product, Wallet]),
      ]
    }).compile();
    service = module.get<PlanService>(PlanService);
  });

  it('should throw an error if the quantity is less than or equal to 0', async () => {
    const createPlanDto = { user_id: 1, product_id: 1, quantity: 0 };

    await expect(service.create(createPlanDto)).rejects.toThrow(
      'Quantity must be greater than zero',
    );
    expect(mockTransaction.commit).not.toHaveBeenCalled();
    expect(mockTransaction.rollback).not.toHaveBeenCalled();
  });

  it('should throw an error if the product has no associated category', async () => {
    mockProductService.findOne.mockResolvedValue({ category: null });

    const createPlanDto = { user_id: 1, product_id: 1, quantity: 2 };

    await expect(service.create(createPlanDto)).rejects.toThrow(
      'The supplied product does not have an associated category',
    );
  });

  it('should create a plan and handle all operations within a transaction', async () => {
    const mockWallet = { getBalance: () => 50000 };
    const mockProduct = { category: { price: 10000 } };
    const mockPlan = { id: 1  };

    mockWalletService.getWalletByUserId.mockResolvedValue(mockWallet);
    mockProductService.findOne.mockResolvedValue(mockProduct);
    mockPlanRepository.create.mockResolvedValue(mockPlan);

    const createPlanDto = { user_id: 1, product_id: 1, quantity: 2 };

    const result = await service.create(createPlanDto);

    expect(mockWalletService.getWalletByUserId).toHaveBeenCalledWith(1);
    expect(mockProductService.findOne).toHaveBeenCalledWith(1);
    expect(mockWalletService.deductBalance).toHaveBeenCalledWith(1, 20000, mockTransaction);
    expect(mockPlanRepository.create).toHaveBeenCalledWith(
      expect.objectContaining( {
        userId: 1,
        productId: 1,
        quantity: 2,
        totalPrice: 20000,
        price: 10000,
      }),
      { transaction: mockTransaction },
    );
    expect(mockPendingPolicyPolicyService.createPendingPolicies).toHaveBeenCalledWith(
      1,
      1,
      2,
      mockTransaction,
    );
    expect(mockTransaction.commit).toHaveBeenCalled();
    expect(result).toEqual(mockPlan);
  });
  it('should rollback the transaction and throw an error if any operation fails', async () => {
    mockWalletService.getWalletByUserId.mockResolvedValue({ getBalance: () => 10000 });
    mockProductService.findOne.mockResolvedValue({ category: { price: 10000 } });

    const createPlanDto = { user_id: 1, product_id: 1, quantity: 2 };

    await expect(service.create(createPlanDto)).rejects.toThrow(BadRequestException);
  });

});
