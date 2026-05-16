import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ProjectService } from 'src/common/service/portfolio/project/project.service';
import { AuthModule } from '../auth/auth.module';
import { ProjectController } from './project.controller';

@Module({
    imports: [JwtModule.register({}), AuthModule],
    controllers: [ProjectController],
    providers: [ProjectService],
    exports: [ProjectService],
})
export class ProjectsModule {}
