import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ProofService } from 'src/common/service/portfolio/proof/proof.service';
import { PortfolioRequest } from 'src/common/types/portfolio.types';
import { BaseIdDto } from 'src/common/validation/common.dto';
import { ReorderDto } from 'src/common/validation/dto/reorder.dto';
import { AuthUserGuard } from 'src/modules/common/guard/portfolio-auth.guard';
import { ProofDto, ProofUpdateDto } from './proof.dto';

@ApiTags('Proofs')
@Controller('proofs')
export class ProofController {
    constructor(private proofService: ProofService) {}

    @Get()
    async getAll() {
        return await this.proofService.getAll();
    }

    @Patch('reorder')
    @ApiBearerAuth()
    @UseGuards(AuthUserGuard)
    async reorder(@Body() dto: ReorderDto) {
        return await this.proofService.reorder(dto.items);
    }

    @Get(':_id')
    async getById(@Param() dto: BaseIdDto) {
        return await this.proofService.findById(dto._id);
    }

    @Post()
    @ApiBearerAuth()
    @UseGuards(AuthUserGuard)
    async create(@Body() dto: ProofDto, @Req() request: PortfolioRequest) {
        return await this.proofService.create({ ...dto, created_by: request.user._id } as any);
    }

    @Patch(':_id')
    @ApiBearerAuth()
    @UseGuards(AuthUserGuard)
    async update(
        @Param() params: BaseIdDto,
        @Body() dto: ProofUpdateDto,
        @Req() request: PortfolioRequest,
    ) {
        await this.proofService.findById(params._id);
        return await this.proofService.updateOne(params._id, { ...dto, updated_by: request.user._id });
    }

    @Delete(':_id')
    @ApiBearerAuth()
    @UseGuards(AuthUserGuard)
    async delete(@Param() params: BaseIdDto, @Req() request: PortfolioRequest) {
        await this.proofService.findById(params._id);
        return await this.proofService.deleteOne(params._id, request.user._id);
    }
}
