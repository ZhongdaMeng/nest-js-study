import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';

export interface RegisterParams {
  username: string;
  password: string;
  email?: string;
  nickname?: string;
  avatar?: string;
  phone?: string;
  gender?: number;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(params: RegisterParams) {
    const { username, password, email, nickname, avatar, phone, gender } =
      params;

    const exists = await this.userRepo.findOne({ where: { username } });
    if (exists) {
      throw new ConflictException('用户名已存在');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepo.create({
      username,
      email: email || '',
      password: hashedPassword,
      nickname: nickname || '',
      avatar: avatar || '',
      phone: phone || undefined,
      gender: gender ?? 0,
    });
    const saved = await this.userRepo.save(user);
    const { password: _password, ...result } = saved;
    void _password;
    return { code: 200, message: '注册成功', data: result };
  }

  async login(username: string, password: string) {
    const user = await this.userRepo.findOne({
      where: { username },
      select: { id: true, username: true, email: true, password: true },
    });

    if (!user) {
      throw new UnauthorizedException('用户名或密码错误');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('用户名或密码错误');
    }

    const payload = { sub: user.id, username: user.username };
    const token = this.jwtService.sign(payload);

    return {
      code: 200,
      message: '登录成功',
      data: { token },
    };
  }

  async getProfile(userId: number) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('用户不存在');
    }

    return {
      code: 200,
      message: '获取用户信息成功',
      data: { user },
    };
  }
}
