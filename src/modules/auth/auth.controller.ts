import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('phone-auth')
  async phoneAuth(@Body() body: { phone: string; name?: string }) {
    return this.authService.authenticateWithPhone(body);
  }
}
