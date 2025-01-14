import { Test, TestingModule } from '@nestjs/testing';
import { PendingPolicyService } from './pending-policy.service';

describe('PendingPolicyService', () => {
  let service: PendingPolicyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PendingPolicyService],
    }).compile();

    service = module.get<PendingPolicyService>(PendingPolicyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
