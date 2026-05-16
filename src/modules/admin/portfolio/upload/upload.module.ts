import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from '../auth/auth.module';
import { PortfolioUploadController } from './upload.controller';

@Module({
    imports: [JwtModule.register({}), AuthModule],
    controllers: [PortfolioUploadController],
})
export class PortfolioUploadModule {}
