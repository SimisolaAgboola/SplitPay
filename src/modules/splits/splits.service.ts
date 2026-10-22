import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';

@Injectable()
export class SplitsService {
  constructor(private prisma: PrismaService) {}

  // Allow a participant to claim specific line items on a bill
  async claimItems(billId: string, participantId: string, itemIds: string[]) {
    const bill = await this.prisma.bill.findUnique({
      where: { id: billId },
      include: { items: true, participants: true },
    });

    if (!bill) {
      throw new NotFoundException('Bill not found');
    }

    // Verify participant belongs to this bill
    const participantExists = bill.participants.some(p => p.id === participantId);
    if (!participantExists) {
      throw new BadRequestException('Participant not found on this bill');
    }

    // Verify all requested line items belong to this bill
    const validItems = bill.items.filter(item => itemIds.includes(item.id));
    if (validItems.length !== itemIds.length) {
      throw new BadRequestException('One or more selected items are invalid for this bill');
    }

    // Create participant-item claim links in Prisma
    const claimPromises = itemIds.map(itemId =>
      this.prisma.participantItem.create({
        data: {
          participantId,
          lineItemId: itemId,
        },
      }),
    );

    await Promise.all(claimPromises);

    return {
      success: true,
      message: 'Items successfully claimed by participant',
    };
  }

  // Calculate the total breakdown for participants on the bill
  async calculateBillSummary(billId: string) {
    const bill = await this.prisma.bill.findUnique({
      where: { id: billId },
      include: {
        items: {
          include: {
            claimedBy: {
              include: {
                participant: true,
              },
            },
          },
        },
        participants: true,
      },
    });

    if (!bill) {
      throw new NotFoundException('Bill not found');
    }

    const participantTotals: { [participantName: string]: { items: any[]; subtotal: number; finalTotal: number } } = {};
    let subtotalAllItems = 0;

    // Initialize participants
    bill.participants.forEach(p => {
      participantTotals[p.name] = { items: [], subtotal: 0, finalTotal: 0 };
    });

    // Handle unclaimed bucket just in case
    participantTotals['Unclaimed'] = { items: [], subtotal: 0, finalTotal: 0 };

    bill.items.forEach(item => {
      subtotalAllItems += item.price;

      if (!item.claimedBy || item.claimedBy.length === 0) {
        participantTotals['Unclaimed'].items.push(item);
        participantTotals['Unclaimed'].subtotal += item.price;
      } else {
        // If an item is claimed by multiple people, split its cost evenly among them
        const numClaimants = item.claimedBy.length;
        const splitPrice = item.price / numClaimants;

        item.claimedBy.forEach(claim => {
          const participantName = claim.participant?.name || 'Unknown';
          if (!participantTotals[participantName]) {
            participantTotals[participantName] = { items: [], subtotal: 0, finalTotal: 0 };
          }
          participantTotals[participantName].items.push({ ...item, price: splitPrice });
          participantTotals[participantName].subtotal += splitPrice;
        });
      }
    });

    // Pro-portionally distribute tax and charges based on subtotals
    const taxFactor = subtotalAllItems > 0 ? bill.taxAndCharges / subtotalAllItems : 0;

    Object.keys(participantTotals).forEach(name => {
      const userSubtotal = participantTotals[name].subtotal;
      const userTaxShare = userSubtotal * taxFactor;
      participantTotals[name].finalTotal = parseFloat((userSubtotal + userTaxShare).toFixed(2));
    });

    return {
      billTitle: bill.title,
      overallTotal: bill.totalAmount,
      breakdown: participantTotals,
    };
  }
}
