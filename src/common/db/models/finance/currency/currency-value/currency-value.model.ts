import { getModelForClass, index, modelOptions, prop } from '@typegoose/typegoose';
import { Types } from 'mongoose';
import { CollectionNames } from 'src/common/constant/collections';
import { BaseModel } from '../../../base.model';

export enum CalculationMethod {
    MULTIPLY = 'multiply',
    DIVIDE = 'divide',
}

@modelOptions({
    schemaOptions: {
        collection: CollectionNames.CURRENCY_VALUES,
    },
})
@index(
    {
        from_currency_id: 1,
        to_currency_id: 1,
    },
    {
        unique: true,
        name: 'currencies',
        background: true,
        partialFilterExpression: {
            is_deleted: { $eq: false },
        },
    },
)
export class CurrencyValue extends BaseModel {
    @prop({ required: true, type: Types.ObjectId })
    from_currency_id: Types.ObjectId;

    @prop({ required: true, type: Types.ObjectId })
    to_currency_id: Types.ObjectId;

    @prop({ required: true, type: Number, default: 1 })
    value: number;

    @prop({ required: true, type: Number, default: 1 })
    numerator: number;

    @prop({ required: true, type: Number, default: 1 })
    denominator: number;
}

export const CurrencyValueModel = getModelForClass(CurrencyValue);

export class InnerCurrencyValue {
    @prop({ required: true, type: Types.ObjectId })
    to_currency_id: Types.ObjectId;

    @prop({ required: true, type: Number, default: 1 })
    numerator: number;

    @prop({ required: true, type: Number, default: 1 })
    denominator: number;
}
