import { CommonException, ErrorCodes } from 'src/common/filter/common.error';

export class ProjectError extends CommonException {
    static NotFound(data?: any) {
        return new CommonException(ErrorCodes.PROJECT, data);
    }

    static AlreadyExists(data?: any) {
        return new CommonException(ErrorCodes.PROJECT + 1, data);
    }
}
