# Model Rules (`*.model.ts`)

**Path:** `src/common/db/models/{domain}/{module-name}/{module-name}.model.ts`

## Rules

- Import from `@typegoose/typegoose`: `getModelForClass`, `modelOptions`, `prop`, `index` (if needed)
- Class extends `BaseModel` (imported from `../../base.model`)
- `@modelOptions({ schemaOptions: { collection: CollectionNames.MY_MODULE } })`
- **Unique indexes** must use `partialFilterExpression: { is_deleted: false }` (sparse unique -- avoids conflicts on soft-deleted docs)
- Compound indexes: `@index({ field1: 1, field2: 1 }, { name: 'compound', background: true, partialFilterExpression: ... })`
- String fields that must be trimmed: `@prop({ required: true, trim: true })`
- ObjectId references: `@prop({ required: true, type: Types.ObjectId })`
- Optional fields: `@prop({ type: Types.ObjectId })` (no `required`)
- Enum fields: `@prop({ enum: MyEnum, required: true })`
- Nested object fields: `@prop({ type: () => NestedClass, _id: false })`
- Array fields: `@prop({ default: [], type: () => [NestedClass], _id: false })`
- Always export the model instance at the end: `export const MyModuleModel = getModelForClass(MyModule);`
- Enums defined in the model file are also exported from here

## BaseModel fields (inherited -- do NOT re-declare)

`is_deleted`, `created_by`, `updated_by`, `deleted_by`, `deleted_at`, `created_at`, `updated_at`

## Template

```typescript
import { getModelForClass, index, modelOptions, prop } from '@typegoose/typegoose';
import { Types } from 'mongoose';
import { CollectionNames } from 'src/common/constant/collections';
import { BaseModel } from '../../base.model';

@modelOptions({
    schemaOptions: {
        collection: CollectionNames.MY_MODULE,
    },
})
@index(
    { name: 1 },
    {
        unique: true,
        background: true,
        name: 'name',
        partialFilterExpression: { is_deleted: false },
    },
)
export class MyModule extends BaseModel {
    @prop({ required: true, trim: true })
    name: string;

    @prop({ type: Types.ObjectId })
    related_id?: Types.ObjectId;
}

export const MyModuleModel = getModelForClass(MyModule);
```
