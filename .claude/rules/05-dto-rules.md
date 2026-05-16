# DTO Rules (`*.dto.ts`)

**Path (admin):** `src/modules/admin/{domain}/{module-name}/{module-name}.dto.ts`
**Path (mobile):** `src/modules/mobile/{domain}/{module-name}/{module-name}.dto.ts`

## Rules

- **Create DTO** extends `BaseDto` (for `created_by`, `updated_by`, etc.)
- **Get/Paging DTO** extends `PagingDto` (includes `page`, `limit`, `search`, `date_from`, `date_to`, `sort_by`, `asc`)
- **Update DTO** = `IntersectionType(BaseIdDto, PartialType(CreateDto))` -- always use NestJS utility types
- All fields shown in Swagger: `@ApiProperty({ type: String, example: DOC_ID })`

### Decorator rules by type

| Type | Decorators |
|---|---|
| Required ObjectId | `@IsMongoIdCustom()` (auto-transforms string to `Types.ObjectId`) |
| Optional ObjectId | `@IsMongoIdCustom()` + `@IsOptional()` |
| Required string | `@IsString()` |
| Optional string | `@IsString()` + `@IsOptional()` |
| Required number | `@IsNumber({ allowInfinity: false, allowNaN: false })` or `@IsInt()` |
| Positive number | `@IsPositive()` |
| Enum | `@IsEnum(MyEnum)` |
| Date | `@IsDateCustom()` (from `src/common/validation/custom/IsDate`) |
| Array | `@IsArray()` + `@IsString({ each: true })` |
| Nested object | `@Type(() => NestedDto)` + `@ValidateNested({ each: true })` |

- Server-set fields (NOT from client): declare without decorators, just `fieldName: Type`
  - Examples: `number: string`, `organization_id: Types.ObjectId`, `state: SomeEnum`
- `BaseDto` fields (inherited -- do NOT re-declare): `created_by`, `updated_by`, `deleted_by`, `created_at`, `updated_at`

## Template

```typescript
import { ApiProperty, IntersectionType, PartialType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';
import { DOC_ID } from 'src/common/constant/doc.constants';
import { BaseDto, BaseIdDto, PagingDto } from 'src/common/validation/common.dto';
import { IsMongoIdCustom } from 'src/common/validation/custom/IsMongoId';

export class MyModuleDto extends BaseDto {
    @ApiProperty({ type: String, example: 'some name' })
    @IsString()
    name: string;

    @ApiProperty({ type: String, example: DOC_ID })
    @IsMongoIdCustom()
    related_id: Types.ObjectId;

    @ApiProperty({ type: String, required: false })
    @IsString()
    @IsOptional()
    description?: string;

    // server-set -- not validated from request body
    computed_field: number;
}

export class MyModuleGetDto extends PagingDto {
    @ApiProperty({ type: String, example: DOC_ID, required: false })
    @IsMongoIdCustom()
    @IsOptional()
    related_id?: Types.ObjectId;
}

export class MyModuleUpdateDto extends IntersectionType(BaseIdDto, PartialType(MyModuleDto)) {}
```
