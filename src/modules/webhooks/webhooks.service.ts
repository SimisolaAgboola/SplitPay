import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { PrismaService } from '../../prisma/prisma.service.js';

@Injectable()
export class WebhooksService {
  private paystackSecretKey: string;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    this.paystackSecretKey = this.configService.get<string>('PAYSTACK_SECRET_KEY') || '';
  }

  async handlePaystackWebhook(signature: string, payload: any) {
    // 1. Verify the signature to ensure security
    const hash = crypto
      .createHmac('sha512', this.paystackSecretKey)
      .update(JSON.stringify(payload))
      .digest('hex');

    if (hash !== signature) {
      throw new UnauthorizedException('Invalid webhook signature');
    }

    const event = payload.event;
    const data = payload.data;

    // 2. Handle successful charge events
    if (event === 'charge.success') {
      const { billId, participantId } = data.metadata || {};
      const amountPaid = data.amount / 100; // Convert from kobo back to main currency
      const reference = data.reference;

      if (billId && participantId) {
        console.log(`Payment successful for Bill: ${billId}, Participant: ${participantId}, Amount: ${amountPaid}`);

        // TODO: Update your database status here!
        // For example, you can create a Payment record or update a settlement flag:
        /*
        await this.prisma.payment.create({
          data: {
            billId,
            participantId,
            amount: amountPaid,
            reference,
            status: 'SUCCESS',
          },
        });
        */
      }
    }

    return { received: true };
  }
}
