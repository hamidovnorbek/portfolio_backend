import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { SwaggerModule } from '@nestjs/swagger';
import * as path from 'path';
import { IConfigService } from 'src/common/config/config.interface';
import { ConfigService } from 'src/common/config/config.service';
import { LoggerMiddleware } from 'src/common/middleware/logger.middleware';
import { docOptionsBuilder } from '../common/doc/builder';
import { I18nModule } from '../common/modules/i18n/i18n.module';
import { UploadModule } from '../common/modules/upload/upload.module';
import { EmployeeModule } from './employee/employee.module';
import { CurrencyModule } from './finance/currency/currency.module';
import { AuthModule } from './portfolio/auth/auth.module';
import { ContactModule } from './portfolio/contact/contact.module';
import { ExperienceModule } from './portfolio/experience/experience.module';
import { HeroModule } from './portfolio/hero/hero.module';
import { MetricsModule } from './portfolio/metric/metric.module';
import { PortfolioModule } from './portfolio/portfolio/portfolio.module';
import { ProofsModule } from './portfolio/proof/proof.module';
import { ProjectsModule } from './portfolio/project/project.module';
import { SkillCategoryModule } from './portfolio/skill-category/skill-category.module';
import { SkillsModule } from './portfolio/skill/skill.module';
import { SettingsModule } from './portfolio/site-settings/site-settings.module';
import { PortfolioUploadModule } from './portfolio/upload/upload.module';

const portfolioModules = [
    AuthModule,
    PortfolioModule,
    SettingsModule,
    HeroModule,
    MetricsModule,
    ExperienceModule,
    SkillCategoryModule,
    SkillsModule,
    ProofsModule,
    ProjectsModule,
    ContactModule,
    PortfolioUploadModule,
];

const legacyModules = [EmployeeModule, CurrencyModule, UploadModule];

const modules = [...legacyModules, ...portfolioModules];

@Module({
    imports: [
        I18nModule,
        ServeStaticModule.forRoot({
            rootPath: path.resolve('uploads'),
            serveRoot: '/uploads',
        }),
        ...modules,
    ],
    controllers: [],
    providers: [LoggerMiddleware, ConfigService],
})
export class AdminAppModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(LoggerMiddleware).forRoutes('*');
    }
    static async createSwaggerDocument(app, config: IConfigService) {
        const options = docOptionsBuilder()
            .setTitle('Developer Portfolio API')
            .addServer(config.get('ADMIN_URL'))
            .build();
        return SwaggerModule.createDocument(app, options, {
            ignoreGlobalPrefix: true,
            include: [I18nModule, ...modules],
        });
    }
}
