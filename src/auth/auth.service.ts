import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LoginInput } from './dto/login.input';
import * as bcrypt from 'bcrypt';
import { CONFIG_MESSAGES } from 'src/config/config';
import { ConfigService } from '@nestjs/config';
import * as jose from 'jose';
import { createHash } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  async generateJwtTokens(user: any) {
    const secret = this.configService.get('JWT_SECRET_KEY');
    const key = createHash('sha256').update(secret).digest();
    return await new jose.EncryptJWT({
      sub: user.id,
      email: user.email,
    })
      .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
      .setExpirationTime('30m')
      .encrypt(key);
  }

  async generateRefreshTokens(user: any) {
    const secret = this.configService.get('REFRESH_SECRET_KEY');
    const key = createHash('sha256').update(secret).digest();
    return await new jose.EncryptJWT({
      sub: user.id,
      email: user.email,
    })
      .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
      .setExpirationTime('1d')
      .encrypt(key);
  }

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginInput: LoginInput) {
    const user = await this.validateUser(loginInput.email, loginInput.password);

    if (!user) {
      throw new UnauthorizedException(CONFIG_MESSAGES.userNotFound);
    }

    return {
      message: CONFIG_MESSAGES.userLogged,
      access_token: await this.generateJwtTokens(user),
      refresh_token: await this.generateRefreshTokens(user),
    };
  }

  async register() {
    // logica de registro
  }

  async refreshToken(token: string) {
    try {
      const secret = this.configService.get('REFRESH_SECRET_KEY');
      const key = createHash('sha256').update(secret).digest();
      const { payload } = await jose.jwtDecrypt(token, key);

      const user = await this.prisma.user.findUnique({
        where: { id: Number(payload.sub) },
      });

      if (!user) {
        throw new UnauthorizedException(CONFIG_MESSAGES.userNotFound);
      }

      return {
        message: CONFIG_MESSAGES.tokenRefreshed,
        access_token: await this.generateRefreshTokens(user),
      };
    } catch {
      throw new UnauthorizedException(CONFIG_MESSAGES.tokenInvalid);
    }
  }
}
