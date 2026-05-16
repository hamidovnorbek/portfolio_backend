import { getModelForClass, index, modelOptions, prop } from '@typegoose/typegoose';
import { CollectionNames } from 'src/common/constant/collections';
import { BaseModel } from '../../base.model';

@modelOptions({
    schemaOptions: {
        collection: CollectionNames.USER,
    },
})
@index(
    { username: 1 },
    {
        unique: true,
        background: true,
        name: 'username',
        partialFilterExpression: { is_deleted: { $eq: false } },
    },
)
export class User extends BaseModel {
    @prop({ required: true, trim: true })
    username: string;

    @prop({ required: true, trim: true })
    password: string;
}

export const UserModel = getModelForClass(User);
