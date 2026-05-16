import { Injectable } from '@nestjs/common';
import { PipelineStage, Types } from 'mongoose';
import { CurrencyValueError } from 'src/common/db/models/finance/currency/currency-value/currency-value.error';
import {
    CurrencyValue,
    CurrencyValueModel,
    InnerCurrencyValue,
} from 'src/common/db/models/finance/currency/currency-value/currency-value.model';
import { CurrencySystemCode } from 'src/common/db/models/finance/currency/currency.model';
import { ErrorCodes } from 'src/common/filter/common.error';
import { roundNumber } from 'src/common/utils/number-format.util';
import { CurrencyValuesDto } from 'src/modules/admin/finance/currency/currency.dto';
import { CommonService } from '../../common.service';
import { currencyService } from './currency.service';

@Injectable({})
export class CurrencyValueService extends CommonService<CurrencyValue> {
    constructor() {
        super(CurrencyValueModel, ErrorCodes.CURRENCY_VALUE, ErrorCodes.CURRENCY_VALUE + 1);
    }

    async deleteByCurrencyId(currency_id: Types.ObjectId, deleted_by: Types.ObjectId, options) {
        const query: typeof this.Filter = {
            $or: [{ from_currency_id: currency_id }, { to_currency_id: currency_id }],
        };
        return await this.deleteMany(query, deleted_by, options);
    }

    async updateCurrencyValues(
        from_currency_id: Types.ObjectId,
        currency_values: CurrencyValuesDto[],
        user_id: Types.ObjectId,
        options,
    ) {
        for (let currency_value of currency_values) {
            currency_value.created_by = user_id;
            await this.deleteByCurrencyId(currency_value.to_currency_id, user_id, options);

            const currencyData = {
                ...currency_value,
                from_currency_id,
                numerator: currency_value.value > 1 ? currency_value.value : 1,
                denominator: currency_value.value > 1 ? 1 : currency_value.value,
            };
            await this.create(currencyData, options);

            const oppositeData = {
                created_by: user_id,
                from_currency_id: currency_value.to_currency_id,
                to_currency_id: from_currency_id,
                value: 1 / currency_value.value,
                numerator: currency_value.value > 1 ? 1 : currency_value.value,
                denominator: currency_value.value > 1 ? currency_value.value : 1,
            };

            await this.create(oppositeData, options);
        }
    }

    async convert(from_currency_id: Types.ObjectId, to_currency_id: Types.ObjectId, amount: number, options?) {
        if (!from_currency_id || !to_currency_id) throw CurrencyValueError.ErrorOnConvert();

        if (from_currency_id.toString() === to_currency_id.toString()) return amount;

        let query: typeof this.Filter = {
            from_currency_id,
            to_currency_id,
        };

        let currencyValue = await this.findOne(query, options);
        if (!currencyValue) throw CurrencyValueError.NotFound({ from_currency_id, to_currency_id });

        const converted = (amount * currencyValue.numerator) / currencyValue.denominator;
        return roundNumber(converted);
    }

    async getCurrencyValue(currency_id: Types.ObjectId, options?): Promise<InnerCurrencyValue[]> {
        const query: typeof this.Filter = {
            from_currency_id: currency_id,
        };

        const $match: PipelineStage.Match = {
            $match: query,
        };

        const $project: PipelineStage.Project = {
            $project: {
                _id: 0,
                to_currency_id: 1,
                numberator: 1,
                denominator: 1,
            },
        };

        const pipeline = [$match, $project];

        return await this.aggregate(pipeline, options);
    }

    async getExchangeRate() {
        const usdCurrency = await currencyService.getBySystemCode(CurrencySystemCode.USD);
        const uzsCurrency = await currencyService.getBySystemCode(CurrencySystemCode.UZS);

        return await this.convert(usdCurrency._id, uzsCurrency._id, 1);
    }
}

export const currencyValueService = new CurrencyValueService();
