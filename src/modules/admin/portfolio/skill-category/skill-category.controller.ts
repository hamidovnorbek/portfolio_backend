import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SkillCategoryError } from 'src/common/db/models/portfolio/skill-category/skill-category.error';
import { SkillCategoryService } from 'src/common/service/portfolio/skill-category/skill-category.service';
import { skillService } from 'src/common/service/portfolio/skill/skill.service';
import { PortfolioRequest } from 'src/common/types/portfolio.types';
import { BaseIdDto } from 'src/common/validation/common.dto';
import { ReorderDto } from 'src/common/validation/dto/reorder.dto';
import { AuthUserGuard } from 'src/modules/common/guard/portfolio-auth.guard';
import { SkillCategoryDto, SkillCategoryUpdateDto } from './skill-category.dto';

@ApiTags('Skill Categories')
@Controller('skill-categories')
export class SkillCategoryController {
    constructor(private skillCategoryService: SkillCategoryService) {}

    @Get()
    async getAll() {
        return await this.skillCategoryService.getAll();
    }

    @Patch('reorder')
    @ApiBearerAuth()
    @UseGuards(AuthUserGuard)
    async reorder(@Body() dto: ReorderDto) {
        return await this.skillCategoryService.reorder(dto.items);
    }

    @Get(':_id')
    async getById(@Param() dto: BaseIdDto) {
        return await this.skillCategoryService.findById(dto._id);
    }

    @Post()
    @ApiBearerAuth()
    @UseGuards(AuthUserGuard)
    async create(@Body() dto: SkillCategoryDto, @Req() request: PortfolioRequest) {
        return await this.skillCategoryService.create({ ...dto, created_by: request.user._id } as any);
    }

    @Patch(':_id')
    @ApiBearerAuth()
    @UseGuards(AuthUserGuard)
    async update(
        @Param() params: BaseIdDto,
        @Body() dto: SkillCategoryUpdateDto,
        @Req() request: PortfolioRequest,
    ) {
        await this.skillCategoryService.findById(params._id);
        return await this.skillCategoryService.updateOne(params._id, { ...dto, updated_by: request.user._id });
    }

    @Delete(':_id')
    @ApiBearerAuth()
    @UseGuards(AuthUserGuard)
    async delete(@Param() params: BaseIdDto, @Req() request: PortfolioRequest) {
        const category = await this.skillCategoryService.findById(params._id);
        const linkedSkills = await skillService.countByCategory(category._id);
        if (linkedSkills > 0) throw SkillCategoryError.CannotDelete(category._id);
        return await this.skillCategoryService.deleteOne(params._id, request.user._id);
    }
}
