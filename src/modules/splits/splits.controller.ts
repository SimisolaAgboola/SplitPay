import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { SplitsService } from './splits.service.js';

@Controller('splits')
export class SplitsController {
  constructor(private readonly splitsService: SplitsService) {}

  @Post(':billId/claim')
  async claimItems(
    @Param('billId') billId: string,
    @Body('participantId') userId: string,
    @Body('itemIds') itemIds: string[],
  ) {
    return this.splitsService.claimItems(billId, userId, itemIds);
  }

  @Get(':billId/summary')
  async getSummary(@Param('billId') billId: string) {
    return this.splitsService.calculateBillSummary(billId);
  }
}
