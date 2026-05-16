import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import { Types } from 'mongoose';
import { CollectionNames } from 'src/common/constant/collections';
import { BaseModel, LanguageModel } from '../../base.model';

@modelOptions({
    schemaOptions: {
        collection: CollectionNames.METRIC,
    },
})
export class Metric extends BaseModel {
    @prop({ required: true, type: Types.ObjectId })
    hero_id: Types.ObjectId;

    @prop({ required: true, trim: true })
    value: string;

    @prop({ type: () => LanguageModel, _id: false, required: true, default: {} })
    label: LanguageModel;

    @prop({ type: () => LanguageModel, _id: false, required: true, default: {} })
    description: LanguageModel;
}

export const MetricModel = getModelForClass(Metric);
