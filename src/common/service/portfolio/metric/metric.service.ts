import { Injectable } from '@nestjs/common';
import { Metric, MetricModel } from 'src/common/db/models/portfolio/metric/metric.model';
import { ErrorCodes } from 'src/common/filter/common.error';
import { CommonService } from '../../common.service';

@Injectable({})
export class MetricService extends CommonService<Metric> {
    constructor() {
        super(MetricModel, ErrorCodes.METRIC, ErrorCodes.METRIC + 1);
    }

    async getAll() {
        return await this.aggregate([{ $match: {} }, { $sort: { _id: 1 } }]);
    }
}

export const metricService = new MetricService();
