import { CommonException, ErrorCodes } from 'src/common/filter/common.error';

export class HeroError extends CommonException {
    static NotFound(data?: any) {
        return new CommonException(ErrorCodes.HERO, data);
    }

    static AlreadyExists(data?: any) {
        return new CommonException(ErrorCodes.HERO + 1, data);
    }
}
