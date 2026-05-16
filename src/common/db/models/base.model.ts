import { index, modelOptions, prop, Severity } from '@typegoose/typegoose';
import { Types } from 'mongoose';

export class LanguageModel {
    @prop({ trim: true, default: '' })
    uz: string;

    @prop({ trim: true, default: '' })
    ru?: string;

    @prop({ trim: true, default: '' })
    en?: string;
}

@modelOptions({
    schemaOptions: {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        },
    },
    options: {
        allowMixed: Severity.ALLOW,
    },
})
@index(
    { is_deleted: 1 },
    {
        background: true,
        name: 'is_deleted',
    },
)
export class BaseModel {
    @prop({ default: false })
    is_deleted?: boolean;

    @prop({})
    created_by?: Types.ObjectId;

    @prop({})
    updated_by?: Types.ObjectId;

    @prop({})
    deleted_by?: Types.ObjectId;

    @prop({})
    deleted_at?: Date;

    created_at?: Date;
    updated_at?: Date;
}
