import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MetricService } from 'src/common/service/portfolio/metric/metric.service';
import { AuthModule } from '../auth/auth.module';
import { MetricController } from './metric.controller';

@Module({
    imports: [JwtModule.register({}), AuthModule],
    controllers: [MetricController],
    providers: [MetricService],
    exports: [MetricService],
})
export class MetricsModule {}
