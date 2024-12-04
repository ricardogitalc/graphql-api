import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class VerifyInput {
  @Field()
  email: string;

  @Field()
  code: string;
}
