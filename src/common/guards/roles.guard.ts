import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Role } from '@prisma/client';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { PrismaService } from 'src/prisma/prisma.service';
import { CONFIG_MESSAGES } from 'src/config/config';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const gqlContext = GqlExecutionContext.create(context);
    const { user } = gqlContext.getContext().req;

    if (!user) {
      throw new UnauthorizedException(CONFIG_MESSAGES.tokenNotSent);
    }

    const dbUser = await this.prisma.user.findUnique({
      where: { id: user.sub },
      select: { role: true, email: true },
    });

    if (!dbUser) {
      throw new UnauthorizedException(CONFIG_MESSAGES.userNotFound);
    }

    const hasRole = requiredRoles.includes(dbUser.role);

    if (!hasRole) {
      throw new UnauthorizedException(CONFIG_MESSAGES.userNoPermission);
    }

    return hasRole;
  }
}
