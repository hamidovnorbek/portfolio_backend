import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { CurrencyValueService } from 'src/common/service/finance/currency/currency-value.service';
import { CurrencyService } from 'src/common/service/finance/currency/currency.service';
import { I18nService } from 'src/modules/common/modules/i18n/i18n.service';
import { EmployeeModule } from '../../employee/employee.module';
import { CurrencyController } from './currency.controller';

@Module({
    imports: [JwtModule.register({}), EmployeeModule],
    controllers: [CurrencyController],
    providers: [CurrencyService, CurrencyValueService, I18nService],
    exports: [CurrencyService, CurrencyValueService],
})
export class CurrencyModule {}
