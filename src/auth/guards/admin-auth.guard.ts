import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { CONFIG_MESSAGES } from 'src/config/config';
import { JwtAuthGuard } from './jwt-auth.guard';
import { GqlExecutionContext } from '@nestjs/graphql';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AdminGuard extends JwtAuthGuard {
  constructor(
    configService: ConfigService,
    private prisma: PrismaService,
  ) {
    super(configService);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    await super.canActivate(context);

    const { user } = GqlExecutionContext.create(context).getContext().req;
    const dbUser = await this.prisma.user.findUnique({
      where: { id: user.sub },
      select: { role: true },
    });

    if (dbUser?.role !== 'ADMIN') {
      throw new UnauthorizedException(CONFIG_MESSAGES.adminOnly);
    }

    return true;
  }
}
