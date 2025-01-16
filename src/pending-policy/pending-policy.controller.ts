import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { PendingPolicyService } from './pending-policy.service';
import { CreatePendingPolicyDto } from './dto/create-pending-policy.dto';
import { UpdatePendingPolicyDto } from './dto/update-pending-policy.dto';
import { PendingPolicy } from './entities/pending-policy.entity';
import { PendingPolicyStatus, sendSuccessResponse } from '../core/utils';
import { SuccessResponseDTO } from '../core/responseDTO';

@Controller('pending-policy')
export class PendingPolicyController {
  constructor(private readonly pendingPolicyService: PendingPolicyService) {}

  @Get()
  async findAllPendingPolicies(@Query('planId') planId?: number): Promise<SuccessResponseDTO> {
    const  pendingPolicies: PendingPolicy[] = await this.pendingPolicyService.findAll(planId, PendingPolicyStatus.UNUSED);
    return sendSuccessResponse(pendingPolicies, "Pending policies retrieved successfully.");
  }
}
