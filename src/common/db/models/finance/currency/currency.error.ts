import { CommonException, ErrorCodes } from 'src/common/filter/common.error';

export class CurrencyError extends CommonException {
    static NotFound(data?: any) {
        return new CommonException(ErrorCodes.CURRENCY, data);
    }

    static AlreadyExists(data?: any) {
        return new CommonException(ErrorCodes.CURRENCY + 1, data);
    }

    static CannotDelete(data?: any) {
        return new CommonException(ErrorCodes.CURRENCY + 2, data);
    }

    static MainNotFound(data?: any) {
        return new CommonException(ErrorCodes.CURRENCY + 3, data);
    }
}
