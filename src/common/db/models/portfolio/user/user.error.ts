import { CommonException, ErrorCodes } from 'src/common/filter/common.error';

export class UserError extends CommonException {
    static NotFound(data?: any) {
        return new CommonException(ErrorCodes.USER, data);
    }

    static AlreadyExists(data?: any) {
        return new CommonException(ErrorCodes.USER + 1, data);
    }

    static InvalidPassword(data?: any) {
        return new CommonException(ErrorCodes.USER + 2, data);
    }
}
