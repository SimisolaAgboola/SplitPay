import { Body, Controller, NotFoundException, Param, Post } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';

@Controller('bills')
export class ParticipantsController {
  constructor(private prisma: PrismaService) {}

  @Post(':billId/participants')
  async addParticipant(
    @Param('billId') billId: string,
    @Body('name') name: string,
  ) {
    const bill = await this.prisma.bill.findUnique({
      where: { id: billId },
    });

    if (!bill) {
      throw new NotFoundException('Bill not found');
    }

    const participant = await this.prisma.participant.create({
      data: {
        name,
        billId,
      },
    });

    return {
      success: true,
      message: 'Participant added successfully',
      participant,
    };
  }
}