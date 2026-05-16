import { CommonException, ErrorCodes } from 'src/common/filter/common.error';

export class EmployeeError extends CommonException {
    static NotFound(data?: any) {
        return new CommonException(ErrorCodes.EMPLOYEE, data);
    }

    static AlreadyExists(data?: any) {
        return new CommonException(ErrorCodes.EMPLOYEE + 1, data);
    }

    static CannotUpdate(data?: any) {
        return new CommonException(ErrorCodes.EMPLOYEE + 2, data);
    }

    static InvalidPassword(data?: any) {
        return new CommonException(ErrorCodes.EMPLOYEE + 3, data);
    }
}
