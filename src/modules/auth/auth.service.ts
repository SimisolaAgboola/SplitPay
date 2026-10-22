import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service.js';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  // Register or sign in a user via phone number
  async authenticateWithPhone(dto: { phone: string; name?: string }) {
    // Find or create the user based on their unique phone number
    let user = await this.prisma.user.findUnique({
      where: { phone: dto.phone },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          phone: dto.phone,
          name: dto.name || 'SplitPay User',
        },
      });
    }

    // Generate a JWT token for the user session
    const token = this.jwtService.sign({ sub: user.id, phone: user.phone });

    return {
      success: true,
      message: 'Authentication successful',
      accessToken: token,
      user: { id: user.id, phone: user.phone, name: user.name },
    };
  }
}
