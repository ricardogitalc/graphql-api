import { Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';

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

  getUserById(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  updateUser(id: number, updateUserInput: UpdateUserInput) {
    return this.prisma.user.update({
      where: { id },
      data: updateUserInput,
    });
  }

  deleteUser(id: number) {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
