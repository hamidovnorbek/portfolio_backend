import { isMongoId, registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';
import mongoose from 'mongoose';
import { CollectionNames } from 'src/common/constant/collections';

interface IsMongoIdOptions extends ValidationOptions {
    collection?: CollectionNames;
}

export function IsMongoIdCustom(validationOptions?: IsMongoIdOptions) {
    return function (object, propertyName: string) {
        registerDecorator({
            name: 'isMongoIdCustom',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [],
            options: {
                ...validationOptions,
                message: `${propertyName} must be mongodb id`,
            },

            validator: {
                validate(value: any, args: ValidationArguments) {
                    if (!isMongoId(value?.toString())) return false;

                    if (args.object[propertyName] instanceof Array) {
                        args.object[propertyName] = args.object[propertyName].map(
                            (id) => new mongoose.Types.ObjectId(id?.toString()),
                        );
                    } else {
                        args.object[propertyName] = new mongoose.Types.ObjectId(value?.toString());
                    }
                    return true;
                },
            },
        });
    };
}
