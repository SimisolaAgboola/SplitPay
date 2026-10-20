import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { ReceiptsController } from './receipts.controller.js';
import { ReceiptsService } from './receipts.service.js';

@Module({
  controllers: [ReceiptsController],
  providers: [ReceiptsService, PrismaService],
})
export class ReceiptsModule {}
