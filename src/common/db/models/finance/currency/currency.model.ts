import { getModelForClass, index, modelOptions, prop } from '@typegoose/typegoose';
import { Document, Types } from 'mongoose';
import { CollectionNames } from 'src/common/constant/collections';
import { I18nService } from 'src/modules/common/modules/i18n/i18n.service';
import { BaseModel } from '../../base.model';
import { Employee } from '../../employee/employee.model';

export enum CurrencySide {
    START = 'start',
    END = 'end',
}

export enum CurrencySystemCode {
    USD = 'usd',
    UZS = 'uzs',
}

@modelOptions({
    schemaOptions: {
        collection: CollectionNames.CURRENCY,
    },
})
@index(
    { name: 1 },
    {
        unique: true,
        background: true,
        name: 'name',
        partialFilterExpression: {
            is_deleted: { $eq: false },
        },
    },
)
export class Currency extends BaseModel {
    @prop({ required: true, trim: true })
    name: string;

    @prop({ trim: true })
    symbol: string;

    @prop({ default: CurrencySide.END, enum: CurrencySide })
    side: CurrencySide;

    @prop({ default: false, immutable: true })
    is_main?: boolean;

    @prop({ default: () => new Date() })
    last_updated_at?: Date;

    @prop({ enum: CurrencySystemCode })
    system_code?: CurrencySystemCode;
}

export const CurrencyModel = getModelForClass(Currency);

export class InnerCurrency {
    @prop({ type: Types.ObjectId })
    currency_id: Types.ObjectId;

    @prop()
    amount: number;
}

export function getDefaultCurrencies(boss: Employee & Document, i18n: I18nService): Currency[] {
    return [
        {
            created_by: boss._id,
            name: i18n.translate('auto_create.currencies.usd', { lang: boss.locale }),
            symbol: '$',
            side: CurrencySide.START,
            is_main: true,
            system_code: CurrencySystemCode.USD,
        },
        {
            created_by: boss._id,
            name: i18n.translate('auto_create.currencies.uzs', { lang: boss.locale }),
            symbol: 'sum',
            side: CurrencySide.END,
            is_main: false,
            system_code: CurrencySystemCode.UZS,
        },
    ];
}
