import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { PrismaService } from '../../prisma/prisma.service.js';

@Injectable()
export class PaymentsService {
  private paystackSecretKey: string;
  private paystackBaseUrl = 'https://api.paystack.co';

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    this.paystackSecretKey = this.configService.get<string>('PAYSTACK_SECRET_KEY') || '';
  }

  // 1. Initialize a transaction for a participant's split share
  async initializePayment(billId: string, participantId: string, email: string) {
    // Fetch bill and participants to verify details
    const bill = await this.prisma.bill.findUnique({
      where: { id: billId },
      include: {
        items: {
          include: {
            claimedBy: { include: { participant: true } },
          },
        },
        participants: true,
      },
    });

    if (!bill) {
      throw new NotFoundException('Bill not found');
    }

    const participant = bill.participants.find(p => p.id === participantId);
    if (!participant) {
      throw new NotFoundException('Participant not found on this bill');
    }

    // Calculate this specific participant's share using the same math logic
    let participantSubtotal = 0;
    let subtotalAllItems = 0;

    bill.items.forEach(item => {
      subtotalAllItems += item.price;
      if (item.claimedBy && item.claimedBy.length > 0) {
        const splitPrice = item.price / item.claimedBy.length;
        item.claimedBy.forEach(claim => {
          if (claim.participantId === participantId) {
            participantSubtotal += splitPrice;
          }
        });
      }
    });

    const taxFactor = subtotalAllItems > 0 ? bill.taxAndCharges / subtotalAllItems : 0;
    const finalAmountToPay = participantSubtotal + (participantSubtotal * taxFactor);

    if (finalAmountToPay <= 0) {
      throw new BadRequestException('Participant has no balance to pay');
    }

    // Paystack accepts amounts in kobo/cents (multiply by 100)
    const amountInKobo = Math.round(finalAmountToPay * 100);

    try {
      const response = await axios.post(
        `${this.paystackBaseUrl}/transaction/initialize`,
        {
          email,
          amount: amountInKobo,
          metadata: {
            billId,
            participantId,
            participantName: participant.name,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${this.paystackSecretKey}`,
            'Content-Type': 'application/json',
          },
        },
      );

      return {
        success: true,
        authorizationUrl: response.data.data.authorization_url,
        reference: response.data.data.reference,
      };
    } catch (error: any) {
      console.error('Paystack Initialization Error:', error.response?.data || error.message);
      throw new BadRequestException('Failed to initialize payment with Paystack');
    }
  }

  // 2. Verify payment after completion
  async verifyPayment(reference: string) {
    try {
      const response = await axios.get(
        `${this.paystackBaseUrl}/transaction/verify/${reference}`,
        {
          headers: {
            Authorization: `Bearer ${this.paystackSecretKey}`,
          },
        },
      );

      const txData = response.data.data;

      if (txData.status === 'success') {
        const { billId, participantId } = txData.metadata;

        // Optional: Update a payment status table or mark bill share as settled
        return {
          success: true,
          message: 'Payment verified successfully!',
          data: {
            billId,
            participantId,
            amountPaid: txData.amount / 100,
            channel: txData.channel,
            paidAt: txData.paid_at,
          },
        };
      } else {
        throw new BadRequestException('Transaction was not successful');
      }
    } catch (error: any) {
      console.error('Paystack Verification Error:', error.response?.data || error.message);
      throw new BadRequestException('Payment verification failed');
    }
  }
}
