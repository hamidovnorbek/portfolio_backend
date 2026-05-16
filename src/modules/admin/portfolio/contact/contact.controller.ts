import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ContactMessageService } from 'src/common/service/portfolio/contact-message/contact-message.service';
import { sendContactTelegram } from 'src/common/utils/send-contact-telegram.util';
import { BaseIdDto } from 'src/common/validation/common.dto';
import { AuthUserGuard } from 'src/modules/common/guard/portfolio-auth.guard';
import { ContactMessageDto } from './contact.dto';

@ApiTags('Contact')
@Controller('contact')
export class ContactController {
    constructor(private contactMessageService: ContactMessageService) {}

    @Post()
    async create(@Body() dto: ContactMessageDto) {
        const created = await this.contactMessageService.create({
            sender_name: dto.sender_name,
            sender_email: dto.sender_email,
            message: dto.message,
            is_read: false,
        } as any);

        sendContactTelegram({
            sender_name: dto.sender_name,
            sender_email: dto.sender_email,
            message: dto.message,
        });

        return created;
    }

    @Get()
    @ApiBearerAuth()
    @UseGuards(AuthUserGuard)
    async getAll() {
        return await this.contactMessageService.getAll();
    }

    @Patch(':_id/read')
    @ApiBearerAuth()
    @UseGuards(AuthUserGuard)
    async markRead(@Param() params: BaseIdDto) {
        await this.contactMessageService.findById(params._id);
        return await this.contactMessageService.markAsRead(params._id);
    }
}
