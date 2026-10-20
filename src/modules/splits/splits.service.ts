import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';

@Injectable()
export class SplitsService {
  constructor(private prisma: PrismaService) {}

  // Allow a user to claim specific items on a bill
  async claimItems(billId: string, userId: string, itemIds: string[]) {
    // Verify bill exists
    const bill = await this.prisma.bill.findUnique({
      where: { id: billId },
      include: { items: true },
    });

    if (!bill) {
      throw new NotFoundException('Bill not found');
    }

    // Verify all requested items belong to this bill
    const validItems = bill.items.filter(item => itemIds.includes(item.id));
    if (validItems.length !== itemIds.length) {
      throw new BadRequestException('One or more selected items are invalid for this bill');
    }

    // Create or find user claim record / assign items
    // (Assuming you map claims in your Prisma schema or create a claim table)
    const claimedItemsUpdate = await Promise.all(
      itemIds.map(itemId =>
        this.prisma.item.update({
          where: { id: itemId },
          data: { claimedBy: userId }, // Assigns user to the item
        }),
      ),
    );

    return {
      success: true,
      message: 'Items successfully claimed',
      claimedItems: claimedItemsUpdate,
    };
  }

  // Calculate the total breakdown for everyone on the bill
  async calculateBillSummary(billId: string) {
    const bill = await this.prisma.bill.findUnique({
      where: { id: billId },
      include: { items: true },
    });

    if (!bill) {
      throw new NotFoundException('Bill not found');
    }

    // Group items by user who claimed them
    const userTotals: { [userId: string]: { items: any[]; subtotal: number; finalTotal: number } } = {};
    let subtotalAllItems = 0;

    bill.items.forEach(item => {
      subtotalAllItems += item.price;
      const debtor = item.claimedBy || 'Unclaimed';

      if (!userTotals[debtor]) {
        userTotals[debtor] = { items: [], subtotal: 0, finalTotal: 0 };
      }
      userTotals[debtor].items.push(item);
      userTotals[debtor].subtotal += item.price;
    });

    // Pro-portionally distribute tax and charges based on items claimed
    const taxFactor = subtotalAllItems > 0 ? (bill.taxAndCharges / subtotalAllItems) : 0;

    Object.keys(userTotals).forEach(user => {
      const userSubtotal = userTotals[user].subtotal;
      const userTaxShare = userSubtotal * taxFactor;
      userTotals[user].finalTotal = parseFloat((userSubtotal + userTaxShare).toFixed(2));
    });

    return {
      billTitle: bill.title,
      overallTotal: bill.totalAmount,
      breakdown: userTotals,
    };
  }
}
