import { IsEmail, IsString, MinLength } from 'class-validator';

// Signup DTO //
export class SignupDto {
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    password: string;
}
