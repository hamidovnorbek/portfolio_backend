import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { exportAssistant } from 'src/assistant/export.assistant';
import { CurrencyError } from 'src/common/db/models/finance/currency/currency.error';
import { CurrencyValueService } from 'src/common/service/finance/currency/currency-value.service';
import { CurrencyService } from 'src/common/service/finance/currency/currency.service';
import { CustomRequest } from 'src/common/types/common.types';
import { PageNames } from 'src/common/types/table.type';
import { BaseIdDto, CommonSearchDto } from 'src/common/validation/common.dto';
import { AuthAdminGuard } from 'src/modules/common/guard/auth.guard';
import { I18nService } from 'src/modules/common/modules/i18n/i18n.service';
import { CurrencyDto, CurrencyGetDto, CurrencyUpdateDto } from './currency.dto';

@ApiTags('Currency')
@Controller('currency')
@ApiBearerAuth()
@UseGuards(AuthAdminGuard)
export class CurrencyController {
    constructor(
        private currencyService: CurrencyService,
        private currencyValueService: CurrencyValueService,
        private i18nService: I18nService,
    ) {}

    @Post('create')
    async create(@Body() dto: CurrencyDto, @Req() request: CustomRequest) {
        dto.created_by = request.user._id;
        const created = await this.currencyService.withTransaction(async (session) => {
            const currency = await this.currencyService.create(dto, { session });
            if (dto.currency_values && dto.currency_values.length) {
                await this.currencyValueService.updateCurrencyValues(
                    currency._id,
                    dto.currency_values,
                    request.user._id,
                    { session },
                );
            }
            return currency._id;
        });

        return created;
    }

    @Post('paging')
    async get(@Body() dto: CurrencyGetDto, @Req() request: CustomRequest) {
        return await this.currencyService.getPaging(dto);
    }

    @Post('export')
    async export(@Body() dto: CurrencyGetDto, @Req() request: CustomRequest) {
        dto.page = 1;
        dto.limit = Number.MAX_SAFE_INTEGER;
        const { data } = await this.currencyService.getPaging(dto);
        const file = await exportAssistant.excel(
            PageNames.CURRENCY,
            data,
            this.i18nService.translate('currencies', { lang: request.lang }),
            this.i18nService,
            request.lang,
        );
        return file;
    }

    @Get('get-by-id/:_id')
    async getById(@Param() dto: BaseIdDto, @Req() request: CustomRequest) {
        return await this.currencyService.getById(dto._id);
    }

    @Get('get-all')
    async getAll(@Query() dto: CommonSearchDto) {
        return await this.currencyService.getAllWithAggregation(dto);
    }

    @Put('update')
    async update(@Body() dto: CurrencyUpdateDto, @Req() request: CustomRequest) {
        dto.updated_by = request.user._id;
        dto.last_updated_at = new Date();
        const currency = await this.currencyService.findById(dto._id);
        const updated = await this.currencyService.withTransaction(async (session) => {
            const updated = await this.currencyService.updateOne(dto._id, dto, { session });
            if (dto.currency_values && dto.currency_values.length) {
                await this.currencyValueService.updateCurrencyValues(
                    currency._id,
                    dto.currency_values,
                    request.user._id,
                    { session },
                );
            }
            return updated._id;
        });

        return updated;
    }

    @Delete('delete')
    async delete(@Body() dto: BaseIdDto, @Req() request: CustomRequest) {
        const currency = await this.currencyService.findById(dto._id);

        if (currency.is_main) CurrencyError.CannotDelete(currency._id);
        return this.currencyService.withTransaction(async (session) => {
            const deleted = await this.currencyService.deleteOne(dto._id, request.user._id, { session });

            await this.currencyValueService.deleteByCurrencyId(currency._id, request.user._id, { session });
            return deleted;
        });
    }
}
