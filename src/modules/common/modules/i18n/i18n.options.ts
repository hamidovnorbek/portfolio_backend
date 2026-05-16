import { AcceptLanguageResolver, QueryResolver } from 'nestjs-i18n';
import path from 'path';

export const i18nOptions = {
    fallbackLanguage: 'en',
    loaderOptions: {
        path: path.join(__dirname, '../../../../i18n/'),
        watch: true,
    },
    resolvers: [{ use: QueryResolver, options: ['lang'] }, AcceptLanguageResolver],
    typesOutputPath: path.join(__dirname, '../../../../generated/i18n.generated.ts'),
};
