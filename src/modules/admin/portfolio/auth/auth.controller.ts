import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import md5 from 'md5';
import { ConfigService } from 'src/common/config/config.service';
import { UserError } from 'src/common/db/models/portfolio/user/user.error';
import { UserService } from 'src/common/service/portfolio/user/user.service';
import { PortfolioRequest } from 'src/common/types/portfolio.types';
import { AuthUserGuard } from 'src/modules/common/guard/portfolio-auth.guard';
import { LoginDto } from './auth.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) {}

    @Post('login')
    async login(@Body() dto: LoginDto) {
        const user = await this.userService.getByUsername(dto.username);
        if (user.password !== md5(dto.password)) throw UserError.InvalidPassword();

        const token = await this.jwtService.signAsync(
            { username: user.username },
            {
                secret: this.configService.get('JWT_SECRET'),
                expiresIn: this.configService.get('JWT_EXPIRES'),
            },
        );

        return {
            token,
            username: user.username,
            _id: user._id,
        };
    }

    @Get('me')
    @ApiBearerAuth()
    @UseGuards(AuthUserGuard)
    async me(@Req() request: PortfolioRequest) {
        const user = await this.userService.findById(request.user._id);
        const { password, ...rest } = user.toObject ? user.toObject() : (user as any);
        return rest;
    }
}
