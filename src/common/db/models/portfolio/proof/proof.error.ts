import { CommonException, ErrorCodes } from 'src/common/filter/common.error';

export class ProofError extends CommonException {
    static NotFound(data?: any) {
        return new CommonException(ErrorCodes.PROOF, data);
    }

    static AlreadyExists(data?: any) {
        return new CommonException(ErrorCodes.PROOF + 1, data);
    }
}
