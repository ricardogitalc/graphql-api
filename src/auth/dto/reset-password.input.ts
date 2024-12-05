// src/auth/dto/reset-password.input.ts
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class RequestResetInput {
  @Field()
  email: string;
}

@InputType()
export class ResetPasswordInput {
  @Field()
  token: string;

  @Field()
  newPassword: string;
}
