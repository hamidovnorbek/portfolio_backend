import { Body, Controller, Get, Post, Put, Req, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import md5 from 'md5';
import { ConfigService } from 'src/common/config/config.service';
import { EmployeeError } from 'src/common/db/models/employee/employee.error';
import { EmployeeType } from 'src/common/db/models/employee/employee.model';
import { EmployeeService } from 'src/common/service/employee/employee.service';
import { CustomRequest } from 'src/common/types/common.types';
import { AuthEmployeeGuard } from 'src/modules/common/guard/auth.guard';
import { EmployeeLoginDto, EmployeeProfileUpdateDto } from './employee.dto';

@ApiTags('Employee')
@Controller('employee')
export class EmployeeMobileController {
    constructor(
        private employeeService: EmployeeService,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) {}

    @Post('login')
    async login(@Body() dto: EmployeeLoginDto) {
        const user = await this.employeeService.getByPhoneNumber(dto.phone_number, EmployeeType.EMPLOYEE);
        if (user.password !== md5(dto.password)) throw EmployeeError.InvalidPassword(dto.password);

        const employee = await this.employeeService.getById(user._id);

        return {
            ...employee,
            token: await this.jwtService.signAsync(
                { phone_number: employee.phone_number, type: employee.type },
                {
                    secret: this.configService.get('JWT_SECRET'),
                    expiresIn: this.configService.get('JWT_EXPIRES'),
                },
            ),
        };
    }

    @Get('profile')
    @ApiBearerAuth()
    @UseGuards(AuthEmployeeGuard)
    async getMe(@Req() req: CustomRequest) {
        return await this.employeeService.getById(req.user._id);
    }

    @Put('profile')
    @ApiBearerAuth()
    @UseGuards(AuthEmployeeGuard)
    async update(@Body() dto: EmployeeProfileUpdateDto, @Req() req: CustomRequest) {
        await this.employeeService.updateOne(req.user._id, dto);
        return await this.employeeService.getById(req.user._id);
    }
}
