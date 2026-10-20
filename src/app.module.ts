import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module.js';
import { PrismaService } from './prisma/prisma.service.js';
import { ReceiptsModule } from './modules/receipts/receipts.module.js';
import { SplitsModule } from './modules/splits/splits.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    ReceiptsModule,
    SplitsModule,
  ],
  controllers: [],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
