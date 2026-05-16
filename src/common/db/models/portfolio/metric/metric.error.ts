import { CommonException, ErrorCodes } from 'src/common/filter/common.error';

export class MetricError extends CommonException {
    static NotFound(data?: any) {
        return new CommonException(ErrorCodes.METRIC, data);
    }

    static AlreadyExists(data?: any) {
        return new CommonException(ErrorCodes.METRIC + 1, data);
    }
}
