import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { portfolioAssistant } from 'src/assistant/portfolio.assistant';

@ApiTags('Portfolio')
@Controller('portfolio')
export class PortfolioController {
    @Get()
    async get() {
        return await portfolioAssistant.getAggregatedPayload();
    }
}
