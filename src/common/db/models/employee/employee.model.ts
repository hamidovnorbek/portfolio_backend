import { getModelForClass, index, modelOptions, prop } from '@typegoose/typegoose';
import { Types } from 'mongoose';
import { CollectionNames } from 'src/common/constant/collections';
import { AcceptLanguages } from 'src/common/constant/languages';
import { BaseModel } from '../base.model';

export enum EmployeeType {
    ADMIN = 'admin',
    EMPLOYEE = 'employee',
}

@modelOptions({
    schemaOptions: {
        collection: CollectionNames.EMPLOYEE,
    },
})
@index(
    {
        phone_number: 1,
        type: 1,
    },
    {
        unique: true,
        background: true,
        name: 'phone_number',
        partialFilterExpression: { is_deleted: { $eq: false } },
    },
)
export class Employee extends BaseModel {
    @prop({ required: true, enum: EmployeeType })
    type: EmployeeType;

    @prop({ default: '', trim: true })
    full_name: string;

    @prop({ required: true, trim: true })
    phone_number: string;

    @prop({ trim: true })
    description?: string;

    @prop({ trim: true })
    password?: string;

    @prop({ default: [] })
    organization_ids?: Types.ObjectId[];

    @prop({ type: Types.ObjectId })
    role_id?: Types.ObjectId;

    @prop({ default: AcceptLanguages.UZ })
    locale?: AcceptLanguages;

    @prop({ default: false })
    is_boss?: boolean;
}

export const EmployeeModel = getModelForClass(Employee);
