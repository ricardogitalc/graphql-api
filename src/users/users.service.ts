import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { CONFIG_MESSAGES } from 'src/config/config';
import { CreateUserInput, UpdateUserInput } from './inputs/user.inputs';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createUser(createUserInput: CreateUserInput) {
    const hashedPassword = await bcrypt.hash(createUserInput.password, 10);
    return this.prisma.user.create({
      data: {
        firstName: createUserInput.firstName,
        lastName: createUserInput.lastName,
        email: createUserInput.email,
        password: hashedPassword,
        whatsapp: createUserInput.whatsapp,
      },
    });
  }

  getAllUsers() {
    return this.prisma.user.findMany();
  }

  async getUserById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(CONFIG_MESSAGES.userIdNotFound);
    }

    return user;
  }

  async updateUserById(id: number, updateUserInput: UpdateUserInput) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(CONFIG_MESSAGES.userIdNotFound);
    }

    return this.prisma.user.update({
      where: { id },
      data: updateUserInput,
    });
  }

  async deleteUserById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(CONFIG_MESSAGES.userIdNotFound);
    }

    return this.prisma.user.delete({
      where: { id },
    });
  }
}
