import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import md5 from 'md5';
import { exportAssistant } from 'src/assistant/export.assistant';
import { ConfigService } from 'src/common/config/config.service';
import { EmployeeError } from 'src/common/db/models/employee/employee.error';
import { EmployeeService } from 'src/common/service/employee/employee.service';
import { currencyService } from 'src/common/service/finance/currency/currency.service';
import { CustomRequest } from 'src/common/types/common.types';
import { PageNames } from 'src/common/types/table.type';
import { BaseIdDto } from 'src/common/validation/common.dto';
import { AuthAdminGuard } from 'src/modules/common/guard/auth.guard';
import { I18nService } from 'src/modules/common/modules/i18n/i18n.service';
import { EmployeeDto, EmployeeGetDto, EmployeeLoginDto, EmployeeUpdateDto } from './employee.dto';

@ApiTags('Employee')
@Controller('employee')
export class EmployeeAdminController {
    constructor(
        private employeeService: EmployeeService,
        private jwtService: JwtService,
        private configService: ConfigService,
        private i18nService: I18nService,
    ) {}

    @Post('create')
    @ApiBearerAuth()
    @UseGuards(AuthAdminGuard)
    async create(@Body() dto: EmployeeDto, @Req() request: CustomRequest) {
        dto.created_by = request.user._id;

        const main_currency = await currencyService.getMain();
        dto.balance_currency_id = main_currency._id;
        dto.password = md5(dto.password);

        return await this.employeeService.withTransaction(async (session) => {
            const employee = await this.employeeService.create(dto, { session });
            return employee._id;
        });
    }

    @Post('login')
    async login(@Body() dto: EmployeeLoginDto) {
        const user = await this.employeeService.getByPhoneNumber(dto.phone_number);
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

    @Post('paging')
    @ApiBearerAuth()
    @UseGuards(AuthAdminGuard)
    async get(@Body() dto: EmployeeGetDto) {
        return await this.employeeService.getPaging(dto);
    }

    @Post('export')
    @ApiBearerAuth()
    @UseGuards(AuthAdminGuard)
    async export(@Body() dto: EmployeeGetDto, @Req() request: CustomRequest) {
        dto.page = 1;
        dto.limit = Number.MAX_SAFE_INTEGER;
        const data = await this.employeeService.getPaging(dto);
        const file = await exportAssistant.excel(
            PageNames.EMPLOYEE,
            data.data,
            this.i18nService.translate('employees', { lang: request.lang }),
            this.i18nService,
            request.lang,
        );
        return file;
    }

    @Post('choose')
    @ApiBearerAuth()
    @UseGuards(AuthAdminGuard)
    async getChoose(@Body() dto: EmployeeGetDto) {
        return await this.employeeService.getChoose(dto);
    }

    @Get('get-by-id/:_id')
    @ApiBearerAuth()
    @UseGuards(AuthAdminGuard)
    async getById(@Param() dto: BaseIdDto, @Req() request: CustomRequest) {
        return await this.employeeService.getById(dto._id);
    }

    @Get('profile')
    @ApiBearerAuth()
    @UseGuards(AuthAdminGuard)
    async getMe(@Req() req: CustomRequest) {
        return await this.employeeService.getById(req.user._id);
    }

    @Put('update')
    @ApiBearerAuth()
    @UseGuards(AuthAdminGuard)
    async update(@Body() dto: EmployeeUpdateDto, @Req() request: CustomRequest) {
        dto.updated_by = request.user._id;
        const employee = await this.employeeService.findById(dto._id);

        if (employee.is_boss) throw EmployeeError.CannotUpdate(employee._id);
        if (dto.password) dto.password = md5(dto.password);

        return await this.employeeService.withTransaction(async (session) => {
            const updated = await this.employeeService.updateOne(dto._id, dto, { session });

            return updated._id;
        });
    }

    @Delete('delete')
    @ApiBearerAuth()
    @UseGuards(AuthAdminGuard)
    async delete(@Body() dto: BaseIdDto, @Req() request: CustomRequest) {
        const employee = await this.employeeService.findById(dto._id);
        if (employee.is_boss) throw EmployeeError.CannotUpdate(employee._id);

        return await this.employeeService.withTransaction(async (session) => {
            const deleted = await this.employeeService.deleteOne(dto._id, request.user._id, { session });
            return deleted._id;
        });
    }
}
