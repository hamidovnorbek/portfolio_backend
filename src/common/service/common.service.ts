import { Logger } from '@nestjs/common';
import { BeAnObject, DocumentType, ModelType } from '@typegoose/typegoose/lib/types';
import mongoose, {
    AggregateOptions,
    ClientSession,
    Document,
    FilterQuery,
    PipelineStage,
    QueryOptions,
    SaveOptions,
    Types,
    UpdateQuery,
} from 'mongoose';
import { BaseModel } from '../db/models/base.model';
import { CommonException, ErrorCodes } from '../filter/common.error';
import { delay } from '../utils/delay.util';
import { sendBug } from '../utils/send-telegram.util';
import { PagingDto } from '../validation/common.dto';

export class CommonService<T extends BaseModel> {
    constructor(
        protected model: ModelType<T>,
        private not_found_code: number = ErrorCodes.DEFAULT + 5,
        private already_exists_code: number = ErrorCodes.DEFAULT + 6,
    ) {}

    protected Filter: FilterQuery<T & Document>;

    private logExecutionTime(startTime: number, collectionName: string, methodName: string, params: any = {}) {
        const executionTime = Date.now() - startTime;
        let maxExecutionTime = 100;
        if (/(create|update|delete|findOne|insertMany)/i.test(methodName)) maxExecutionTime = 50;

        if (executionTime > maxExecutionTime) {
            Logger.warn(`${collectionName}.${methodName} - Executed in ${executionTime}ms`, 'Mongoose');
        } else Logger.log(`${collectionName}.${methodName} - Executed in ${executionTime}ms`, 'Mongoose');
    }

    async withTransaction(callback, retry = 0) {
        try {
            let result;
            const session = await mongoose.startSession();

            await session.withTransaction(async () => {
                Logger.log('withTransaction started');
                result = await callback(session);
            }, {});

            await session.endSession();
            Logger.log('withTransaction ended');
            return result;
        } catch (error) {
            Logger.error('withTransaction error', error);
            if (
                (error instanceof CommonException &&
                    error.data?.code == 112 &&
                    error.data?.codeName == 'WriteConflict') ||
                (error?.code == 112 && error?.codeName == 'WriteConflict')
            ) {
                console.error(error);
                sendBug({ 'retry transaction': retry });
                await delay(200);
                return await this.withTransaction(callback, retry + 1);
            }
            throw error;
        }
    }
    private $projectCommon = {
        __v: 0,
    };

    protected async count(query: FilterQuery<DocumentType<T, BeAnObject>>, options?): Promise<number> {
        const startTime = Date.now();
        try {
            return await this.model.countDocuments(
                {
                    ...query,
                    is_deleted: false,
                },
                options,
            );
        } catch (error) {
            throw CommonException.Unknown(error);
        } finally {
            this.logExecutionTime(startTime, this.model.collection.name, 'count', { ...query, is_deleted: false });
        }
    }

    protected async countWithPipeline(pipeline: PipelineStage[], session?: ClientSession): Promise<number> {
        const startTime = Date.now();
        try {
            const options: AggregateOptions = {};
            if (session) options.session = session;

            const firstStage: PipelineStage = pipeline[0];
            const madePipeline = [];
            if (firstStage && '$match' in firstStage) {
                firstStage.$match = {
                    ...firstStage.$match,
                    is_deleted: false,
                };
            } else madePipeline.push({ $match: { is_deleted: false } });

            const $group: PipelineStage.Group = {
                $group: {
                    _id: null,
                    count: {
                        $sum: 1,
                    },
                },
            };

            madePipeline.push(...pipeline, $group);

            const result = await this.model.aggregate(madePipeline, options);
            if (result.length) return result.shift().count;
            return 0;
        } catch (error) {
            throw CommonException.Unknown(error);
        } finally {
            this.logExecutionTime(startTime, this.model.collection.name, 'countWithPipeline', pipeline[0]);
        }
    }

