import { Module } from '@nestjs/common';
import { SplitsController } from './splits.controller.js';
import { SplitsService } from './splits.service.js';

@Module({
  controllers: [SplitsController],
  providers: [SplitsService]
})
export class SplitsModule {}
