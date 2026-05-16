import { Injectable } from '@nestjs/common';
import { PipelineStage, Types } from 'mongoose';
import { CollectionNames } from 'src/common/constant/collections';
import { Skill, SkillModel } from 'src/common/db/models/portfolio/skill/skill.model';
import { ErrorCodes } from 'src/common/filter/common.error';
import { CommonService } from '../../common.service';

@Injectable({})
export class SkillService extends CommonService<Skill> {
    constructor() {
        super(SkillModel, ErrorCodes.SKILL, ErrorCodes.SKILL + 1);
    }

    private $lookupCategory: PipelineStage.Lookup = {
        $lookup: {
            from: CollectionNames.SKILL_CATEGORY,
            localField: 'category_id',
            foreignField: '_id',
            pipeline: [{ $project: { title: 1, order_index: 1 } }],
            as: 'category',
        },
    };

    private $unwindCategory: PipelineStage.Unwind = {
        $unwind: { path: '$category', preserveNullAndEmptyArrays: true },
    };

    async getAll() {
        return await this.aggregate([
            { $match: {} },
            { $sort: { order_index: 1, _id: 1 } },
            this.$lookupCategory,
            this.$unwindCategory,
        ]);
    }

    async findByCategory(category_id: Types.ObjectId) {
        return await this.aggregate([
            { $match: { category_id } },
            { $sort: { order_index: 1, _id: 1 } },
        ]);
    }

    async countByCategory(category_id: Types.ObjectId) {
        return await this.count({ category_id });
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

export const skillService = new SkillService();
