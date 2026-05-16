import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import {
    SkillCategory,
    SkillCategoryModel,
} from 'src/common/db/models/portfolio/skill-category/skill-category.model';
import { ErrorCodes } from 'src/common/filter/common.error';
import { CommonService } from '../../common.service';

@Injectable({})
export class SkillCategoryService extends CommonService<SkillCategory> {
    constructor() {
        super(SkillCategoryModel, ErrorCodes.SKILL_CATEGORY, ErrorCodes.SKILL_CATEGORY + 1);
    }

    async getAll() {
        return await this.aggregate([{ $match: {} }, { $sort: { order_index: 1, _id: 1 } }]);
    }

    async reorder(items: { _id: Types.ObjectId; order_index: number }[]) {
        return await this.withTransaction(async (session) => {
            for (const item of items) {
                await this.updateOne(item._id, { order_index: item.order_index }, { session });
            }
            return { updated: items.length };
        });
    }
}

export const skillCategoryService = new SkillCategoryService();
