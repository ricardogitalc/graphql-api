import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggerInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = GqlExecutionContext.create(context);
    const operation = ctx.getInfo().operation.operation;
    const fieldName = ctx.getInfo().fieldName;
    const timestamp = new Date().toLocaleTimeString();

    return next.handle().pipe(
      tap((response) => {
        this.logger.log(
          `\x1b[32m[${timestamp}] ${operation} ${fieldName} - Sucesso\x1b[0m`,
        );
      }),
    );
  }
}
