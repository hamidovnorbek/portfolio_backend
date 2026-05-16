import { CanActivate, ExecutionContext, Injectable, Logger, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CommonException } from 'src/common/filter/common.error';

export const SetRole = (roleKey: string) => SetMetadata('roleKey', roleKey);

@Injectable()
export class RoleGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        // private roleService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        let roleKey = this.reflector.get('roleKey', context.getHandler());
        if (!roleKey) {
            throw CommonException.NoPermission();
        }

        const request = context.switchToHttp().getRequest();
        Logger.log(request.payload);
        return true;
    }
}
