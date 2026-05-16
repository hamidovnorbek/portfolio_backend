import { ValidationErrorData } from '../validation/common.dto';

export enum ErrorCodes {
    SUCCESS = 0,
    DEFAULT = 10000,
    EMPLOYEE = 10100,
    CURRENCY = 10200,
    CURRENCY_VALUE = 10300,

    // Portfolio domain
    USER = 12100,
    HERO = 12200,
    METRIC = 12300,
    EXPERIENCE = 12400,
    SKILL_CATEGORY = 12500,
    SKILL = 12600,
    PROOF = 12700,
    PROJECT = 12800,
    CONTACT_MESSAGE = 12900,
    SITE_SETTINGS = 13000,
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
