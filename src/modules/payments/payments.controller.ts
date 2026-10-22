import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { PaymentsService } from './payments.service.js';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('initialize')
  async initializePayment(
    @Body('billId') billId: string,
    @Body('participantId') participantId: string,
    @Body('email') email: string,
  ) {
    return this.paymentsService.initializePayment(billId, participantId, email);
  }

  @Get('verify')
  async verifyPayment(@Query('reference') reference: string) {
    return this.paymentsService.verifyPayment(reference);
  }
}
