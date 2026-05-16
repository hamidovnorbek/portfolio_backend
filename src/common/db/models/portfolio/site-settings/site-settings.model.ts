import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import { CollectionNames } from 'src/common/constant/collections';
import { BaseModel, LanguageModel } from '../../base.model';

export class SocialLinks {
    @prop({ trim: true })
    github?: string;

    @prop({ trim: true })
    linkedin?: string;

    @prop({ trim: true })
    telegram?: string;
}

export class NavigationLabels {
    @prop({ type: () => LanguageModel, _id: false, default: {} })
    home?: LanguageModel;

    @prop({ type: () => LanguageModel, _id: false, default: {} })
    experience?: LanguageModel;

    @prop({ type: () => LanguageModel, _id: false, default: {} })
    skills?: LanguageModel;
}

export class CallToActionLabels {
    @prop({ type: () => LanguageModel, _id: false, default: {} })
    view_projects?: LanguageModel;

    @prop({ type: () => LanguageModel, _id: false, default: {} })
    lets_talk?: LanguageModel;
}

@modelOptions({
    schemaOptions: {
        collection: CollectionNames.SITE_SETTINGS,
    },
})
export class SiteSettings extends BaseModel {
    @prop({ type: () => LanguageModel, _id: false, required: true, default: {} })
    site_title: LanguageModel;

    @prop({ required: true, trim: true })
    logo_text: string;

    @prop({ required: true, trim: true })
    favicon_url: string;

    @prop({ type: () => SocialLinks, _id: false, required: true, default: {} })
    social_links: SocialLinks;

    @prop({ type: () => NavigationLabels, _id: false, required: true, default: {} })
    navigation_labels: NavigationLabels;

    @prop({ type: () => CallToActionLabels, _id: false, required: true, default: {} })
    call_to_action_labels: CallToActionLabels;

    @prop({ type: () => LanguageModel, _id: false, required: true, default: {} })
    footer_copyright: LanguageModel;
}

export const SiteSettingsModel = getModelForClass(SiteSettings);
