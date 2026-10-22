import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { ParticipantsController } from './participants.controller.js';

@Module({
  controllers: [ParticipantsController],
  providers: [PrismaService],
})
export class ParticipantsModule {}
