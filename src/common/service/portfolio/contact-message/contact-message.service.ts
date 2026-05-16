import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import {
    ContactMessage,
    ContactMessageModel,
} from 'src/common/db/models/portfolio/contact-message/contact-message.model';
import { ErrorCodes } from 'src/common/filter/common.error';
import { CommonService } from '../../common.service';

@Injectable({})
export class ContactMessageService extends CommonService<ContactMessage> {
    constructor() {
        super(ContactMessageModel, ErrorCodes.CONTACT_MESSAGE, ErrorCodes.CONTACT_MESSAGE + 1);
    }

    async getAll() {
        return await this.aggregate([{ $match: {} }, { $sort: { _id: -1 } }]);
    }

    async markAsRead(id: Types.ObjectId) {
        return await this.updateOne(id, { is_read: true });
    }
}

export const contactMessageService = new ContactMessageService();
