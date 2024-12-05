import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { CONFIG_MESSAGES } from 'src/config/config';
import { ConfigService } from '@nestjs/config';
import * as jose from 'jose';
import { createHash } from 'crypto';
import { loginUserInput, registerUserInput } from './inputs/auth.inputs';

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
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException(CONFIG_MESSAGES.userNotFound);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException(CONFIG_MESSAGES.invalidPassword);
    }

    if (!user.verified) {
      throw new UnauthorizedException(CONFIG_MESSAGES.userNotVerified);
    }

    const { password: _, ...result } = user;
    return result;
  }

  async login(loginUserInput: loginUserInput) {
    try {
      const user = await this.validateUser(
        loginUserInput.email,
        loginUserInput.password,
      );

      return {
        message: CONFIG_MESSAGES.userLogged,
        accessToken: await this.generateJwtTokens(user),
        refreshToken: await this.generateRefreshTokens(user),
      };
    } catch (error) {
      throw error; // O ErrorInterceptor tratará o erro
    }
  }

  async register(registerUserInput: registerUserInput) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: registerUserInput.email },
    });

    if (existingUser && existingUser.verified) {
      throw new UnauthorizedException(CONFIG_MESSAGES.userAllReady);
    }

    const hashedPassword = await bcrypt.hash(registerUserInput.password, 10);

    if (existingUser && !existingUser.verified) {
      const updatedUser = await this.prisma.user.update({
        where: { email: registerUserInput.email },
        data: {
          ...registerUserInput,
          password: hashedPassword,
          verified: false,
        },
      });

      const verificationToken = await this.generateJwtTokens({
        id: updatedUser.id,
        email: updatedUser.email,
      });

      return {
        message: CONFIG_MESSAGES.userUpdated,
        verificationToken,
      };
    }

    const newUser = await this.prisma.user.create({
      data: {
        ...registerUserInput,
        password: hashedPassword,
        verified: false,
      },
    });

    const verificationToken = await this.generateJwtTokens({
      id: newUser.id,
      email: newUser.email,
    });

    return {
      message: CONFIG_MESSAGES.userCreated,
      verificationToken,
    };
  }

  async verifyUser(verifyToken: string) {
    try {
      const secret = this.configService.get('JWT_SECRET_KEY');
      const key = createHash('sha256').update(secret).digest();
      const { payload } = await jose.jwtDecrypt(verifyToken, key);

      const user = await this.prisma.user.update({
        where: { id: Number(payload.sub) },
        data: { verified: true },
      });

      return {
        message: CONFIG_MESSAGES.userVerified,
        accessToken: await this.generateJwtTokens(user),
        refreshToken: await this.generateRefreshTokens(user),
      };
    } catch (error) {
      throw new UnauthorizedException(CONFIG_MESSAGES.tokenInvalid);
    }
  }

  async refreshToken(refreshToken: string) {
    try {
      const secret = this.configService.get('REFRESH_SECRET_KEY');
      const key = createHash('sha256').update(secret).digest();
      const { payload } = await jose.jwtDecrypt(refreshToken, key);

      const user = await this.prisma.user.findUnique({
        where: { id: Number(payload.sub) },
      });

      if (!user) {
        throw new UnauthorizedException(CONFIG_MESSAGES.userNotFound);
      }

      return {
        message: CONFIG_MESSAGES.tokenRefreshed,
        accessToken: await this.generateRefreshTokens(user),
      };
    } catch {
      throw new UnauthorizedException(CONFIG_MESSAGES.tokenInvalid);
    }
  }

  async resetPwdSent(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException(CONFIG_MESSAGES.userNotFound);
    }

    const resetToken = await this.generateJwtTokens({
      id: user.id,
      email: user.email,
    });

    // Enviar o token por email

    return {
      message: CONFIG_MESSAGES.resetPasswordLinkSent,
      resetToken,
    };
  }

  async resetPwdConf(resetToken: string, newPassword: string) {
    try {
      const secret = this.configService.get('JWT_SECRET_KEY');
      const key = createHash('sha256').update(secret).digest();
      const { payload } = await jose.jwtDecrypt(resetToken, key);

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await this.prisma.user.update({
        where: { id: Number(payload.sub) },
        data: { password: hashedPassword },
      });

      return {
        message: CONFIG_MESSAGES.resetPasswordReseted,
        accessToken: await this.generateJwtTokens({
          id: payload.sub,
          email: payload.email,
        }),
        refreshToken: await this.generateRefreshTokens({
          id: payload.sub,
          email: payload.email,
        }),
      };
    } catch (error) {
      throw new UnauthorizedException(CONFIG_MESSAGES.tokenInvalid);
    }
  }
}
