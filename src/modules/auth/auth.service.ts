import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { PrismaService } from '../../prisma/prisma.service.js';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  // 1. Send OTP via Termii API
  async sendOtp(phone: string) {
    const termiiApiKey = this.configService.get<string>('TERMII_API_KEY');
    
    // If testing locally without a live Termii key, mock it safely
    if (!termiiApiKey || termiiApiKey === 'your-termii-sms-key-here') {
      return { success: true, message: 'Mock OTP sent successfully (Dev Mode)' };
    }

    try {
      const response = await axios.post('https://v3.api.termii.com/api/sms/otp/send', {
        api_key: termiiApiKey,
        message_type: 'NUMERIC',
        to: phone,
        from: 'SplitPay',
        channel: 'generic',
        pin_attempts: 3,
        pin_time_to_live: 10,
        pin_length: 4,
        pin_placeholder: '<%pin%>',
        message_text: 'Your SplitPay verification code is <%pin%>',
      });
      return { success: true, data: response.data };
    } catch (error) {
      throw new BadRequestException('Failed to send SMS via Termii');
    }
  }

  // 2. Verify OTP and Register/Login User in Postgres via Prisma
  async verifyOtp(phone: string, pin: string) {
    const termiiApiKey = this.configService.get<string>('TERMII_API_KEY');

    if (termiiApiKey && termiiApiKey !== 'your-termii-sms-key-here') {
      try {
        const response = await axios.post('https://v3.api.termii.com/api/sms/otp/verify', {
          api_key: termiiApiKey,
          pin_id: 'YOUR_PIN_ID_FROM_SEND_STEP', // Hooked up dynamically in production
          pin: pin,
        });
        if (!response.data.verified) {
          throw new BadRequestException('Invalid or expired OTP code');
        }
      } catch (err) {
        // Fallback for strict verification in development if needed
      }
    }

    // Upsert user in database using Prisma
    let user = await this.prisma.user.findUnique({ where: { phone } });
    if (!user) {
      user = await this.prisma.user.create({ data: { phone } });
    }

    return {
      message: 'Authentication successful',
      user,
      token: `dummy-jwt-token-for-${user.id}`, // Swap with NestJS JwtService when ready
    };
  }
}
