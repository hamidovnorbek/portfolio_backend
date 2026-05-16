# Service Rules (`*.service.ts`)

**Path:** `src/common/service/{domain}/{module-name}/{module-name}.service.ts`

## Rules

- `@Injectable({})` decorator (with empty object)
- Extends `CommonService<ModelClass>`
- Constructor: `super(MyModuleModel, ErrorCodes.MY_MODULE, ErrorCodes.MY_MODULE + 1)`
  - First arg = Typegoose model instance
  - Second arg = not-found error code
  - Third arg = already-exists error code
- **Always export a singleton** at the bottom: `export const myModuleService = new MyModuleService();`
  - Singleton is used by assistants and other services that cannot inject via DI
  - The class itself is also used as an Injectable provider in module files
- Private `$lookup*` and `$unwind*` MongoDB aggregate pipeline stages as class fields
- Private `makeQuery(dto)` method to build the Mongoose filter from a DTO
- `getPaging(dto)` -- returns paginated results using `this.findPaging(query, dto, pipeline?)`
- `getChoose(dto)` -- same as getPaging but for dropdowns (can have different pipeline)
- Use `this.Filter` as the type for query objects: `const query: typeof this.Filter = {}`
- **DTO import**: import the admin DTO from `src/modules/admin/...` (not mobile)
- Use `this.aggregate([...pipeline])` for complex queries (auto-adds `is_deleted: false` and `__v: 0` projection)

## CommonService API Reference

| Method | Visibility | Description |
|---|---|---|
| `findById(id, options?)` | public | Find by `_id`, throws NotFound if missing/deleted |
| `findOne(query, options?)` | public | Find one matching (with `is_deleted: false`) |
| `find(query, options?)` | protected | Find all matching |
| `create(data, options?)` | public | Insert one, returns saved doc |
| `insertMany(data[], options?)` | public | Insert multiple |
| `updateOne(id, data, options?)` | public | `findByIdAndUpdate` with `{ new: true }` |
| `updateOneByQuery(query, data, options?)` | protected | `findOneAndUpdate` by query |
| `updateMany(query, data, options?)` | protected | Update all matching |
| `deleteOne(id, deleted_by, options?)` | public | Soft delete (`is_deleted: true`) |
| `deleteMany(query, deleted_by, options?)` | protected | Soft delete multiple |
| `count(query, options?)` | protected | Count non-deleted |
| `countWithPipeline(pipeline, session?)` | protected | Count via aggregate |
| `findPaging(query, dto, pipeline?, sort?)` | protected | Returns `{ total, data }` with pagination |
| `aggregate(pipeline, options?)` | protected | Run aggregate, auto-adds `is_deleted: false` |
| `withTransaction(callback, retry?)` | public | MongoDB session with retry on WriteConflict |
| `getDeletedIds(deleted_at)` | public | Get IDs soft-deleted after date |

### `findPaging` behavior
- Default sort: `{ _id: -1 }` (newest first)
- Custom sort: pass 4th argument
- `additional_pipeline` appended after `$match, $sort, $skip, $limit, $project`
- `$project` excludes `__v`
- `dto` must have `page` (min 1) and `limit` (min 1, max 500)

## Template

```typescript
import { Injectable } from '@nestjs/common';
import { PipelineStage } from 'mongoose';
import { CollectionNames } from 'src/common/constant/collections';
import { MyModule, MyModuleModel } from 'src/common/db/models/{domain}/{module-name}/{module-name}.model';
import { ErrorCodes } from 'src/common/filter/common.error';
import { MyModuleGetDto } from 'src/modules/admin/{domain}/{module-name}/{module-name}.dto';
import { CommonService } from '../../common.service';

@Injectable({})
export class MyModuleService extends CommonService<MyModule> {
    constructor() {
        super(MyModuleModel, ErrorCodes.MY_MODULE, ErrorCodes.MY_MODULE + 1);
    }

    private $lookupRelated: PipelineStage.Lookup = {
        $lookup: {
            from: CollectionNames.SOME_OTHER,
            localField: 'related_id',
            foreignField: '_id',
            pipeline: [{ $project: { name: 1 } }],
            as: 'related',
        },
    };

    private $unwindRelated: PipelineStage.Unwind = {
        $unwind: { path: '$related', preserveNullAndEmptyArrays: true },
    };

    private makeQuery(dto: MyModuleGetDto) {
        const query: typeof this.Filter = {};
        if (dto.search) query.name = dto.search;
        return query;
    }

    async getPaging(dto: MyModuleGetDto) {
        const query = this.makeQuery(dto);
        const pipeline = [this.$lookupRelated, this.$unwindRelated];
        return await this.findPaging(query, dto, pipeline);
    }

    async getChoose(dto: MyModuleGetDto) {
        const query = this.makeQuery(dto);
        return await this.findPaging(query, dto);
    }
}

export const myModuleService = new MyModuleService();
```
