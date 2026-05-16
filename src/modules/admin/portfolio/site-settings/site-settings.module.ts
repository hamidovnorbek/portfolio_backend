import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SiteSettingsService } from 'src/common/service/portfolio/site-settings/site-settings.service';
import { AuthModule } from '../auth/auth.module';
import { SiteSettingsController } from './site-settings.controller';

@Module({
    imports: [JwtModule.register({}), AuthModule],
    controllers: [SiteSettingsController],
    providers: [SiteSettingsService],
    exports: [SiteSettingsService],
})
export class SettingsModule {}
