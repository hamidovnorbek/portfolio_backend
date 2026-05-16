import { CommonException, ErrorCodes } from 'src/common/filter/common.error';

export class ExperienceError extends CommonException {
    static NotFound(data?: any) {
        return new CommonException(ErrorCodes.EXPERIENCE, data);
    }

    static AlreadyExists(data?: any) {
        return new CommonException(ErrorCodes.EXPERIENCE + 1, data);
    }
}
