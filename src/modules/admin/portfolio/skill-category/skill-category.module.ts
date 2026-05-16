import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SkillCategoryService } from 'src/common/service/portfolio/skill-category/skill-category.service';
import { AuthModule } from '../auth/auth.module';
import { SkillCategoryController } from './skill-category.controller';

@Module({
    imports: [JwtModule.register({}), AuthModule],
    controllers: [SkillCategoryController],
    providers: [SkillCategoryService],
    exports: [SkillCategoryService],
})
export class SkillCategoryModule {}
