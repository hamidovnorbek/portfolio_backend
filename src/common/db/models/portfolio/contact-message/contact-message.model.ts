import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import { CollectionNames } from 'src/common/constant/collections';
import { BaseModel } from '../../base.model';

@modelOptions({
    schemaOptions: {
        collection: CollectionNames.CONTACT_MESSAGE,
    },
})
export class ContactMessage extends BaseModel {
    @prop({ required: true, trim: true })
    sender_name: string;

    @prop({ required: true, trim: true })
    sender_email: string;

    @prop({ required: true, trim: true })
    message: string;

    @prop({ required: true, default: false })
    is_read: boolean;
}

export const ContactMessageModel = getModelForClass(ContactMessage);
