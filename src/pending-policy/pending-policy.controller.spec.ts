import { Test, TestingModule } from '@nestjs/testing';
import { PendingPolicyController } from './pending-policy.controller';
import { PendingPolicyService } from './pending-policy.service';

describe('PendingPolicyController', () => {
  let controller: PendingPolicyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PendingPolicyController],
      providers: [PendingPolicyService],
    }).compile();

    controller = module.get<PendingPolicyController>(PendingPolicyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
