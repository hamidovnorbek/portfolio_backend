import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { MetricService } from 'src/common/service/portfolio/metric/metric.service';
import { PortfolioRequest } from 'src/common/types/portfolio.types';
import { BaseIdDto } from 'src/common/validation/common.dto';
import { AuthUserGuard } from 'src/modules/common/guard/portfolio-auth.guard';
import { MetricDto, MetricUpdateDto } from './metric.dto';

@ApiTags('Metrics')
@Controller('metrics')
export class MetricController {
    constructor(private metricService: MetricService) {}

    @Get()
    async getAll() {
        return await this.metricService.getAll();
    }

    @Get(':_id')
    async getById(@Param() dto: BaseIdDto) {
        return await this.metricService.findById(dto._id);
    }

    @Post()
    @ApiBearerAuth()
    @UseGuards(AuthUserGuard)
    async create(@Body() dto: MetricDto, @Req() request: PortfolioRequest) {
        return await this.metricService.create({ ...dto, created_by: request.user._id } as any);
    }

    @Patch(':_id')
    @ApiBearerAuth()
    @UseGuards(AuthUserGuard)
    async update(
        @Param() params: BaseIdDto,
        @Body() dto: MetricUpdateDto,
        @Req() request: PortfolioRequest,
    ) {
        await this.metricService.findById(params._id);
        return await this.metricService.updateOne(params._id, { ...dto, updated_by: request.user._id });
    }

    @Delete(':_id')
    @ApiBearerAuth()
    @UseGuards(AuthUserGuard)
    async delete(@Param() params: BaseIdDto, @Req() request: PortfolioRequest) {
        await this.metricService.findById(params._id);
        return await this.metricService.deleteOne(params._id, request.user._id);
    }
}
