import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { CurrencyService } from 'src/common/service/finance/currency/currency.service';
import { EmployeeMobileModule } from '../../employee/employee.module';
import { CurrencyController } from './currency.controller';

@Module({
    imports: [JwtModule.register({}), EmployeeMobileModule],
    controllers: [CurrencyController],
    providers: [CurrencyService],
    exports: [CurrencyService],
})
export class CurrencyMobileModule {}
