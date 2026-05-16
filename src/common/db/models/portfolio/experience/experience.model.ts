import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import { CollectionNames } from 'src/common/constant/collections';
import { BaseModel, LanguageModel } from '../../base.model';

@modelOptions({
    schemaOptions: {
        collection: CollectionNames.EXPERIENCE,
    },
})
export class Experience extends BaseModel {
    @prop({ type: () => LanguageModel, _id: false, required: true, default: {} })
    job_title: LanguageModel;

    @prop({ required: true, trim: true })
    company_name: string;

    @prop({ type: () => LanguageModel, _id: false, required: true, default: {} })
    employment_type: LanguageModel;

    @prop({ required: true, trim: true })
    start_date: string;

    @prop({ type: () => LanguageModel, _id: false, required: true, default: {} })
    end_date: LanguageModel;

    @prop({ type: () => LanguageModel, _id: false, required: true, default: {} })
    description: LanguageModel;

    @prop({ required: true, default: 0 })
    order_index: number;
}

export const ExperienceModel = getModelForClass(Experience);
