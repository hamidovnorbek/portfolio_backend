import { CommonException, ErrorCodes } from 'src/common/filter/common.error';

export class SkillCategoryError extends CommonException {
    static NotFound(data?: any) {
        return new CommonException(ErrorCodes.SKILL_CATEGORY, data);
    }

    static AlreadyExists(data?: any) {
        return new CommonException(ErrorCodes.SKILL_CATEGORY + 1, data);
    }

    static CannotDelete(data?: any) {
        return new CommonException(ErrorCodes.SKILL_CATEGORY + 2, data);
    }
}