    protected async find(query: FilterQuery<DocumentType<T, BeAnObject>>, options?: QueryOptions) {
        const startTime = Date.now();
        try {
            return await this.model.find({ is_deleted: false, ...query }, this.$projectCommon, options);
        } catch (error) {
            throw CommonException.Unknown(error);
        } finally {
            this.logExecutionTime(startTime, this.model.collection.name, 'find', { is_deleted: false, ...query });
        }
    }

    public async findOne(query: FilterQuery<DocumentType<T, BeAnObject>>, options?: QueryOptions) {
        const startTime = Date.now();
        try {
            return await this.model.findOne({ is_deleted: false, ...query }, this.$projectCommon, options);
        } catch (error) {
            throw CommonException.Unknown(error);
        } finally {
            this.logExecutionTime(startTime, this.model.collection.name, 'findOne', { is_deleted: false, ...query });
        }
    }

    public async findById(id: Types.ObjectId | string, options?: QueryOptions) {
        const startTime = Date.now();
        const result = await this.model.findById(id, this.$projectCommon, options);
        if (!result || result.is_deleted) throw new CommonException(this.not_found_code, id);
        this.logExecutionTime(startTime, this.model.collection.name, 'findById', id);
        return result;
    }

    public async create(data: T, options?: SaveOptions) {
        const startTime = Date.now();
        try {
            for (const key of Object.keys(data)) if (data[key] == null) delete data[key];
            const saved = await this.model.create([data], options);
            return await this.model.findById(saved[0]._id, this.$projectCommon, options);
        } catch (error) {
            if (error instanceof CommonException) throw error;
            if (error.code == 11000) throw new CommonException(this.already_exists_code, error.keyValue);
            throw CommonException.Unknown(error);
        } finally {
            this.logExecutionTime(startTime, this.model.collection.name, 'create');
        }
    }

    public async insertMany(data: T[], options?: SaveOptions) {
        const startTime = Date.now();
        try {
            return await this.model.create(data, options);
        } catch (error) {
            if (error instanceof CommonException) throw error;
            if (error.code == 11000) throw new CommonException(this.already_exists_code, error.keyValue);
            throw CommonException.Unknown(error);
        } finally {
            this.logExecutionTime(startTime, this.model.collection.name, 'insertMany');
        }
    }

    public async updateOne(
        id: Types.ObjectId | string,
        data: UpdateQuery<DocumentType<T, BeAnObject>>,
        options?: QueryOptions,
    ) {
        const startTime = Date.now();
        try {
            return await this.model.findByIdAndUpdate(id, data, { new: true, ...options });
        } catch (error) {
            if (error instanceof CommonException) throw error;
            if (error.code == 11000) throw new CommonException(this.already_exists_code, error.keyValue);
            throw CommonException.Unknown(error);
        } finally {
            this.logExecutionTime(startTime, this.model.collection.name, 'updateOne');
        }
    }

    protected async updateOneByQuery(
        query: FilterQuery<DocumentType<T, BeAnObject>>,
        data: UpdateQuery<DocumentType<T, BeAnObject>>,
        options?: QueryOptions,
    ) {
        const startTime = Date.now();
        try {
            return await this.model.findOneAndUpdate({ is_deleted: false, ...query }, data, { new: true, ...options });
        } catch (error) {
            if (error instanceof CommonException) throw error;
            if (error.code == 11000) throw new CommonException(this.already_exists_code, error.keyValue);
            throw CommonException.Unknown(error);
        } finally {
            this.logExecutionTime(startTime, this.model.collection.name, 'updateOneByQuery', { query });
        }
    }

    protected async updateMany(
        query: FilterQuery<DocumentType<T, BeAnObject>>,
        data: UpdateQuery<DocumentType<T, BeAnObject>>,
        options?: QueryOptions,
    ) {
        const startTime = Date.now();
        try {
            return await this.model.updateMany({ is_deleted: false, ...query }, data, options);
        } catch (error) {
            if (error instanceof CommonException) throw error;
            if (error.code == 11000) throw new CommonException(this.already_exists_code, error.keyValue);
            throw CommonException.Unknown(error);
        } finally {
            this.logExecutionTime(startTime, this.model.collection.name, 'updateMany', { query });
        }
    }

