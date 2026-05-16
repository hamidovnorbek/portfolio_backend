import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Response } from 'express';
import { AcceptLanguages } from '../constant/languages';
import { CustomRequest } from '../types/common.types';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    use(req: CustomRequest, res: Response, next) {
        const Language = req.headers['accept-language'] as AcceptLanguages;

        if ([AcceptLanguages.EN, AcceptLanguages.RU, AcceptLanguages.UZ].includes(Language)) req.lang = Language;
        else req.lang = AcceptLanguages.UZ;

        req['time'] = new Date().getTime();

        Logger.log(`${req.method} ${req.originalUrl} ${JSON.stringify(req.body)}`, `Request`);

        res.on('finish', () => {
            const responseTime = new Date().getTime() - req['time'];
            const [m, s, ms] = [
                Math.floor(responseTime / 1000 / 60),
                Math.floor((responseTime / 1000) % 60),
                responseTime % 1000,
            ];
            const time = `${m ? m + ' m ' : ''}${s ? s + ' s ' : ''}${ms ? ms + ' ms' : ''}`;
            if (s || m || ms > 300) {
                Logger.warn(
                    `${time} ${req.method}${req.originalUrl} ${res.statusCode} ${res.statusMessage} `,
                    `Response`,
                );
            } else {
                Logger.log(
                    `${time} ${req.method}${req.originalUrl} ${res.statusCode} ${res.statusMessage} `,
                    `Response`,
                );
            }
        });
        next();
    }
}
