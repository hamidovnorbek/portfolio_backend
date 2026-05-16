import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ProjectService } from 'src/common/service/portfolio/project/project.service';
import { PortfolioRequest } from 'src/common/types/portfolio.types';
import { BaseIdDto } from 'src/common/validation/common.dto';
import { ReorderDto } from 'src/common/validation/dto/reorder.dto';
import { AuthUserGuard } from 'src/modules/common/guard/portfolio-auth.guard';
import { ProjectDto, ProjectUpdateDto } from './project.dto';

@ApiTags('Projects')
@Controller('projects')
export class ProjectController {
    constructor(private projectService: ProjectService) {}

    @Get()
    async getAll() {
        return await this.projectService.getAll();
    }

    @Patch('reorder')
    @ApiBearerAuth()
    @UseGuards(AuthUserGuard)
    async reorder(@Body() dto: ReorderDto) {
        return await this.projectService.reorder(dto.items);
    }

    @Get(':_id')
    async getById(@Param() dto: BaseIdDto) {
        return await this.projectService.findById(dto._id);
    }

    @Post()
    @ApiBearerAuth()
    @UseGuards(AuthUserGuard)
    async create(@Body() dto: ProjectDto, @Req() request: PortfolioRequest) {
        return await this.projectService.create({ ...dto, created_by: request.user._id } as any);
    }

    @Patch(':_id')
    @ApiBearerAuth()
    @UseGuards(AuthUserGuard)
    async update(
        @Param() params: BaseIdDto,
        @Body() dto: ProjectUpdateDto,
        @Req() request: PortfolioRequest,
    ) {
        await this.projectService.findById(params._id);
        return await this.projectService.updateOne(params._id, { ...dto, updated_by: request.user._id });
    }

    @Delete(':_id')
    @ApiBearerAuth()
    @UseGuards(AuthUserGuard)
    async delete(@Param() params: BaseIdDto, @Req() request: PortfolioRequest) {
        await this.projectService.findById(params._id);
        return await this.projectService.deleteOne(params._id, request.user._id);
    }
}
