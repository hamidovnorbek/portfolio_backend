import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ProofService } from 'src/common/service/portfolio/proof/proof.service';
import { AuthModule } from '../auth/auth.module';
import { ProofController } from './proof.controller';

@Module({
    imports: [JwtModule.register({}), AuthModule],
    controllers: [ProofController],
    providers: [ProofService],
    exports: [ProofService],
})
export class ProofsModule {}
