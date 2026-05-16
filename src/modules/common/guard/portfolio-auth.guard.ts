import { CanActivate, ExecutionContext, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { ConfigService } from 'src/common/config/config.service';
import { UserService } from 'src/common/service/portfolio/user/user.service';

@Injectable()
export class AuthUserGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private userService: UserService,
        private configService: ConfigService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) throw new UnauthorizedException();

        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: this.configService.get('JWT_SECRET'),
            });
            request['payload'] = payload;
            const user = await this.userService.getByUsername(payload.username);
            request.user = user;
        } catch (error) {
            Logger.warn(error);
            throw new UnauthorizedException();
        }
        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}
