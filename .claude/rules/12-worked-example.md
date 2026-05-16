# Complete Worked Example: Category Module

**Scenario:** Add a `Category` module under `settings` domain.
Fields: `name` (string, required, unique), `color` (string, optional)
Admin only. Has create/paging/choose/get-by-id/update/delete + export.

## Step 1 -- `src/common/constant/collections.ts`
```typescript
CATEGORY = 'categories',
```

## Step 2 -- `src/common/filter/common.error.ts`
```typescript
CATEGORY = 12200,
```

## Step 3 -- `src/common/db/models/settings/category/category.model.ts`
```typescript
import { getModelForClass, index, modelOptions, prop } from '@typegoose/typegoose';
import { CollectionNames } from 'src/common/constant/collections';
import { BaseModel } from '../../base.model';

@modelOptions({ schemaOptions: { collection: CollectionNames.CATEGORY } })
@index({ name: 1 }, { unique: true, background: true, name: 'name', partialFilterExpression: { is_deleted: false } })
export class Category extends BaseModel {
    @prop({ required: true, trim: true })
    name: string;

    @prop({ trim: true })
    color?: string;
}

export const CategoryModel = getModelForClass(Category);
```

## Step 4 -- `src/common/db/models/settings/category/category.error.ts`
```typescript
import { CommonException, ErrorCodes } from 'src/common/filter/common.error';

export class CategoryError extends CommonException {
    static NotFound(data?: any) { return new CommonException(ErrorCodes.CATEGORY, data); }
    static AlreadyExists(data?: any) { return new CommonException(ErrorCodes.CATEGORY + 1, data); }
    static CannotDelete(data?: any) { return new CommonException(ErrorCodes.CATEGORY + 2, data); }
}
```

## Step 5 -- `src/common/service/settings/category/category.service.ts`
```typescript
import { Injectable } from '@nestjs/common';
import { Category, CategoryModel } from 'src/common/db/models/settings/category/category.model';
import { ErrorCodes } from 'src/common/filter/common.error';
import { CategoryGetDto } from 'src/modules/admin/settings/category/category.dto';
import { CommonService } from '../../common.service';

@Injectable({})
export class CategoryService extends CommonService<Category> {
    constructor() {
        super(CategoryModel, ErrorCodes.CATEGORY, ErrorCodes.CATEGORY + 1);
    }

    async getPaging(dto: CategoryGetDto) {
        const query: typeof this.Filter = {};
        if (dto.search) query.name = dto.search;
        return await this.findPaging(query, dto);
    }

    async getChoose(dto: CategoryGetDto) {
        const query: typeof this.Filter = {};
        if (dto.search) query.name = dto.search;
        return await this.findPaging(query, dto);
    }
}

export const categoryService = new CategoryService();
```

## Step 6 -- `src/modules/admin/settings/category/category.dto.ts`
```typescript
import { ApiProperty, IntersectionType, PartialType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { BaseDto, BaseIdDto, PagingDto } from 'src/common/validation/common.dto';

export class CategoryDto extends BaseDto {
    @ApiProperty({ type: String, example: 'Electronics' })
    @IsString()
    name: string;

    @ApiProperty({ type: String, required: false, example: '#FF5733' })
    @IsString()
    @IsOptional()
    color?: string;
}

export class CategoryGetDto extends PagingDto {}

export class CategoryUpdateDto extends IntersectionType(BaseIdDto, PartialType(CategoryDto)) {}
```

## Step 7 -- `src/modules/admin/settings/category/category.controller.ts`
```typescript
import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { exportAssistant } from 'src/assistant/export.assistant';
import { CategoryService } from 'src/common/service/settings/category/category.service';
import { CustomRequest } from 'src/common/types/common.types';
import { PageNames } from 'src/common/types/table.type';
import { BaseIdDto } from 'src/common/validation/common.dto';
import { AuthAdminGuard } from 'src/modules/common/guard/auth.guard';
import { I18nService } from 'src/modules/common/modules/i18n/i18n.service';
import { CategoryDto, CategoryGetDto, CategoryUpdateDto } from './category.dto';

@ApiTags('Category')
@Controller('category')
@ApiBearerAuth()
@UseGuards(AuthAdminGuard)
export class CategoryAdminController {
    constructor(
        private categoryService: CategoryService,
        private i18nService: I18nService,
    ) {}

    @Post('create')
    async create(@Body() dto: CategoryDto, @Req() request: CustomRequest) {
        dto.created_by = request.user._id;
        return await this.categoryService.create(dto);
    }

    @Post('paging')
    async get(@Body() dto: CategoryGetDto) {
        return await this.categoryService.getPaging(dto);
    }

    @Post('export')
    async export(@Body() dto: CategoryGetDto, @Req() request: CustomRequest) {
        dto.page = 1;
        dto.limit = Number.MAX_SAFE_INTEGER;
        const { data } = await this.categoryService.getPaging(dto);
        return await exportAssistant.excel(
            PageNames.CATEGORY,
            data,
            this.i18nService.translate('categories', { lang: request.lang }),
            this.i18nService,
            request.lang,
        );
    }

    @Post('choose')
    async getChoose(@Body() dto: CategoryGetDto) {
        return await this.categoryService.getChoose(dto);
    }

    @Get('get-by-id/:_id')
    async getById(@Param() dto: BaseIdDto) {
        return await this.categoryService.findById(dto._id);
    }

    @Put('update')
    async update(@Body() dto: CategoryUpdateDto, @Req() request: CustomRequest) {
        dto.updated_by = request.user._id;
        await this.categoryService.findById(dto._id);
        return await this.categoryService.updateOne(dto._id, dto);
    }

    @Delete('delete')
    async delete(@Body() dto: BaseIdDto, @Req() request: CustomRequest) {
        await this.categoryService.findById(dto._id);
        return await this.categoryService.deleteOne(dto._id, request.user._id);
    }
}
```

## Step 8 -- `src/modules/admin/settings/category/category.module.ts`
```typescript
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { CategoryService } from 'src/common/service/settings/category/category.service';
import { I18nService } from 'src/modules/common/modules/i18n/i18n.service';
import { EmployeeModule } from '../employee/employee.module';
import { CategoryAdminController } from './category.controller';

@Module({
    imports: [JwtModule.register({}), EmployeeModule],
    controllers: [CategoryAdminController],
    providers: [CategoryService, I18nService],
    exports: [CategoryService],
})
export class CategoryModule {}
```

## Step 9 -- `src/modules/admin/admin-app.module.ts`
Add `CategoryModule` import and add to `modules` array.

## Step 10 -- `src/common/types/table.type.ts`
```typescript
CATEGORY = 'category',
```

## Step 11 -- `src/common/utils/page-columns.util.ts`
```typescript
case PageNames.CATEGORY:
    columns = [
        { key: 'name', type: TableColumnType.STRING, translation_key: 'NAME' },
        { key: 'color', type: TableColumnType.STRING, translation_key: 'COLOR' },
    ];
    break;
```

## Step 12 -- `src/i18n/uz/translation.json` (and ru, en)
```json
{
  "categories": "Kategoriyalar",
  "COLOR": "Rang",
  "ERROR": {
    "12200": "Kategoriya topilmadi",
    "12201": "Bu kategoriya allaqachon mavjud",
    "12202": "Bu kategoriyani o'chirib bo'lmaydi"
  }
}
```
