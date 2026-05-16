import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SkillService } from 'src/common/service/portfolio/skill/skill.service';
import { AuthModule } from '../auth/auth.module';
import { SkillController } from './skill.controller';

@Module({
    imports: [JwtModule.register({}), AuthModule],
    controllers: [SkillController],
    providers: [SkillService],
    exports: [SkillService],
})
export class SkillsModule {}
