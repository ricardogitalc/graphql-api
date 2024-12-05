// src/auth/types/reset-response.type.ts
import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class ResetResponse {
  @Field()
  message: string;

  @Field()
  resetToken: string;
}
