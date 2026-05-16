import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrencyService } from 'src/common/service/finance/currency/currency.service';
import { CommonSearchDto } from 'src/common/validation/common.dto';
import { AuthEmployeeGuard } from 'src/modules/common/guard/auth.guard';

@ApiTags('Currency')
@Controller('currency')
@ApiBearerAuth()
@UseGuards(AuthEmployeeGuard)
export class CurrencyController {
    constructor(private currencyService: CurrencyService) {}

    @Get('get-all')
    async getAll(@Query() dto: CommonSearchDto) {
        return await this.currencyService.getAllWithAggregation(dto);
    }
}
