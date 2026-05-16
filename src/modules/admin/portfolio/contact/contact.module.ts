import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ContactMessageService } from 'src/common/service/portfolio/contact-message/contact-message.service';
import { AuthModule } from '../auth/auth.module';
import { ContactController } from './contact.controller';

@Module({
    imports: [JwtModule.register({}), AuthModule],
    controllers: [ContactController],
    providers: [ContactMessageService],
    exports: [ContactMessageService],
})
export class ContactModule {}
