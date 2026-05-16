import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';

export function MinNowDateString(validationOptions?: ValidationOptions) {
    return function (object, propertyName: string) {
        registerDecorator({
            name: 'MinNowDateString',
            target: object.constructor,
            propertyName: propertyName,
            options: { ...validationOptions, message: `${propertyName} can be at lest now` },
            validator: {
                validate(value: string, args: ValidationArguments) {
                    const date = new Date(value);

                    if (new Date(date.setSeconds(date.getSeconds() + 60)) < new Date()) return false;
                    return true;
                },
            },
        });
    };
}
