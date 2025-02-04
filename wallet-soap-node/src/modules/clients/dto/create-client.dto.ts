import { IsString, IsEmail, IsNotEmpty, Matches } from 'class-validator';

export class CreateClientDto {
  @IsNotEmpty()
  @IsString()
  @Matches(/^\d+$/, { message: 'El documento debe contener solo dígitos' })
  document: string;

  @IsNotEmpty()
  @IsString()
  names: string;

  @IsNotEmpty()
  @IsEmail({}, { message: 'El correo no es válido' })
  email: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^\d{10}$/, { message: 'El teléfono debe tener 10 dígitos' })
  phone: string;
}