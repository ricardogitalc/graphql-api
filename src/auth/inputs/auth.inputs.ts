import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class loginUserInput {
  @Field()
  email: string;

  @Field()
  password: string;
}

@InputType()
export class registerUserInput {
  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  email: string;

  @Field()
  password: string;

  @Field()
  whatsapp?: string;
}

@InputType()
export class verifyUserInput {
  @Field()
  email: string;

  @Field()
  code: string;
}

@InputType()
export class refreshTokenInput {
  @Field()
  refreshToken: string;
}

@InputType()
export class resetPwdSentInput {
  @Field()
  email: string;
}

@InputType()
export class resetPwdConfInput {
  @Field()
  resetToken: string;

  @Field()
  newPassword: string;
}
