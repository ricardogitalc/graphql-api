import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import * as bcrypt from 'bcrypt';
import { UseGuards } from '@nestjs/common';
import { AdminGuard } from 'src/auth/guards/admin-auth.guard';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => User)
  createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.usersService.createUser(createUserInput);
  }

  @Query(() => [User], { name: 'getAllUsers' })
  @UseGuards(AdminGuard)
  getAllUsers() {
    return this.usersService.getAllUsers();
  }

  @UseGuards(AdminGuard)
  @Query(() => User, { name: 'getUserById' })
  getUserById(@Args('id', { type: () => Int }) id: number) {
    return this.usersService.getUserById(id);
  }

  @UseGuards(AdminGuard)
  @Mutation(() => User)
  async updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    if (updateUserInput.password) {
      const hashedPassword = await bcrypt.hash(updateUserInput.password, 10);
      updateUserInput.password = hashedPassword;
    }
    return this.usersService.updateUser(updateUserInput.id, updateUserInput);
  }

  @UseGuards(AdminGuard)
  @Mutation(() => User)
  deleteUser(@Args('id', { type: () => Int }) id: number) {
    return this.usersService.deleteUser(id);
  }
}
