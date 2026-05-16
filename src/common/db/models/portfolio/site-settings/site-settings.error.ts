import { CommonException, ErrorCodes } from 'src/common/filter/common.error';

export class SiteSettingsError extends CommonException {
    static NotFound(data?: any) {
        return new CommonException(ErrorCodes.SITE_SETTINGS, data);
    }

    static AlreadyExists(data?: any) {
        return new CommonException(ErrorCodes.SITE_SETTINGS + 1, data);
    }
}
