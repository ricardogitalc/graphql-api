import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginInput } from './dto/login.input';
import { LoginResponse } from './entities/login-response.entity';
import { RefreshTokenInput } from './dto/refresh-token.input';
import { RegisterResponse } from './entities/login-response.entity copy';
import { RegisterInput } from './dto/register.input';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => LoginResponse)
  async loginUser(@Args('loginInput') loginInput: LoginInput) {
    return this.authService.login(loginInput);
  }

  @Mutation(() => RegisterResponse)
  async registerUser(@Args('registerInput') registerInput: RegisterInput) {
    // logica de registro
  }

  @Mutation(() => LoginResponse)
  async refreshToken(
    @Args('refreshTokenInput') refreshTokenInput: RefreshTokenInput,
  ) {
    return this.authService.refreshToken(refreshTokenInput.refresh_token);
  }
}
