import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SiteSettingsService } from 'src/common/service/portfolio/site-settings/site-settings.service';
import { PortfolioRequest } from 'src/common/types/portfolio.types';
import { AuthUserGuard } from 'src/modules/common/guard/portfolio-auth.guard';
import { SiteSettingsUpdateDto } from './site-settings.dto';

@ApiTags('Site Settings')
@Controller('settings')
export class SiteSettingsController {
    constructor(private siteSettingsService: SiteSettingsService) {}

    @Get()
    async get() {
        return await this.siteSettingsService.getOne();
    }

    @Patch()
    @ApiBearerAuth()
    @UseGuards(AuthUserGuard)
    async update(@Body() dto: SiteSettingsUpdateDto, @Req() request: PortfolioRequest) {
        return await this.siteSettingsService.patchOne({ ...dto, updated_by: request.user._id } as any);
    }
}
