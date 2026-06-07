import { Controller, Post, Get, Body, Req } from '@nestjs/common';
import type { Request } from 'express';
import { AuthService } from './auth.service';
import type { RegisterParams } from './auth.service';
import { Public } from './public.decorator';

interface AuthenticatedRequest extends Request {
  user?: { sub: number; username: string; tokenVersion: number };
}

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  async register(@Body() body: RegisterParams) {
    return this.authService.register(body);
  }

  @Public()
  @Post('login')
  async login(@Body() body: { username: string; password: string }) {
    return this.authService.login(body.username, body.password);
  }

  @Get('profile')
  async getProfile(@Req() req: AuthenticatedRequest) {
    const userId = req.user?.sub;
    if (!userId) {
      return { code: 401, msg: '未登录或 Token 无效' };
    }
    return this.authService.getProfile(userId);
  }

  @Public()
  @Post('reset-password')
  resetPassword(@Body() body: { username: string; password: string }) {
    return this.authService.resetPassword(body.username, body.password);
  }

  @Post('logout')
  logout(@Req() req: AuthenticatedRequest) {
    const userId = req.user?.sub;
    if (!userId) {
      return { code: 401, msg: '未登录或 Token 无效' };
    }
    return this.authService.logout(userId);
  }
}
