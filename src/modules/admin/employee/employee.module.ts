import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from 'src/common/config/config.service';
import { EmployeeService } from 'src/common/service/employee/employee.service';
import { I18nService } from 'src/modules/common/modules/i18n/i18n.service';
import { EmployeeAdminController } from './employee.controller';

@Module({
    imports: [JwtModule.register({})],
    controllers: [EmployeeAdminController],
    providers: [ConfigService, I18nService, EmployeeService],
    exports: [EmployeeService, ConfigService],
})
export class EmployeeModule {}
