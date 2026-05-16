import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { HeroService } from 'src/common/service/portfolio/hero/hero.service';
import { AuthModule } from '../auth/auth.module';
import { HeroController } from './hero.controller';

@Module({
    imports: [JwtModule.register({}), AuthModule],
    controllers: [HeroController],
    providers: [HeroService],
    exports: [HeroService],
})
export class HeroModule {}
