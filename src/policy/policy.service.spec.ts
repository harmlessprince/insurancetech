import { Test, TestingModule } from '@nestjs/testing';
import { PolicyService } from './policy.service';
import { PendingPolicyService } from '../pending-policy/pending-policy.service';
import { Sequelize } from 'sequelize-typescript';
import { BadRequestException } from '@nestjs/common';
import { CreatePolicyDto } from './dto/create-policy.dto';
import { ActivatePolicyDto } from './dto/activate-policy.dto';
import { Policy } from './entities/policy.entity';
import { PendingPolicy } from '../pending-policy/entities/pending-policy.entity';
import sequelize from 'sequelize';

const mockPolicyRepository = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
};

const mockPendingPolicyService = {
  findOnePendingPolicyById: jest.fn(),
  markAsUsed: jest.fn(),
};

const mockTransaction = {
  commit: jest.fn(),
  rollback: jest.fn(),
  afterCommit: jest.fn((callback) => callback()),
  LOCK: sequelize.Transaction.LOCK,
};

const mockSequelize = {
  transaction: jest.fn(() => mockTransaction),
};
describe('PolicyService', () => {
  let service: PolicyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PolicyService,
        { provide: 'POLICY_REPOSITORY', useValue: mockPolicyRepository },
        { provide: PendingPolicyService, useValue: mockPendingPolicyService },
        {
          provide: Sequelize,
          useValue: {
            transaction: jest.fn().mockResolvedValue(mockTransaction),
          },
        },
      ],
    }).compile();

    service = module.get<PolicyService>(PolicyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('activatePendingPolicy', () => {
    it('should activate a pending policy and create a new policy', async () => {
      const activatePolicyDto: ActivatePolicyDto = {
        pending_policy_id: 1,
        user_id: 1,
      };

      const pendingPolicy = {
        id: 1,
        userId: 1,
        planId: 2,
        plan: { dataValues: { product_id: 3 } },
      } as PendingPolicy;

      const transaction = mockSequelize.transaction();

      jest
        .spyOn(mockPendingPolicyService, 'findOnePendingPolicyById')
        .mockResolvedValue(pendingPolicy);
      jest.spyOn(mockPolicyRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(service, 'create').mockResolvedValue({} as Policy);

      await service.activatePendingPolicy(activatePolicyDto);

      expect(
        mockPendingPolicyService.findOnePendingPolicyById,
      ).toHaveBeenCalledWith(activatePolicyDto.pending_policy_id);
      expect(mockPolicyRepository.findOne).toHaveBeenCalledWith({
        where: {
          user_id: pendingPolicy.userId,
          product_id: pendingPolicy.plan.dataValues.product_id,
        },
      });
      expect(service.create).toHaveBeenCalledWith(
        {
          product_id: 3,
          user_id: 1,
          plan_id: 2,
        },
        transaction,
      );
      expect(mockPendingPolicyService.markAsUsed).toHaveBeenCalledWith(
        transaction,
        pendingPolicy.id,
      );
      expect(transaction.commit).toHaveBeenCalled();
    });

    it('should throw an error if pending policy does not belong to the user', async () => {
      const activatePolicyDto: ActivatePolicyDto = {
        pending_policy_id: 1,
        user_id: 2,
      };

      const pendingPolicy = { userId: 1 } as PendingPolicy;

      jest
        .spyOn(mockPendingPolicyService, 'findOnePendingPolicyById')
        .mockResolvedValue(pendingPolicy);

      await expect(
        service.activatePendingPolicy(activatePolicyDto),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw an error if a policy already exists for the product and user', async () => {
      const activatePolicyDto: ActivatePolicyDto = {
        pending_policy_id: 1,
        user_id: 1,
      };

      const pendingPolicy = {
        userId: 1,
        plan: { dataValues: { product_id: 3 } },
      } as PendingPolicy;

      const existingPolicy = {} as Policy;

      jest
        .spyOn(mockPendingPolicyService, 'findOnePendingPolicyById')
        .mockResolvedValue(pendingPolicy);
      jest
        .spyOn(mockPolicyRepository, 'findOne')
        .mockResolvedValue(existingPolicy);

      await expect(
        service.activatePendingPolicy(activatePolicyDto),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('create', () => {
    it('should create a new policy', async () => {
      const createPolicyDto: CreatePolicyDto = {
        user_id: 1,
        product_id: 2,
        plan_id: 3,
      };

      const transaction = mockSequelize.transaction();

      jest
        .spyOn(mockPolicyRepository, 'create')
        .mockResolvedValue({} as Policy);

      await service.create(createPolicyDto, transaction);

      expect(mockPolicyRepository.create).toHaveBeenCalledWith(
        {
          policy_number: expect.stringMatching(
            /PLO-\d{4}-[A-Z]{3}-\d{2}-PL-\d+-PR-\d+-USR-\d+/,
          ),
          user_id: createPolicyDto.user_id,
          product_id: createPolicyDto.product_id,
          plan_id: createPolicyDto.plan_id,
        },
        { transaction },
      );
    });
  });
});
