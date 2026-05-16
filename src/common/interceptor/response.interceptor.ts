import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ErrorCodes } from '../filter/common.error';

export interface Response<T> {
    statusCode: number;
    data: T;
    message: string;
    code: number;
    time: string;
}

const IgnoredPropertyName = Symbol('IgnoredPropertyName');
export function TransformInterceptorIgnore() {
    return function (target, propertyKey: string, descriptor: PropertyDescriptor) {
        descriptor.value[IgnoredPropertyName] = true;
    };
}
@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
        const isIgnored = context.getHandler()[IgnoredPropertyName];

        if (isIgnored) {
            return next.handle();
        }
        return next.handle().pipe(
            map((data) => ({
                statusCode: 200,
                code: ErrorCodes.SUCCESS,
                message: 'ok',
                data,
                time: new Date().toISOString(),
            })),
        );
    }
}
