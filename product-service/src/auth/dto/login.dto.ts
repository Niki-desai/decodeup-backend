import { IsEmail, IsString } from 'class-validator';

// Login DTO //
export class LoginDto {
    @IsEmail()
    email: string;

    @IsString()
    password: string;
}