    public async deleteOne(id: Types.ObjectId | string, deleted_by: Types.ObjectId = null, options?: QueryOptions) {
        const startTime = Date.now();
        try {
            return await this.model.findByIdAndUpdate(
                id,
                { is_deleted: true, deleted_at: new Date(), deleted_by },
                { new: true, ...options },
            );
        } catch (error) {
            throw CommonException.Unknown(error);
        } finally {
            this.logExecutionTime(startTime, this.model.collection.name, 'deleteOne');
        }
    }

    protected async deleteMany(
        query: FilterQuery<DocumentType<T, BeAnObject>>,
        deleted_by: Types.ObjectId = null,
        options?,
    ) {
        const startTime = Date.now();
        try {
            return await this.model.updateMany(
                query,
                { is_deleted: true, deleted_at: new Date(), deleted_by },
                { new: true, ...options },
            );
        } catch (error) {
            throw CommonException.Unknown(error);
        } finally {
            this.logExecutionTime(startTime, this.model.collection.name, 'deleteMany', query);
        }
    }

    protected async aggregate(pipeline: PipelineStage[], options?: AggregateOptions) {
        const startTime = Date.now();
        try {
            const firstStage: PipelineStage = pipeline[0];
            const madePipeline = [];
            if (firstStage && '$match' in firstStage && !firstStage.$match['_id']) {
                firstStage.$match = {
                    ...firstStage.$match,
                    is_deleted: false,
                };
            } else madePipeline.push({ $match: { is_deleted: false } });

            madePipeline.push(...pipeline);

            madePipeline.push({
                $project: this.$projectCommon,
            });

            return await this.model.aggregate(madePipeline, options).allowDiskUse(true);
        } catch (error) {
            throw CommonException.Unknown(error);
        } finally {
            this.logExecutionTime(startTime, this.model.collection.name, 'aggregate', pipeline[0]);
        }
    }

    protected async findPaging(
        query: FilterQuery<DocumentType<T, BeAnObject>>,
        dto: PagingDto,
        additional_pipeline: PipelineStage[] = [],
        sort: any = null,
    ) {
        const startTime = Date.now();
        const madeQuery = {
            ...query,
            is_deleted: false,
        };
        try {
            const $match: PipelineStage.Match = {
                $match: madeQuery,
            };
            const $sort: PipelineStage.Sort = {
                $sort: {
                    _id: -1,
                },
            };
            if (sort) $sort.$sort = sort;

            const $skip: PipelineStage.Skip = {
                $skip: dto.limit * (dto.page - 1),
            };
            const $limit: PipelineStage.Limit = {
                $limit: dto.limit,
            };
            const $project: PipelineStage.Project = {
                $project: this.$projectCommon,
            };

            const pipeline: PipelineStage[] = [$match, $sort, $skip, $limit, $project, ...additional_pipeline];
            const total = await this.count(madeQuery);
            const data = await this.model.aggregate(pipeline).allowDiskUse(true);
            return {
                total,
                data,
            };
        } catch (error) {
            throw CommonException.Unknown(error);
        } finally {
            this.logExecutionTime(startTime, this.model.collection.name, 'findPaging', { query: madeQuery });
        }
    }

    async getDeletedIds(deleted_at: Date) {
        try {
            const $match: PipelineStage.Match = {
                $match: {
                    is_deleted: true,
                    deleted_at: { $gte: deleted_at },
                },
            };

            const $group: PipelineStage.Group = {
                $group: {
                    _id: null,
                    ids: { $push: '$_id' },
                },
            };

            const pipeline = [$match, $group];

            return await this.model.aggregate(pipeline);
        } catch (error) {
            throw CommonException.Unknown(error);
        } finally {
            this.logExecutionTime(Date.now(), this.model.collection.name, 'getDeletedIds', { deleted_at });
        }
    }
}
