import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ExperienceService } from 'src/common/service/portfolio/experience/experience.service';
import { AuthModule } from '../auth/auth.module';
import { ExperienceController } from './experience.controller';

@Module({
    imports: [JwtModule.register({}), AuthModule],
    controllers: [ExperienceController],
    providers: [ExperienceService],
    exports: [ExperienceService],
})
export class ExperienceModule {}
