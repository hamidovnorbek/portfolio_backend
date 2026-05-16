import { Injectable } from '@nestjs/common';
import { I18nService as I18nBaseService, TranslateOptions } from 'nestjs-i18n';

@Injectable()
export class I18nService {
    constructor(private readonly i18n: I18nBaseService) {}

    translate(key: string, options: TranslateOptions = {}) {
        return this.i18n.translate(`translation.${key}`, { defaultValue: key, ...options });
    }
}
