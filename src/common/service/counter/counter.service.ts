import { Injectable } from '@nestjs/common';
import { CommonService } from '../common.service';
import { Counter, CounterModel } from 'src/common/db/models/counter/counter.model';

@Injectable({})
export class CounterService extends CommonService<Counter> {
    constructor() {
        super(CounterModel);
    }

    async getLast(type: keyof Counter, options?) {
        let counter = await this.findOne({}, options);
        if (!counter) counter = await this.create({}, options);

        await this.updateOne(counter._id, { $inc: { [type]: 1 } }, options);

        return counter[type]?.toString().padStart(4, '0');
    }
}

export const counterService = new CounterService();
