import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class LoginResponse {
  @Field()
  message: string;

  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;

  @Field()
  ip: string;
}

@ObjectType()
export class RegisterResponse {
  @Field()
  message: string;

  @Field()
  verificationToken: string;
}

@ObjectType()
export class RefreshResponse {
  @Field()
  message: string;

  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;
}

@ObjectType()
export class ResetResponse {
  @Field()
  message: string;

  @Field()
  resetToken: string;
}
