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

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private configService: ConfigService) {
    super();
  }

  getRequest(context: ExecutionContext) {
    return GqlExecutionContext.create(context).getContext().req;
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
    const request = this.getRequest(context);
    const authHeader = request.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException(CONFIG_MESSAGES.tokenNotSent);
    }

    const token = authHeader.split(' ')[1];
    const { payload } = await this.validateToken(token);
    request.user = payload;

    return true;
  }
}
