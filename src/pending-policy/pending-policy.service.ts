import { Injectable } from '@nestjs/common';
import { CreatePendingPolicyDto } from './dto/create-pending-policy.dto';
import { UpdatePendingPolicyDto } from './dto/update-pending-policy.dto';

@Injectable()
export class PendingPolicyService {
  create(createPendingPolicyDto: CreatePendingPolicyDto) {
    return 'This action adds a new pendingPolicy';
  }

  findAll() {
    return `This action returns all pendingPolicy`;
  }

  findOne(id: number) {
    return `This action returns a #${id} pendingPolicy`;
  }

  update(id: number, updatePendingPolicyDto: UpdatePendingPolicyDto) {
    return `This action updates a #${id} pendingPolicy`;
  }

  remove(id: number) {
    return `This action removes a #${id} pendingPolicy`;
  }
}
