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
import { Public } from 'src/common/decorators/public.decorator';
import { Ip } from 'src/common/decorators/ip.decorator';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Mutation(() => LoginResponse)
  async loginUser(
    @Args('loginUserInput') loginUserInput: loginUserInput,
    @Ip() ip: string,
  ) {
    return this.authService.login(loginUserInput, ip);
  }

  @Public()
  @Mutation(() => RegisterResponse)
  async registerUser(
    @Args('registerUserInput') registerUserInput: registerUserInput,
  ) {
    return this.authService.register(registerUserInput);
  }

  @Public()
  @Mutation(() => LoginResponse)
  async verifyUser(@Args('verificationToken') verificationToken: string) {
    return this.authService.verifyUser(verificationToken);
  }

  @Public()
  @Mutation(() => RefreshResponse)
  async refreshToken(@Args('refreshToken') refreshToken: refreshTokenInput) {
    return this.authService.refreshToken(refreshToken.refreshToken);
  }

  @Public()
  @Mutation(() => ResetResponse)
  async resetPwdSent(
    @Args('resetPwdSentInput') resetPwdSentInput: resetPwdSentInput,
  ) {
    return this.authService.resetPwdSent(resetPwdSentInput.email);
  }

  @Public()
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
