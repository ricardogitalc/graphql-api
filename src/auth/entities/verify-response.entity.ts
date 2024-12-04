import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class VerifyResponse {
  @Field()
  message: string;

  @Field()
  verified: boolean;
}
