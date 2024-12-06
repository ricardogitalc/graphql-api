import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { UseGuards, ValidationPipe } from '@nestjs/common';
import { UpdateUserInput } from './inputs/user.inputs';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Role } from '@prisma/client';
import { Roles } from 'src/common/decorators/roles.decorator';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => [User])
  getAllUsers() {
    return this.usersService.getAllUsers();
  }

  @Query(() => User)
  getUserById(@Args('id', { type: () => Int }) id: number) {
    return this.usersService.getUserById(id);
  }

  @Mutation(() => User)
  @UseGuards(JwtAuthGuard, RolesGuard)
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
  deleteUserById(@Args('id', { type: () => Int }) id: number) {
    return this.usersService.deleteUserById(id);
  }

  @Query(() => User)
  @UseGuards(JwtAuthGuard)
  async getProfile(@CurrentUser() user: { sub: number }) {
    return this.usersService.getUserById(user.sub);
  }
}
