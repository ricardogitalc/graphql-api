import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginInput } from './dto/login.input';
import { LoginResponse } from './entities/login-response.entity';
import { RefreshTokenInput } from './dto/refresh-token.input';
import { RegisterInput } from './dto/register.input';
import { RegisterResponse } from './entities/register-response.entity';
import {
  RequestResetInput,
  ResetPasswordInput,
} from './dto/reset-password.input';
import { ResetResponse } from './entities/reset-response.entity';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => LoginResponse)
  async loginUser(@Args('loginInput') loginInput: LoginInput) {
    return this.authService.login(loginInput);
  }

  @Mutation(() => RegisterResponse)
  async registerUser(@Args('registerInput') registerInput: RegisterInput) {
    return this.authService.register(registerInput);
  }

  @Mutation(() => LoginResponse)
  async verifyUser(@Args('token') token: string) {
    return this.authService.verifyUser(token);
  }

  @Mutation(() => LoginResponse)
  async refreshToken(
    @Args('refreshTokenInput') refreshTokenInput: RefreshTokenInput,
  ) {
    return this.authService.refreshToken(refreshTokenInput.refreshToken);
  }

  @Mutation(() => ResetResponse)
  async resetPasswordSent(
    @Args('requestResetInput') requestResetInput: RequestResetInput,
  ) {
    return this.authService.resetPasswordSent(requestResetInput.email);
  }

  @Mutation(() => LoginResponse)
  async resetPasswordConfirm(
    @Args('resetPasswordInput') resetPasswordInput: ResetPasswordInput,
  ) {
    return this.authService.resetPasswordConfirm(
      resetPasswordInput.token,
      resetPasswordInput.newPassword,
    );
  }
}
