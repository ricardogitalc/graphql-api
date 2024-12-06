import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  BadRequestException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable, catchError, throwError } from 'rxjs';
import { GraphQLError } from 'graphql';

interface ValidationError {
  message: string[];
  error: string;
  statusCode: number;
}

@Injectable()
export class ErrorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        if (error instanceof BadRequestException) {
          const validationErrors = error.getResponse() as
            | ValidationError
            | string;

          if (
            typeof validationErrors === 'object' &&
            Array.isArray(validationErrors.message)
          ) {
            const path = GqlExecutionContext.create(context).getInfo().path.key;

            const inputMapping = {
              loginUser: 'Login',
              registerUser: 'Registro',
              resetPwdSent: 'Redefinição de senha',
              resetPwdConf: 'Confirmação de nova senha',

              createUser: 'Criação de usuário',
              updateUser: 'Atualização de usuário',
            };

            const operationName = inputMapping[path] || 'Validação';

            return throwError(
              () =>
                new GraphQLError(`Erro de ${operationName}`, {
                  extensions: {
                    code: 'VALIDATION_ERROR',
                    operation: path,
                    validationErrors: validationErrors.message.map((error) => ({
                      message: error,
                      field:
                        error.toLowerCase().includes('nome') &&
                        error.toLowerCase().includes('sobrenome')
                          ? 'lastName'
                          : error.toLowerCase().includes('nome')
                            ? 'firstName'
                            : error.toLowerCase().includes('email')
                              ? 'email'
                              : error.toLowerCase().includes('senha')
                                ? 'password'
                                : error.toLowerCase().includes('whatsapp')
                                  ? 'whatsapp'
                                  : 'unknown',
                    })),
                    timestamp: new Date().toISOString(),
                  },
                }),
            );
          }
        }

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
