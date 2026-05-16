import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import { CollectionNames } from 'src/common/constant/collections';
import { BaseModel } from '../base.model';

export enum CounterType {
    TRANSACTION = 'transaction',
    INVOICE = 'invoice',
}

@modelOptions({
    schemaOptions: {
        collection: CollectionNames.COUNTER,
    },
})
export class Counter extends BaseModel {
    @prop({ default: 1 })
    transaction?: number;

    @prop({ default: 1 })
    invoice?: number;
}

export const CounterModel = getModelForClass(Counter);
