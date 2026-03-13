import { IsString, IsEmail, IsNotEmpty, MinLength, IsEnum } from 'class-validator';
import { Role } from 'src/enums/user';

export class RegisterDto {
    @IsString()
    @IsNotEmpty()
    username: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @MinLength(8)
    password: string;

    @IsEnum(Role)
    role: Role.USER;
}