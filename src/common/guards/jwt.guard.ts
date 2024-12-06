import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import * as jose from 'jose';
import { createHash } from 'crypto';
import { CONFIG_MESSAGES } from 'src/config/config';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { Reflector } from '@nestjs/core';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private configService: ConfigService,
    private reflector: Reflector,
  ) {
    super();
  }

  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;
    return request;
  }

  protected async validateToken(token: string) {
    try {
      const secret = this.configService.get<string>('JWT_SECRET_KEY');
      const key = createHash('sha256').update(secret).digest();
      return await jose.jwtDecrypt(token, key);
    } catch {
      throw new UnauthorizedException('Token inválido ou expirado');
    }
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = this.getRequest(context);
    const authHeader = request.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException(CONFIG_MESSAGES.tokenNotSent);
    }

    const token = authHeader.split(' ')[1];
    const { payload } = await this.validateToken(token);

    request.user = {
      sub: payload.sub,
      email: payload.email,
    };

    return true;
  }
}
