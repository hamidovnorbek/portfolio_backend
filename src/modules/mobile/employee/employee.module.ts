import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from 'src/common/config/config.service';
import { EmployeeService } from 'src/common/service/employee/employee.service';
import { EmployeeMobileController } from './employee.controller';

@Module({
    imports: [JwtModule.register({})],
    controllers: [EmployeeMobileController],
    providers: [EmployeeService, ConfigService],
    exports: [EmployeeService, ConfigService],
})
export class EmployeeMobileModule {}
