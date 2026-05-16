import { Module } from '@nestjs/common';
import { I18nModule as NestI18nModule } from 'nestjs-i18n';
import { i18nOptions } from './i18n.options';

@Module({
    imports: [NestI18nModule.forRoot(i18nOptions)],
})
export class I18nModule {}
