import { Test, TestingModule } from '@nestjs/testing';
import { PendingPolicyService } from './pending-policy.service';
import { getModelToken } from '@nestjs/sequelize';
import { REPOSITORIES } from '../core/utils';

describe('PendingPolicyService', () => {
  let service: PendingPolicyService;

  const mockPendingPolicyRepository = {
    findAll: jest.fn().mockResolvedValue([
      { id: 1, plan_id: 1, status: 'unused' },
      { id: 2, plan_id: 1, status: 'unused' },
    ]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PendingPolicyService,
        { provide: REPOSITORIES.PENDING_POLICY_REPOSITORY, useValue: mockPendingPolicyRepository},
      ],
    }).compile();

    service = module.get<PendingPolicyService>(PendingPolicyService);
  });

  it('should return pending policies for a plan', async () => {
    const result = await service.findAll(1, 'unused');
    expect(mockPendingPolicyRepository.findAll).toHaveBeenCalledWith({
      where: { plan_id: 1, status: 'unused' },
    });
    expect(result).toEqual([
      { id: 1, plan_id: 1, status: 'unused' },
      { id: 2, plan_id: 1, status: 'unused' },
    ]);
  });
});
