import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { UpdateUserInput, UpdateProfileInput } from './inputs/user.inputs';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Role } from '@prisma/client';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ValidationPipe } from '@nestjs/common';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => User)
  async getProfile(@CurrentUser() user: { sub: number }) {
    return this.usersService.getUserById(user.sub);
  }

  @Mutation(() => User)
  async updateProfile(
    @CurrentUser() user: { sub: number },
    @Args('updateProfileInput', new ValidationPipe())
    UpdateProfileInput: UpdateProfileInput,
  ) {
    if (UpdateProfileInput.password) {
      const hashedPassword = await bcrypt.hash(UpdateProfileInput.password, 10);
      UpdateProfileInput.password = hashedPassword;
    }
    return this.usersService.updateUserById(user.sub, UpdateProfileInput);
  }

  @Mutation(() => User)
  async deleteProfile(@CurrentUser() user: { sub: number }) {
    return this.usersService.deleteUserById(user.sub);
  }

  @Query(() => [User])
  @Roles(Role.ADMIN)
  getAllUsers() {
    return this.usersService.getAllUsers();
  }

  @Query(() => User)
  @Roles(Role.ADMIN)
  getUserById(@Args('id', { type: () => Int }) id: number) {
    return this.usersService.getUserById(id);
  }

  @Mutation(() => User)
  @Roles(Role.ADMIN)
  async updateUserById(
    @Args('updateUserInput', new ValidationPipe())
    updateUserInput: UpdateUserInput,
  ) {
    if (updateUserInput.password) {
      const hashedPassword = await bcrypt.hash(updateUserInput.password, 10);
      updateUserInput.password = hashedPassword;
    }
    return this.usersService.updateUserById(
      updateUserInput.id,
      updateUserInput,
    );
  }

  @Mutation(() => User)
  @Roles(Role.ADMIN)
  deleteUserById(@Args('id', { type: () => Int }) id: number) {
    return this.usersService.deleteUserById(id);
  }
}
