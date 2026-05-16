import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from 'src/common/config/config.service';
import { EmployeeService } from 'src/common/service/employee/employee.service';
import { UploadController } from './upload.controller';

@Module({
    imports: [JwtModule.register({})],
    controllers: [UploadController],
    providers: [EmployeeService, ConfigService],
})
export class UploadModule {}
