import { INestApplication, Logger, NestApplicationOptions, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import compression from 'compression';
import { json, urlencoded } from 'express';
import { IConfigService } from './common/config/config.interface';
import { ConfigService } from './common/config/config.service';
import { connectToDB } from './common/db/connect.db';
import { CommonException } from './common/filter/common.error';
import { AllExceptionFilter } from './common/filter/http-exception.filter';
import { TransformInterceptor } from './common/interceptor/response.interceptor';
import { AdminAppModule } from './modules/admin/admin-app.module';
import { MobileAppModule } from './modules/mobile/mobile.app.module';

class App {
    private adminApp: INestApplication;
    private mobileApp: INestApplication;
    constructor(private readonly config: IConfigService) {}

    async bootstrap() {
        await connectToDB(this.config);

        const nestOptions: NestApplicationOptions = {
            logger: ['error', 'warn', 'debug', 'verbose', 'log'],
        };
        this.adminApp = await NestFactory.create(AdminAppModule, nestOptions);
        this.mobileApp = await NestFactory.create(MobileAppModule, nestOptions);

        const appsWithPrefix: { app: INestApplication; prefix: string }[] = [
            { app: this.adminApp, prefix: 'api' },
            { app: this.mobileApp, prefix: 'v1' },
        ];
        for (const { app, prefix } of appsWithPrefix) {
            app.useGlobalPipes(
                new ValidationPipe({
                    whitelist: true,
                    transform: true,
                    exceptionFactory: (errors) => {
                        throw CommonException.Validation(errors);
                    },
                }),
            )
                .setGlobalPrefix(prefix)
                .useGlobalFilters(new AllExceptionFilter())
                .useGlobalInterceptors(new TransformInterceptor())
                .enableCors();

            app.use(json({ limit: '10mb' }));
            app.use(urlencoded({ extended: true, limit: '10mb' }));

            app.use(compression());
        }

        const adminDocument = await AdminAppModule.createSwaggerDocument(this.adminApp, this.config);
        SwaggerModule.setup('/docs', this.adminApp, adminDocument, {
            swaggerOptions: {
                persistAuthorization: true,
            },
        });

        const mobileDocument = await MobileAppModule.createSwaggerDocument(this.mobileApp, this.config);
        SwaggerModule.setup('/docs', this.mobileApp, mobileDocument, {
            swaggerOptions: {
                persistAuthorization: true,
            },
        });

        await this.adminApp.listen(this.config.get('ADMIN_PORT'));
        Logger.log(this.config.get('ADMIN_PORT'), 'ADMIN_PORT');

        await this.mobileApp.listen(this.config.get('MOBILE_PORT'));
        Logger.log(this.config.get('MOBILE_PORT'), 'MOBILE_PORT');

        if (process && process.send) {
            console.log('APPLICATION IS READY');
            process.send('ready');
        }
    }
}

const app = new App(new ConfigService());

app.bootstrap();
