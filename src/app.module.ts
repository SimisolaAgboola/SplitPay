import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module.js';
import { ParticipantsModule } from './modules/participants/participants.module.js';
import { PaymentsModule } from './modules/payments/payments.module.js';
import { ReceiptsModule } from './modules/receipts/receipts.module.js';
import { SplitsModule } from './modules/splits/splits.module.js';
import { WebhooksModule } from './modules/webhooks/webhooks.module.js';
import { PrismaService } from './prisma/prisma.service.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    ReceiptsModule,
    SplitsModule,
    ParticipantsModule,
    PaymentsModule,
    WebhooksModule,
  ],
  controllers: [],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
