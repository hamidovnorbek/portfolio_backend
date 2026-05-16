import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';

export function IsDateCustom(validationOptions?: ValidationOptions) {
    return function (object, propertyName: string) {
        registerDecorator({
            name: 'isDateCustom',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [],
            options: {
                ...validationOptions,
                message: `${propertyName} must be date`,
            },
            validator: {
                validate(value: any, args: ValidationArguments) {
                    if (isNaN(Date.parse(value))) return false;
                    args.object[propertyName] = new Date(value);
                    return true;
                },
            },
        });
    };
}
