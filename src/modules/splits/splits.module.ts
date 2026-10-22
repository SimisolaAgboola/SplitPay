import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { SplitsController } from './splits.controller.js';
import { SplitsService } from './splits.service.js';

@Module({
  controllers: [SplitsController],
  providers: [SplitsService, PrismaService],
})
export class SplitsModule {}
