import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import { CollectionNames } from 'src/common/constant/collections';
import { BaseModel, LanguageModel } from '../../base.model';

@modelOptions({
    schemaOptions: {
        collection: CollectionNames.PROOF,
    },
})
export class Proof extends BaseModel {
    @prop({ type: () => LanguageModel, _id: false, required: true, default: {} })
    title: LanguageModel;

    @prop({ required: true, trim: true })
    pdf_url: string;

    @prop({ trim: true })
    thumbnail_url?: string;

    @prop({ required: true })
    date_earned: Date;

    @prop({ required: true, default: 0 })
    order_index: number;
}

export const ProofModel = getModelForClass(Proof);
