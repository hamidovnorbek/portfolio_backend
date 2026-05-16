import { CommonException, ErrorCodes } from 'src/common/filter/common.error';

export class SkillError extends CommonException {
    static NotFound(data?: any) {
        return new CommonException(ErrorCodes.SKILL, data);
    }

    static AlreadyExists(data?: any) {
        return new CommonException(ErrorCodes.SKILL + 1, data);
    }
}
