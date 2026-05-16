import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { HeroService } from 'src/common/service/portfolio/hero/hero.service';
import { PortfolioRequest } from 'src/common/types/portfolio.types';
import { AuthUserGuard } from 'src/modules/common/guard/portfolio-auth.guard';
import { HeroUpdateDto } from './hero.dto';

@ApiTags('Hero')
@Controller('hero')
export class HeroController {
    constructor(private heroService: HeroService) {}

    @Get()
    async get() {
        return await this.heroService.getOne();
    }

    @Patch()
    @ApiBearerAuth()
    @UseGuards(AuthUserGuard)
    async update(@Body() dto: HeroUpdateDto, @Req() request: PortfolioRequest) {
        return await this.heroService.patchOne({ ...dto, updated_by: request.user._id } as any);
    }
}
