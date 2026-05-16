import { Injectable } from '@nestjs/common';
import { PipelineStage, Types } from 'mongoose';
import { CollectionNames } from 'src/common/constant/collections';
import { CurrencyError } from 'src/common/db/models/finance/currency/currency.error';
import { Currency, CurrencyModel, CurrencySystemCode } from 'src/common/db/models/finance/currency/currency.model';
import { ErrorCodes } from 'src/common/filter/common.error';
import { CommonSearchDto } from 'src/common/validation/common.dto';
import { CurrencyGetDto } from 'src/modules/admin/finance/currency/currency.dto';
import { CommonService } from '../../common.service';

@Injectable({})
export class CurrencyService extends CommonService<Currency> {
    constructor() {
        super(CurrencyModel, ErrorCodes.CURRENCY, ErrorCodes.CURRENCY + 1);
    }

    async getPaging(dto: CurrencyGetDto) {
        const query: typeof this.Filter = {};
        if (dto.search) query.name = dto.search;
        return await this.findPaging(query, dto);
    }

    async getById(id: Types.ObjectId) {
        const $match: PipelineStage.Match = {
            $match: {
                _id: id,
            },
        };

        const $lookup: PipelineStage.Lookup = {
            $lookup: {
                from: CollectionNames.CURRENCY_VALUES,
                localField: '_id',
                foreignField: 'from_currency_id',
                pipeline: [
                    {
                        $match: {
                            is_deleted: false,
                        },
                    },
                    {
                        $lookup: {
                            from: CollectionNames.CURRENCY,
                            localField: 'to_currency_id',
                            foreignField: '_id',
                            as: 'to_currency',
                        },
                    },
                    {
                        $unwind: {
                            path: '$to_currency',
                            preserveNullAndEmptyArrays: true,
                        },
                    },
                    {
                        $project: {
                            from_currency_id: 1,
                            to_currency_id: 1,
                            value: 1,
                            to_currency: 1,
                            calculation_method: 1,
                        },
                    },
                ],
                as: 'currency_values',
            },
        };

        const pipeline = [$match, $lookup];
        const currency = await this.aggregate(pipeline);
        if (!currency.length) throw CurrencyError.NotFound(id);
        return currency.shift();
    }

    async getAllWithAggregation(dto?: CommonSearchDto) {
        const query: typeof this.Filter = {};
        if (dto?.search) query.name = dto.search;

        const $match: PipelineStage.Match = {
            $match: query,
        };

        const $sort: PipelineStage.Sort = {
            $sort: {
                _id: 1,
            },
        };

        const $lookupToCurrency: PipelineStage = {
            $lookup: {
                from: CollectionNames.CURRENCY_VALUES,
                localField: '_id',
                foreignField: 'from_currency_id',
                pipeline: [
                    {
                        $match: {
                            is_deleted: false,
                        },
                    },
                    {
                        $lookup: {
                            from: CollectionNames.CURRENCY,
                            localField: 'to_currency_id',
                            foreignField: '_id',
                            pipeline: [
                                {
                                    $match: {
                                        is_deleted: false,
                                    },
                                },
                            ],
                            as: 'to_currency',
                        },
                    },
                    {
                        $unwind: {
                            path: '$to_currency',
                            preserveNullAndEmptyArrays: false,
                        },
                    },
                ],
                as: 'currency_values',
            },
        };

        const pipeline = [$match, $sort, $lookupToCurrency];

        return await this.aggregate(pipeline);
    }

    async getMain(options?) {
        const main_currency = await this.findOne({ is_main: true }, options);
        if (!main_currency) throw CurrencyError.MainNotFound();
        return main_currency;
    }

    async getBySystemCode(code: CurrencySystemCode, options?) {
        return await this.findOne({ system_code: code }, options);
    }

    async getAll() {
        return await this.find({});
    }
}

export const currencyService = new CurrencyService();
