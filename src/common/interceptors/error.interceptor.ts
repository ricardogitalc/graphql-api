import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable, catchError, throwError } from 'rxjs';
import { GraphQLError } from 'graphql';

@Injectable()
export class ErrorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        if (error instanceof HttpException) {
          return throwError(
            () =>
              new GraphQLError(error.message, {
                extensions: {
                  code: error.getStatus(),
                  timestamp: new Date().toISOString(),
                  path: GqlExecutionContext.create(context).getInfo().path.key,
                },
              }),
          );
        }

        // Para erros do Prisma
        if (error.code) {
          switch (error.code) {
            case 'P2002':
              return throwError(
                () =>
                  new GraphQLError('Dados duplicados', {
                    extensions: {
                      code: 'CONFLICT',
                      field: error.meta?.target?.[0],
                    },
                  }),
              );
            case 'P2025':
              return throwError(
                () =>
                  new GraphQLError('Registro não encontrado', {
                    extensions: {
                      code: 'NOT_FOUND',
                    },
                  }),
              );
          }
        }

        return throwError(
          () =>
            new GraphQLError('Erro interno do servidor', {
              extensions: {
                code: 'INTERNAL_SERVER_ERROR',
              },
            }),
        );
      }),
    );
  }
}
