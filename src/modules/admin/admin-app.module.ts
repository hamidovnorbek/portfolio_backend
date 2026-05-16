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

const modules = [EmployeeModule, CurrencyModule, UploadModule];

@Module({
    imports: [
        I18nModule,
        ServeStaticModule.forRoot({
            rootPath: path.resolve('uploads'),
            serveRoot: '/v1/uploads',
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
        const options = docOptionsBuilder().setTitle('Admin  API').addServer(config.get('ADMIN_URL')).build();
        return SwaggerModule.createDocument(app, options, {
            ignoreGlobalPrefix: true,
            include: [I18nModule, ...modules],
        });
    }
}
