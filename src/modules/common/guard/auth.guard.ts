import { CanActivate, ExecutionContext, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { ConfigService } from 'src/common/config/config.service';
import { EmployeeType } from 'src/common/db/models/employee/employee.model';
import { EmployeeService } from 'src/common/service/employee/employee.service';

@Injectable()
export class AuthAdminGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private employeeService: EmployeeService,
        private configService: ConfigService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) throw new UnauthorizedException();

        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: this.configService.get('JWT_SECRET'),
            });
            request['payload'] = payload;
            const employee = await this.employeeService.getByPhoneNumber(payload.phone_number, payload.type);
            if (employee.type !== EmployeeType.ADMIN) throw new UnauthorizedException();
            request.user = employee;
        } catch (error) {
            Logger.warn(error);
            throw new UnauthorizedException();
        }
        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}

@Injectable()
export class AuthEmployeeGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private employeeService: EmployeeService,
        private configService: ConfigService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) throw new UnauthorizedException();

        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: this.configService.get('JWT_SECRET'),
            });
            request['payload'] = payload;
            const employee = await this.employeeService.getByPhoneNumber(payload.phone_number, payload.type);
            if (employee.type !== EmployeeType.EMPLOYEE) throw new UnauthorizedException();
            request.user = employee;
        } catch (error) {
            Logger.warn(error);
            throw new UnauthorizedException();
        }
        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}
