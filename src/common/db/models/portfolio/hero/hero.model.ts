import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import { CollectionNames } from 'src/common/constant/collections';
import { BaseModel, LanguageModel } from '../../base.model';

@modelOptions({
    schemaOptions: {
        collection: CollectionNames.HERO,
    },
})
export class Hero extends BaseModel {
    @prop({ required: true, trim: true })
    full_name: string;

    @prop({ type: () => LanguageModel, _id: false, required: true, default: {} })
    main_headline: LanguageModel;

    @prop({ type: () => LanguageModel, _id: false, required: true, default: {} })
    sub_headline: LanguageModel;

    @prop({ required: true, trim: true })
    profile_image_url: string;

    @prop({ trim: true })
    resume_pdf_url?: string;
}

export const HeroModel = getModelForClass(Hero);
