import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import { CollectionNames } from 'src/common/constant/collections';
import { BaseModel, LanguageModel } from '../../base.model';

@modelOptions({
    schemaOptions: {
        collection: CollectionNames.PROJECT,
    },
})
export class Project extends BaseModel {
    @prop({ type: () => LanguageModel, _id: false, required: true, default: {} })
    title: LanguageModel;

    @prop({ type: () => LanguageModel, _id: false, required: true, default: {} })
    description: LanguageModel;

    @prop({ required: true, trim: true })
    thumbnail_url: string;

    @prop({ default: [], type: () => [String] })
    tech_stack: string[];

    @prop({ trim: true })
    github_url?: string;

    @prop({ trim: true })
    live_url?: string;

    @prop({ required: true, default: 0 })
    order_index: number;
}

export const ProjectModel = getModelForClass(Project);
