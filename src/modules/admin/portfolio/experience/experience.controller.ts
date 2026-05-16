import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ExperienceService } from 'src/common/service/portfolio/experience/experience.service';
import { PortfolioRequest } from 'src/common/types/portfolio.types';
import { BaseIdDto } from 'src/common/validation/common.dto';
import { ReorderDto } from 'src/common/validation/dto/reorder.dto';
import { AuthUserGuard } from 'src/modules/common/guard/portfolio-auth.guard';
import { ExperienceDto, ExperienceUpdateDto } from './experience.dto';

@ApiTags('Experience')
@Controller('experience')
export class ExperienceController {
    constructor(private experienceService: ExperienceService) {}

    @Get()
    async getAll() {
        return await this.experienceService.getAll();
    }

    @Patch('reorder')
    @ApiBearerAuth()
    @UseGuards(AuthUserGuard)
    async reorder(@Body() dto: ReorderDto) {
        return await this.experienceService.reorder(dto.items);
    }

    @Get(':_id')
    async getById(@Param() dto: BaseIdDto) {
        return await this.experienceService.findById(dto._id);
    }

    @Post()
    @ApiBearerAuth()
    @UseGuards(AuthUserGuard)
    async create(@Body() dto: ExperienceDto, @Req() request: PortfolioRequest) {
        return await this.experienceService.create({ ...dto, created_by: request.user._id } as any);
    }

    @Patch(':_id')
    @ApiBearerAuth()
    @UseGuards(AuthUserGuard)
    async update(
        @Param() params: BaseIdDto,
        @Body() dto: ExperienceUpdateDto,
        @Req() request: PortfolioRequest,
    ) {
        await this.experienceService.findById(params._id);
        return await this.experienceService.updateOne(params._id, { ...dto, updated_by: request.user._id });
    }

    @Delete(':_id')
    @ApiBearerAuth()
    @UseGuards(AuthUserGuard)
    async delete(@Param() params: BaseIdDto, @Req() request: PortfolioRequest) {
        await this.experienceService.findById(params._id);
        return await this.experienceService.deleteOne(params._id, request.user._id);
    }
}
