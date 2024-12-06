import { InputType, Field } from '@nestjs/graphql';
import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  Matches,
} from 'class-validator';

@InputType()
export class loginUserInput {
  @Field()
  @IsEmail({}, { message: 'Email inválido' })
  email: string;

  @Field()
  @IsString()
  password: string;

}

@InputType()
export class registerUserInput {
  @Field()
  @IsString()
  @MinLength(2, { message: 'O nome deve ter no mínimo 2 caracteres' })
  firstName: string;

  @Field()
  @IsString()
  @MinLength(2, { message: 'O sobrenome deve ter no mínimo 2 caracteres' })
  lastName: string;

  @Field()
  @IsEmail({}, { message: 'Email inválido' })
  email: string;

  @Field()
  @IsString()
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#@$!%*?&])[A-Za-z\d#@$!%*?&]{8,}$/,
    {
      message: 'Crie uma senha forte, por exemplo: #SuaSenha123',
    },
  )
  password: string;

  @Field()
  @IsOptional()
  @Matches(/^[1-9]{2}[9]{1}[0-9]{8}$/, {
    message: 'Número de WhatsApp deve estar no formato: 11999999999',
  })
  whatsapp?: string;
}

@InputType()
export class refreshTokenInput {
  @Field()
  @IsString()
  refreshToken: string;
}

@InputType()
export class resetPwdSentInput {
  @Field()
  @IsEmail({}, { message: 'Email inválido' })
  email: string;
}

@InputType()
export class resetPwdConfInput {
  @Field()
  @IsString()
  resetToken: string;

  @Field()
  @IsString()
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#@$!%*?&])[A-Za-z\d#@$!%*?&]{8,}$/,
    {
      message: 'Crie uma senha forte, por exemplo: #SuaSenha123',
    },
  )
  newPassword: string;
}
