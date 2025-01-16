import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { PolicyService } from './policy.service';
import { CreatePolicyDto } from './dto/create-policy.dto';
import { UpdatePolicyDto } from './dto/update-policy.dto';
import { Policy } from './entities/policy.entity';
import { sendSuccessResponse } from '../core/utils';
import { ActivatePolicyDto } from './dto/activate-policy.dto';

@Controller('policy')
export class PolicyController {
  constructor(private readonly policyService: PolicyService) {}

  @Post()
  async create(@Body() activatePolicyDto: ActivatePolicyDto) {
    await this.policyService.activatePendingPolicy(activatePolicyDto);
    return sendSuccessResponse(null, "Policy activated successfully", 201);
  }

  @Get()
  async findAll(@Query('planId') planId?: number) {
    const policies: Policy[] = await this.policyService.findAll(planId);
    return sendSuccessResponse(policies, "Activated policies");
  }
}
