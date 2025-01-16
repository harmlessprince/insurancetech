import { Test, TestingModule } from '@nestjs/testing';
import { PendingPolicyController } from './pending-policy.controller';
import { PendingPolicyService } from './pending-policy.service';

describe('PendingPolicyController', () => {
  let controller: PendingPolicyController;
  let service: PendingPolicyService;

  const mockPendingPolicyService = {
    findAll: jest.fn().mockResolvedValue([
      { id: 1, plan_id: 1, status: 'unused' },
      { id: 2, plan_id: 1, status: 'unused' },
    ]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PendingPolicyController],
      providers: [
        { provide: PendingPolicyService, useValue: mockPendingPolicyService },
      ],
    }).compile();

    controller = module.get<PendingPolicyController>(PendingPolicyController);
    service = module.get<PendingPolicyService>(PendingPolicyService);
  });

  it('should return pending policies for a plan', async () => {
    const result = await controller.findAllPendingPolicies(1);

    expect(service.findAll).toHaveBeenCalledWith(1, 'unused');
    expect(result.data).toEqual([
      { id: 1, plan_id: 1, status: 'unused' },
      { id: 2, plan_id: 1, status: 'unused' },
    ]);
  });
});
