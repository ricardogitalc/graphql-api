import { Catch, Logger } from '@nestjs/common';
import { GqlExceptionFilter } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';

@Catch(GraphQLError)
export class GraphqlExceptionFilter implements GqlExceptionFilter {
  logger = new Logger(GraphqlExceptionFilter.name);
  catch(exception: GraphQLError) {
    const timestamp = new Date().toLocaleTimeString();
    const code = exception.extensions?.code || 'ERROR';
    const message = exception.message;

    this.logger.error(
      `\x1b[31m[${timestamp}] code:[${code}]\x1b[0m: ${message}`,
    );

    return exception;
  }
}
