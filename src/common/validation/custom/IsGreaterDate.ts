import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';

export function IsGreaterDateCustom(otherField, validationOptions?: ValidationOptions) {
    return function (object, propertyName: string) {
        registerDecorator({
            name: 'isGreaterThanCustom',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [],
            options: {
                ...validationOptions,
                message: `${propertyName} must be greater than ${otherField}`,
            },
            validator: {
                validate(value: any, args: ValidationArguments) {
                    if (args.object[otherField]) return new Date(args.object[otherField]) < new Date(value);
                    return true;
                },
            },
        });
    };
}
