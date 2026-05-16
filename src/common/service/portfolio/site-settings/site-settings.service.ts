import { Injectable } from '@nestjs/common';
import { SiteSettings, SiteSettingsModel } from 'src/common/db/models/portfolio/site-settings/site-settings.model';
import { ErrorCodes } from 'src/common/filter/common.error';
import { CommonService } from '../../common.service';

@Injectable({})
export class SiteSettingsService extends CommonService<SiteSettings> {
    constructor() {
        super(SiteSettingsModel, ErrorCodes.SITE_SETTINGS, ErrorCodes.SITE_SETTINGS + 1);
    }

    async getOne() {
        let settings = await this.findOne({});
        if (!settings) {
            settings = await this.model.create({
                site_title: { en: '', uz: '', ru: '' },
                logo_text: '',
                favicon_url: '',
                social_links: {},
                navigation_labels: {},
                call_to_action_labels: {},
                footer_copyright: { en: '', uz: '', ru: '' },
            } as SiteSettings);
        }
        return settings;
    }

    async patchOne(data: Partial<SiteSettings>) {
        const settings = await this.getOne();
        return await this.updateOne(settings._id, data);
    }
}

export const siteSettingsService = new SiteSettingsService();
