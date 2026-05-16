import { ValidationErrorData } from '../validation/common.dto';

export enum ErrorCodes {
    SUCCESS = 0,
    DEFAULT = 10000,
    EMPLOYEE = 10100,
    CURRENCY = 10200,
    CURRENCY_VALUE = 10300,
}

export class CommonException {
    constructor(
        public code: number,
        public data?: any,
        public replace?: any,
    ) {}
    static Unknown(e?) {
        return new CommonException(ErrorCodes.DEFAULT + 1, e);
    }
    static UnAuthorized() {
        return new CommonException(ErrorCodes.DEFAULT + 2);
    }
    static NoPermission(data?) {
        return new CommonException(ErrorCodes.DEFAULT + 3, data);
    }
    static Validation(data: ValidationErrorData[]) {
        return new CommonException(ErrorCodes.DEFAULT + 4, data);
    }
}
