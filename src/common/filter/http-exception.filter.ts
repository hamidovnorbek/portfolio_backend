import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Request } from 'express';
import { I18nContext } from 'nestjs-i18n';
import { I18nTranslations } from 'src/generated/i18n.generated';
import { sendBug } from '../utils/send-telegram.util';
import { ValidationErrorData } from '../validation/common.dto';
import { CommonException, ErrorCodes } from './common.error';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
    private messageBuilder(exception: CommonException) {
        /// validation message builder
        let message = '';
        (exception.data as ValidationErrorData[]).map((d) => {
            message += `${message ? '\n' : ''}${d.message || ''}`;
        });
        return message;
    }

    catch(exception: any, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        const response = ctx?.getResponse();
        const request = ctx?.getRequest<Request>();
        if (!request || !response) return;

        const httpStatus = exception instanceof HttpException ? exception.getStatus() : HttpStatus.BAD_REQUEST;
        try {
            Logger.error(exception);
            console.log(exception);
            if (![401, 404].includes(httpStatus)) sendBug({ url: request.url, exception });

            const AcceptLanguage = request.headers['accept-language'];
            const lang = ['en', 'ru', 'uz'].includes(AcceptLanguage) ? AcceptLanguage : 'uz';
            const i18n = I18nContext.current<I18nTranslations>(host);
            let message = i18n?.translate('translation.ERROR.UNKNOWN', {
                lang,
            });

            if (exception instanceof CommonException) {
                const ERROR_KEY = `translation.ERROR.${exception.code}` as keyof I18nTranslations;
                message = i18n.translate(ERROR_KEY, { lang });
                // validation message builder
                if (exception.code == ErrorCodes.DEFAULT + 4) message += '\n' + this.messageBuilder(exception) || '';
            } else if (exception instanceof HttpException) {
                const ERROR_KEY = `translation.ERROR.STATUS.${httpStatus}` as keyof I18nTranslations;
                if (
                    Array.isArray(exception.getResponse()?.['message']) &&
                    exception.getResponse()?.['message']?.length
                ) {
                    message = exception.getResponse()?.['message'][0];
                } else message = i18n.translate(ERROR_KEY, { lang });
                exception = CommonException.Unknown();
            } else exception = CommonException.Unknown();

            response.status(httpStatus).json({
                statusCode: httpStatus,
                code: exception.code,
                message,
                data: exception.data,
                time: new Date().toISOString(),
                path: request.url,
            });
        } catch (error) {
            response.status(httpStatus).json({
                statusCode: httpStatus,
                code: exception.code,
                message: exception?.response?.message || 'error',
                data: exception.data,
                time: new Date().toISOString(),
                path: request.url,
            });
        }
    }
}
