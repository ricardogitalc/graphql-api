import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { UpdateUserInput } from './dto/update-user.input';
import * as bcrypt from 'bcrypt';
import { UseGuards, ValidationPipe } from '@nestjs/common';
import { AdminGuard } from 'src/auth/guards/admin-auth.guard';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => [User])
  @UseGuards(AdminGuard)
  getAllUsers() {
    return this.usersService.getAllUsers();
  }

  @UseGuards(AdminGuard)
  @Query(() => User)
  getUserById(@Args('id', { type: () => Int }) id: number) {
    return this.usersService.getUserById(id);
  }

  @UseGuards(AdminGuard)
  @Mutation(() => User)
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

  @UseGuards(AdminGuard)
  @Mutation(() => User)
  deleteUserById(@Args('id', { type: () => Int }) id: number) {
    return this.usersService.deleteUserById(id);
  }
}
