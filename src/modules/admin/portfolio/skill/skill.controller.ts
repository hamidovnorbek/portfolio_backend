import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SkillService } from 'src/common/service/portfolio/skill/skill.service';
import { PortfolioRequest } from 'src/common/types/portfolio.types';
import { BaseIdDto } from 'src/common/validation/common.dto';
import { ReorderDto } from 'src/common/validation/dto/reorder.dto';
import { AuthUserGuard } from 'src/modules/common/guard/portfolio-auth.guard';
import { SkillDto, SkillUpdateDto } from './skill.dto';

@ApiTags('Skills')
@Controller('skills')
export class SkillController {
    constructor(private skillService: SkillService) {}

    @Get()
    async getAll() {
        return await this.skillService.getAll();
    }

    @Patch('reorder')
    @ApiBearerAuth()
    @UseGuards(AuthUserGuard)
    async reorder(@Body() dto: ReorderDto) {
        return await this.skillService.reorder(dto.items);
    }

    @Get(':_id')
    async getById(@Param() dto: BaseIdDto) {
        return await this.skillService.findById(dto._id);
    }

    @Post()
    @ApiBearerAuth()
    @UseGuards(AuthUserGuard)
    async create(@Body() dto: SkillDto, @Req() request: PortfolioRequest) {
        return await this.skillService.create({ ...dto, created_by: request.user._id } as any);
    }

    @Patch(':_id')
    @ApiBearerAuth()
    @UseGuards(AuthUserGuard)
    async update(
        @Param() params: BaseIdDto,
        @Body() dto: SkillUpdateDto,
        @Req() request: PortfolioRequest,
    ) {
        await this.skillService.findById(params._id);
        return await this.skillService.updateOne(params._id, { ...dto, updated_by: request.user._id });
    }

    @Delete(':_id')
    @ApiBearerAuth()
    @UseGuards(AuthUserGuard)
    async delete(@Param() params: BaseIdDto, @Req() request: PortfolioRequest) {
        await this.skillService.findById(params._id);
        return await this.skillService.deleteOne(params._id, request.user._id);
    }
}
