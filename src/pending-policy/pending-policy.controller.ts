import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PendingPolicyService } from './pending-policy.service';
import { CreatePendingPolicyDto } from './dto/create-pending-policy.dto';
import { UpdatePendingPolicyDto } from './dto/update-pending-policy.dto';

@Controller('pending-policy')
export class PendingPolicyController {
  constructor(private readonly pendingPolicyService: PendingPolicyService) {}

  @Post()
  create(@Body() createPendingPolicyDto: CreatePendingPolicyDto) {
    return this.pendingPolicyService.create(createPendingPolicyDto);
  }

  @Get()
  findAll() {
    return this.pendingPolicyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pendingPolicyService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePendingPolicyDto: UpdatePendingPolicyDto) {
    return this.pendingPolicyService.update(+id, updatePendingPolicyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pendingPolicyService.remove(+id);
  }
}
