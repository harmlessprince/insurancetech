import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PlanService } from './plan.service';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { Plan } from './entities/plan.entity';
import { sendSuccessResponse } from '../core/utils';
import { SuccessResponseDTO } from '../core/responseDTO';

@Controller('plans')
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  @Post('/buy')
  async create(
    @Body() createPlanDto: CreatePlanDto,
  ): Promise<SuccessResponseDTO> {
    const plan: Plan = await this.planService.create(createPlanDto);
    return sendSuccessResponse(plan, 'Plan purchased successfully', 201);
  }
}
