import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from 'src/common/config/config.service';
import { UserService } from 'src/common/service/portfolio/user/user.service';
import { AuthUserGuard } from 'src/modules/common/guard/portfolio-auth.guard';
import { AuthController } from './auth.controller';

@Module({
    imports: [JwtModule.register({})],
    controllers: [AuthController],
    providers: [UserService, ConfigService, AuthUserGuard],
    exports: [UserService, ConfigService, AuthUserGuard],
})
export class AuthModule {}
