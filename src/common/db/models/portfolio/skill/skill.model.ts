import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import { Types } from 'mongoose';
import { CollectionNames } from 'src/common/constant/collections';
import { BaseModel } from '../../base.model';

@modelOptions({
    schemaOptions: {
        collection: CollectionNames.SKILL,
    },
})
export class Skill extends BaseModel {
    @prop({ required: true, type: Types.ObjectId })
    category_id: Types.ObjectId;

    @prop({ required: true, trim: true })
    name: string;

    @prop({ required: true, trim: true })
    icon_url: string;

    @prop({ required: true, default: 0 })
    order_index: number;
}

export const SkillModel = getModelForClass(Skill);
