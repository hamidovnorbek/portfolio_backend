import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import { CollectionNames } from 'src/common/constant/collections';
import { BaseModel, LanguageModel } from '../../base.model';

@modelOptions({
    schemaOptions: {
        collection: CollectionNames.SKILL_CATEGORY,
    },
})
export class SkillCategory extends BaseModel {
    @prop({ type: () => LanguageModel, _id: false, required: true, default: {} })
    title: LanguageModel;

    @prop({ required: true, default: 0 })
    order_index: number;
}

export const SkillCategoryModel = getModelForClass(SkillCategory);
