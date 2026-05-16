# Controller Rules (`*.controller.ts`)

**Path:** `src/modules/admin/{domain}/{module-name}/{module-name}.controller.ts`

## Rules

- `@ApiTags('My Module')` -- human-readable Swagger tag
- `@Controller('my-module')` -- kebab-case URL prefix
- `@ApiBearerAuth()` at class level
- `@UseGuards(AuthAdminGuard)` at class level (admin) OR `@UseGuards(AuthEmployeeGuard)` (mobile)
- Constructor injects: `MyModuleService`, `I18nService` (if export endpoint exists)

## Standard Endpoint Pattern

| Decorator | Method name | Body DTO | Description |
|---|---|---|---|
| `@Post('create')` | `create` | `MyModuleDto` | Create document |
| `@Post('paging')` | `get` | `MyModuleGetDto` | Paginated list |
| `@Post('export')` | `export` | `MyModuleGetDto` | Excel export |
| `@Post('choose')` | `getChoose` | `MyModuleGetDto` | Dropdown list |
| `@Get('get-by-id/:_id')` | `getById` | `@Param() BaseIdDto` | Single by ID |
| `@Put('update')` | `update` | `MyModuleUpdateDto` | Update document |
| `@Delete('delete')` | `delete` | `BaseIdDto` | Soft delete |

## Endpoint Rules

- Every endpoint: `@Req() request: CustomRequest` for user info
- Set `dto.created_by = request.user._id` before creating
- Set `dto.updated_by = request.user._id` before updating
- For `export`: set `dto.page = 1; dto.limit = Number.MAX_SAFE_INTEGER;` before calling `getPaging`
- For `delete`: check if document is referenced by another collection first; if so, throw `MyModuleError.CannotDelete()`
- For delete: `return await this.myModuleService.deleteOne(dto._id, request.user._id);`

## Template

```typescript
import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { exportAssistant } from 'src/assistant/export.assistant';
import { MyModuleService } from 'src/common/service/{domain}/{module-name}/{module-name}.service';
import { CustomRequest } from 'src/common/types/common.types';
import { PageNames } from 'src/common/types/table.type';
import { BaseIdDto } from 'src/common/validation/common.dto';
import { AuthAdminGuard } from 'src/modules/common/guard/auth.guard';
import { I18nService } from 'src/modules/common/modules/i18n/i18n.service';
import { MyModuleDto, MyModuleGetDto, MyModuleUpdateDto } from './my-module.dto';

@ApiTags('My Module')
@Controller('my-module')
@ApiBearerAuth()
@UseGuards(AuthAdminGuard)
export class MyModuleAdminController {
    constructor(
        private myModuleService: MyModuleService,
        private i18nService: I18nService,
    ) {}

    @Post('create')
    async create(@Body() dto: MyModuleDto, @Req() request: CustomRequest) {
        dto.created_by = request.user._id;
        return await this.myModuleService.create(dto);
    }

    @Post('paging')
    async get(@Body() dto: MyModuleGetDto) {
        return await this.myModuleService.getPaging(dto);
    }

    @Post('export')
    async export(@Body() dto: MyModuleGetDto, @Req() request: CustomRequest) {
        dto.page = 1;
        dto.limit = Number.MAX_SAFE_INTEGER;
        const { data } = await this.myModuleService.getPaging(dto);
        return await exportAssistant.excel(
            PageNames.MY_MODULE,
            data,
            this.i18nService.translate('my_modules', { lang: request.lang }),
            this.i18nService,
            request.lang,
        );
    }

    @Post('choose')
    async getChoose(@Body() dto: MyModuleGetDto) {
        return await this.myModuleService.getChoose(dto);
    }

    @Get('get-by-id/:_id')
    async getById(@Param() dto: BaseIdDto) {
        return await this.myModuleService.findById(dto._id);
    }

    @Put('update')
    async update(@Body() dto: MyModuleUpdateDto, @Req() request: CustomRequest) {
        dto.updated_by = request.user._id;
        await this.myModuleService.findById(dto._id);
        return await this.myModuleService.updateOne(dto._id, dto);
    }

    @Delete('delete')
    async delete(@Body() dto: BaseIdDto, @Req() request: CustomRequest) {
        await this.myModuleService.findById(dto._id);
        // check references if needed
        return await this.myModuleService.deleteOne(dto._id, request.user._id);
    }
}
```
