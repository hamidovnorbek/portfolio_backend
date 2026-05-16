import { CommonException, ErrorCodes } from 'src/common/filter/common.error';

export class ContactMessageError extends CommonException {
    static NotFound(data?: any) {
        return new CommonException(ErrorCodes.CONTACT_MESSAGE, data);
    }

    static AlreadyExists(data?: any) {
        return new CommonException(ErrorCodes.CONTACT_MESSAGE + 1, data);
    }
}
