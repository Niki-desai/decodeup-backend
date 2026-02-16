import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

// Auth Service //
@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private jwtService: JwtService,
    ) { }

    // Signup //
    async signup(signupDto: SignupDto) {
        const { email, password } = signupDto;

        // Check if user exists //
        const existingUser = await this.userRepository.findOne({ where: { email } });
        if (existingUser) {
            throw new ConflictException('Email already exists');
        }

        // Hash password //
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user //
        const user = this.userRepository.create({
            email,
            password: hashedPassword,
        });

        await this.userRepository.save(user);

        // Generate JWT //
        const token = this.jwtService.sign({ sub: user.id, email: user.email });

        return {
            token,
            user: { id: user.id, email: user.email },
        };
    }

    // Login //
    async login(loginDto: LoginDto) {
        const { email, password } = loginDto;

        // Find user //
        const user = await this.userRepository.findOne({ where: { email } });
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // Verify password //
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // Generate JWT //
        const token = this.jwtService.sign({ sub: user.id, email: user.email });

        return {
            token,
            user: { id: user.id, email: user.email },
        };
    }
}
