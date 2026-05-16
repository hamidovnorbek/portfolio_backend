import { CommonException, ErrorCodes } from 'src/common/filter/common.error';

export class CurrencyValueError extends CommonException {
    static NotFound(data?: any) {
        return new CommonException(ErrorCodes.CURRENCY_VALUE, data);
    }

    static AlreadyExists(data?: any) {
        return new CommonException(ErrorCodes.CURRENCY_VALUE + 1, data);
    }

    static ErrorOnConvert(data?: any) {
        return new CommonException(ErrorCodes.CURRENCY_VALUE + 2, data);
    }
}
