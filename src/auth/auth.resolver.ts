import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import {
  loginUserInput,
  refreshTokenInput,
  registerUserInput,
  resetPwdConfInput,
  resetPwdSentInput,
} from './inputs/auth.inputs';
import {
  LoginResponse,
  RefreshResponse,
  RegisterResponse,
  ResetResponse,
} from './responses/auth.responses';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => LoginResponse)
  async loginUser(@Args('loginUserInput') loginUserInput: loginUserInput) {
    return this.authService.login(loginUserInput);
  }

  @Mutation(() => RegisterResponse)
  async registerUser(
    @Args('registerUserInput') registerUserInput: registerUserInput,
  ) {
    return this.authService.register(registerUserInput);
  }

  @Mutation(() => LoginResponse)
  async verifyUser(@Args('verificationToken') verificationToken: string) {
    return this.authService.verifyUser(verificationToken);
  }

  @Mutation(() => RefreshResponse)
  async refreshToken(@Args('refreshToken') refreshToken: refreshTokenInput) {
    return this.authService.refreshToken(refreshToken.refreshToken);
  }

  @Mutation(() => ResetResponse)
  async resetPwdSent(
    @Args('resetPwdSentInput') resetPwdSentInput: resetPwdSentInput,
  ) {
    return this.authService.resetPwdSent(resetPwdSentInput.email);
  }

  @Mutation(() => LoginResponse)
  async resetPwdConf(
    @Args('resetPwdConfInput') resetPwdConfInput: resetPwdConfInput,
  ) {
    return this.authService.resetPwdConf(
      resetPwdConfInput.resetToken,
      resetPwdConfInput.newPassword,
    );
  }
}
