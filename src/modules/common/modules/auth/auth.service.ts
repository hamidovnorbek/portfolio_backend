import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { configService } from 'src/common/config/config.service';

@Injectable()
export class AuthService {
    constructor(private jwtService: JwtService) {}

    generateJwt(payload): Promise<string> {
        return this.jwtService.signAsync(payload, {
            secret: configService.get('JWT_SECRET'),
        });
    }
    verifyJwt(jwt: string): Promise<any> {
        return this.jwtService.verifyAsync(jwt, {
            secret: configService.get('JWT_SECRET'),
        });
    }
}
export const authService = new AuthService(new JwtService());
