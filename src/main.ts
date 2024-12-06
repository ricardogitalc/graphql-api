import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GraphqlExceptionFilter } from './common/filters/graphql-exception.filter';
import { BadRequestException, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['debug', 'error', 'fatal', 'log', 'verbose', 'warn'],
  });

  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      validateCustomDecorators: true,
      stopAtFirstError: false,
      exceptionFactory: (errors) => {
        const messages = errors.map((error) =>
          Object.values(error.constraints).join(', '),
        );
        return new BadRequestException(messages);
      },
    }),
  );

  app.useGlobalFilters(new GraphqlExceptionFilter());

  await app.listen(8000);
}
bootstrap();
