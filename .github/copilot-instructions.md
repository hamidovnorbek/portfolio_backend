# Backend Architecture Instructions

> This document describes **every rule, pattern, and convention** used in this NestJS + MongoDB backend.  
> When starting a new module, follow the steps in exact order. Nothing should be skipped.

---

## Table of Contents

1. [Tech Stack](#1-tech-stack)
2. [Two-App Architecture](#2-two-app-architecture)
3. [Full Folder Structure](#3-full-folder-structure)
4. [Step-by-Step: Adding a New Module](#4-step-by-step-adding-a-new-module)
5. [File-by-File Rules](#5-file-by-file-rules)
   - [5.1 Model (`*.model.ts`)](#51-model-modelts)
   - [5.2 Error (`*.error.ts`)](#52-error-errorts)
   - [5.3 Service (`*.service.ts`)](#53-service-servicets)
   - [5.4 DTO (`*.dto.ts`)](#54-dto-dtots)
   - [5.5 Controller (`*.controller.ts`)](#55-controller-controllerts)
   - [5.6 Module (`*.module.ts`)](#56-module-modulets)
   - [5.7 Assistant (`*.assistant.ts`)](#57-assistant-assistantts)
6. [Shared Registry Files (Always Update These)](#6-shared-registry-files-always-update-these)
7. [Naming Conventions](#7-naming-conventions)
8. [CommonService API Reference](#8-commonservice-api-reference)
9. [Request / Response Contract](#9-request--response-contract)
10. [Guards & Authentication](#10-guards--authentication)
11. [i18n & Translations](#11-i18n--translations)
12. [Export Feature](#12-export-feature)
13. [Soft Delete Pattern](#13-soft-delete-pattern)
14. [Transaction (MongoDB Session) Pattern](#14-transaction-mongodb-session-pattern)
15. [Counter / Auto-Number Pattern](#15-counter--auto-number-pattern)
16. [Complete Worked Example](#16-complete-worked-example)

---

## 1. Tech Stack

| Layer | Library |
|---|---|
| Framework | NestJS 10 |
| Language | TypeScript |
| Database | MongoDB via Mongoose 7 + `@typegoose/typegoose` 11 |
| Auth | `@nestjs/jwt` — Bearer token |
| Validation | `class-validator` + `class-transformer` |
| API Docs | `@nestjs/swagger` |
| i18n | `nestjs-i18n` |
| Excel Export | `exceljs` |
| Config | `dotenv` (`.env.development` / `.env.production`) |
| Process Manager | PM2 |

---

## 2. Two-App Architecture

There are **two completely separate NestJS applications** running in the same process:

| App | Module | Guard | Port env key | Swagger path |
|---|---|---|---|---|
| Admin | `AdminAppModule` | `AuthAdminGuard` | `ADMIN_PORT` | `/docs` |
| Mobile | `MobileAppModule` | `AuthEmployeeGuard` | `MOBILE_PORT` | `/docs` |

- Both apps share the **same models, services, and error classes** from `src/common/`.
- Each app has its **own controllers, DTOs, and module files** under `src/modules/admin/` and `src/modules/mobile/`.
- Both apps use `JwtModule.register({})` (secret resolved at runtime via `ConfigService`).
- Both apps apply: `ValidationPipe`, `AllExceptionFilter`, `TransformInterceptor`, global prefix `v1`, CORS enabled.

---

## 3. Full Folder Structure

```
src/
├── main.ts                          # Bootstraps both apps
├── assistant/                       # Business-logic orchestrators (plain classes, singletons)
│   └── {name}.assistant.ts
├── common/
│   ├── config/
│   │   ├── config.interface.ts      # ConfigKeysUnion type + IConfigService interface
│   │   └── config.service.ts        # Reads .env.{NODE_ENV} file
│   ├── constant/
│   │   ├── collections.ts           # ← ADD new CollectionNames enum entry here
│   │   ├── doc.constants.ts         # Swagger example constants (DOC_ID, etc.)
│   │   ├── languages.ts             # AcceptLanguages enum
│   │   └── roles.ts
│   ├── db/
│   │   ├── connect.db.ts
│   │   └── models/
│   │       ├── base.model.ts        # BaseModel with is_deleted, created_by, timestamps
│   │       ├── {domain}/
│   │       │   └── {module-name}/
│   │       │       ├── {module-name}.model.ts   # Typegoose class + getModelForClass
│   │       │       └── {module-name}.error.ts   # Static error factory methods
│   │       └── counter/
│   │           └── counter.model.ts
│   ├── filter/
│   │   ├── common.error.ts          # ← ADD new ErrorCodes entry here
│   │   └── http-exception.filter.ts
│   ├── interceptor/
│   │   └── response.interceptor.ts  # Wraps all responses in {statusCode, code, data, ...}
│   ├── middleware/
│   │   └── logger.middleware.ts     # Logs requests + sets req.lang from Accept-Language
│   ├── service/
│   │   ├── common.service.ts        # Generic base service (CRUD + aggregate + paging)
│   │   ├── with-transaction.ts      # Standalone withTransaction helper
│   │   ├── counter/
│   │   └── {domain}/
│   │       └── {module-name}/
│   │           └── {module-name}.service.ts
│   ├── types/
│   │   ├── common.types.ts          # CustomRequest interface
│   │   └── table.type.ts            # ← ADD PageNames entry + Table column definitions
│   ├── utils/
│   │   ├── page-columns.util.ts     # ← ADD column definitions for export
│   │   └── ...
│   └── validation/
│       ├── common.dto.ts            # BaseDto, BaseIdDto, PagingDto, CommonSearchDto, DateFilterDto
│       └── custom/
│           ├── IsDate.ts
│           ├── IsGreaterDate.ts
│           └── IsMongoId.ts
├── generated/
│   └── i18n.generated.ts            # Auto-generated — do not edit manually
├── i18n/
│   ├── uz/translation.json          # ← ADD translation keys here
│   ├── ru/translation.json
│   └── en/translation.json
├── migration/
│   └── migrate.ts
└── modules/
    ├── admin/
    │   ├── admin-app.module.ts       # ← IMPORT new admin module here
    │   └── {domain}/
    │       └── {module-name}/
    │           ├── {module-name}.controller.ts
    │           ├── {module-name}.dto.ts
    │           └── {module-name}.module.ts
    ├── common/
    │   ├── doc/
    │   ├── guard/
    │   │   └── auth.guard.ts        # AuthAdminGuard + AuthEmployeeGuard
    │   └── modules/
    │       ├── auth/
    │       ├── i18n/
    │       └── upload/
    └── mobile/
        ├── mobile.app.module.ts      # ← IMPORT new mobile module here (if needed)
        └── {domain}/
            └── {module-name}/
                ├── {module-name}.controller.ts
                ├── {module-name}.dto.ts
                └── {module-name}.module.ts
```

**Domains currently used:** `settings`, `finance`, `supply`, `warehouse`, `employee`

---

## 4. Step-by-Step: Adding a New Module

Do these **in exact order**. Each step depends on the previous one.

### Step 1 — Register the collection name
File: `src/common/constant/collections.ts`  
Add a new entry to the `CollectionNames` enum:
```typescript
MY_MODULE = 'myModules',  // camelCase plural MongoDB collection name
```

### Step 2 — Register the error code
File: `src/common/filter/common.error.ts`  
Add a new entry to the `ErrorCodes` enum. Error codes are spaced 100 apart:
```typescript
MY_MODULE = 12100,  // use next available block of 100
```

### Step 3 — Create the Model
Path: `src/common/db/models/{domain}/{module-name}/{module-name}.model.ts`

### Step 4 — Create the Error class
Path: `src/common/db/models/{domain}/{module-name}/{module-name}.error.ts`

### Step 5 — Create the Service
Path: `src/common/service/{domain}/{module-name}/{module-name}.service.ts`

### Step 6 — Create Admin DTO
Path: `src/modules/admin/{domain}/{module-name}/{module-name}.dto.ts`

### Step 7 — Create Admin Controller
Path: `src/modules/admin/{domain}/{module-name}/{module-name}.controller.ts`

### Step 8 — Create Admin Module
Path: `src/modules/admin/{domain}/{module-name}/{module-name}.module.ts`

### Step 9 — Register in AdminAppModule
File: `src/modules/admin/admin-app.module.ts`  
Import and add to `modules` array.

### Step 10 — Add export support (if module has Excel export)
- Add entry to `PageNames` enum in `src/common/types/table.type.ts`
- Add case to `getPageColumns()` switch in `src/common/utils/page-columns.util.ts`

### Step 11 — Add translation keys
Add keys to all three files:
- `src/i18n/uz/translation.json`
- `src/i18n/ru/translation.json`
- `src/i18n/en/translation.json`

### Step 12 — Create Mobile Module (if needed)
Repeat Steps 6–9 but under `src/modules/mobile/{domain}/{module-name}/` and register in `MobileAppModule`.

---

## 5. File-by-File Rules

### 5.1 Model (`*.model.ts`)

**Path:** `src/common/db/models/{domain}/{module-name}/{module-name}.model.ts`

**Rules:**
- Import from `@typegoose/typegoose`: `getModelForClass`, `modelOptions`, `prop`, `index` (if needed)
- Class extends `BaseModel` (imported from `../../base.model`)
- `@modelOptions({ schemaOptions: { collection: CollectionNames.MY_MODULE } })`
- **Unique indexes** must use `partialFilterExpression: { is_deleted: false }` (sparse unique — avoids conflicts on soft-deleted docs)
- Compound indexes use `@index({ field1: 1, field2: 1 }, { name: 'compound', background: true, partialFilterExpression: ... })`
- String fields that must be trimmed: `@prop({ required: true, trim: true })`
- ObjectId references: `@prop({ required: true, type: Types.ObjectId })`
- Optional fields: `@prop({ type: Types.ObjectId })` (no `required`)
- Enum fields: `@prop({ enum: MyEnum, required: true })`
- Nested object fields: `@prop({ type: () => NestedClass, _id: false })`
- Array fields: `@prop({ default: [], type: () => [NestedClass], _id: false })`
- Always export the model instance at the end: `export const MyModuleModel = getModelForClass(MyModule);`
- Enums defined in the model file are also exported from here

**BaseModel fields (inherited — do NOT re-declare):**
`is_deleted`, `created_by`, `updated_by`, `deleted_by`, `deleted_at`, `created_at`, `updated_at`

**Template:**
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

---

### 5.2 Error (`*.error.ts`)

**Path:** `src/common/db/models/{domain}/{module-name}/{module-name}.error.ts`

**Rules:**
- Class extends `CommonException`
- Uses `ErrorCodes.MY_MODULE + N` where N starts from 0
  - `+0` = NotFound (used as constructor arg in `super(Model, ErrorCodes.MY_MODULE, ...)`)
  - `+1` = AlreadyExists (duplicate key)
  - `+2`, `+3`, ... = domain-specific errors
- Every method is `static` and returns `new CommonException(code, data?)`
- Error messages are NOT put here — they live in `i18n/{lang}/translation.json` under key `ERROR.{code}`

**Template:**
```typescript
import { CommonException, ErrorCodes } from 'src/common/filter/common.error';

export class MyModuleError extends CommonException {
    static NotFound(data?: any) {
        return new CommonException(ErrorCodes.MY_MODULE, data);
    }

    static AlreadyExists(data?: any) {
        return new CommonException(ErrorCodes.MY_MODULE + 1, data);
    }

    static CannotDelete(data?: any) {
        return new CommonException(ErrorCodes.MY_MODULE + 2, data);
    }
}
```

---

### 5.3 Service (`*.service.ts`)

**Path:** `src/common/service/{domain}/{module-name}/{module-name}.service.ts`

**Rules:**
- `@Injectable({})` decorator (with empty object)
- Extends `CommonService<ModelClass>`
- Constructor: `super(MyModuleModel, ErrorCodes.MY_MODULE, ErrorCodes.MY_MODULE + 1)`
  - First arg = Typegoose model instance
  - Second arg = not-found error code
  - Third arg = already-exists error code
- **Always export a singleton** at the bottom: `export const myModuleService = new MyModuleService();`
  - This singleton is used by assistants and other services that cannot inject via DI
  - The class itself is also used as an Injectable provider in module files
- Private `$lookup*` and `$unwind*` MongoDB aggregate pipeline stages as class fields
- Private `makeQuery(dto)` method to build the Mongoose filter from a DTO
- `getPaging(dto)` — returns paginated results using `this.findPaging(query, dto, pipeline?)`
- `getChoose(dto)` — same as getPaging but used for dropdowns (can have different pipeline)
- Use `this.Filter` as the type for query objects: `const query: typeof this.Filter = {}`
- **DTO import**: import the admin DTO from `src/modules/admin/...` (not mobile)
- Use `this.aggregate([...pipeline])` for complex queries (it auto-adds `is_deleted: false` and `__v: 0` projection)
- Use `this.find(query)`, `this.findOne(query)`, `this.findById(id)` for simple lookups

**Template:**
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

---

### 5.4 DTO (`*.dto.ts`)

**Path:** `src/modules/admin/{domain}/{module-name}/{module-name}.dto.ts`  
**Path (mobile):** `src/modules/mobile/{domain}/{module-name}/{module-name}.dto.ts`

**Rules:**
- **Create DTO** extends `BaseDto` (for `created_by`, `updated_by`, etc.)
- **Get/Paging DTO** extends `PagingDto` (includes `page`, `limit`, `search`, `date_from`, `date_to`, `sort_by`, `asc`)
- **Update DTO** = `IntersectionType(BaseIdDto, PartialType(CreateDto))` — always use NestJS utility types
- All fields shown in Swagger: `@ApiProperty({ type: String, example: DOC_ID })`
- Required ObjectId: `@IsMongoIdCustom()` — this also auto-transforms string → `Types.ObjectId`
- Optional ObjectId: `@IsMongoIdCustom()` + `@IsOptional()`
- Required string: `@IsString()`
- Optional string: `@IsString()` + `@IsOptional()`
- Required number: `@IsNumber({ allowInfinity: false, allowNaN: false })` or `@IsInt()`
- Positive number: `@IsPositive()`
- Enum: `@IsEnum(MyEnum)`
- Date: `@IsDateCustom()` (from `src/common/validation/custom/IsDate`)
- Array: `@IsArray()` + `@IsString({ each: true })`
- Nested object: `@Type(() => NestedDto)` + `@ValidateNested({ each: true })`
- Server-set fields (NOT from client): declare without decorators, just `fieldName: Type`
  - Examples: `number: string`, `organization_id: Types.ObjectId`, `state: SomeEnum`
- `BaseDto` fields (inherited — do NOT re-declare): `created_by`, `updated_by`, `deleted_by`, `created_at`, `updated_at`

**Template:**
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

    // server-set — not validated from request body
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

---

### 5.5 Controller (`*.controller.ts`)

**Path:** `src/modules/admin/{domain}/{module-name}/{module-name}.controller.ts`

**Rules:**
- `@ApiTags('My Module')` — human-readable Swagger tag
- `@Controller('my-module')` — kebab-case URL prefix (usually singular resource name)
- `@ApiBearerAuth()` at class level
- `@UseGuards(AuthAdminGuard)` at class level (admin) OR `@UseGuards(AuthEmployeeGuard)` (mobile)
- Constructor injects: `MyModuleService`, `I18nService` (if export endpoint exists)
- Inject other services needed for validation/lookup (they must be in the module's `providers`)
- **Standard endpoint pattern:**

| Decorator | Method name | Body DTO | Description |
|---|---|---|---|
| `@Post('create')` | `create` | `MyModuleDto` | Create document |
| `@Post('paging')` | `get` | `MyModuleGetDto` | Paginated list |
| `@Post('export')` | `export` | `MyModuleGetDto` | Excel export |
| `@Post('choose')` | `getChoose` | `MyModuleGetDto` | Dropdown list |
| `@Get('get-by-id/:_id')` | `getById` | `@Param() BaseIdDto` | Single by ID |
| `@Put('update')` | `update` | `MyModuleUpdateDto` | Update document |
| `@Delete('delete')` | `delete` | `BaseIdDto` | Soft delete |

- Every endpoint: `@Req() request: CustomRequest` for user info
- Set `dto.created_by = request.user._id` before creating
- Set `dto.updated_by = request.user._id` before updating
- For `export`: set `dto.page = 1; dto.limit = Number.MAX_SAFE_INTEGER;` before calling `getPaging`
- For `delete`: check if document is referenced by another collection first; if so, throw `MyModuleError.CannotDelete()`
- For delete with guard at class level: `return await this.myModuleService.deleteOne(dto._id, request.user._id);`

**Template:**
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

---

### 5.6 Module (`*.module.ts`)

**Path:** `src/modules/admin/{domain}/{module-name}/{module-name}.module.ts`

**Rules:**
- `imports`: **Always include** `JwtModule.register({})` and `EmployeeModule` — required for `AuthAdminGuard`
- Add any other module whose service is injected in this controller
- `controllers`: only this module's controller
- `providers`: this module's service + `I18nService` (if export used) + any other services injected in controller
- `exports`: export the service if other modules will import it
- Mobile module class name: `{ModuleName}MobileModule`
- Mobile module imports `EmployeeMobileModule` instead of `EmployeeModule`

**Template (admin):**
```typescript
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MyModuleService } from 'src/common/service/{domain}/{module-name}/{module-name}.service';
import { I18nService } from 'src/modules/common/modules/i18n/i18n.service';
import { EmployeeModule } from '../employee/employee.module';
import { MyModuleAdminController } from './my-module.controller';

@Module({
    imports: [JwtModule.register({}), EmployeeModule],
    controllers: [MyModuleAdminController],
    providers: [MyModuleService, I18nService],
    exports: [MyModuleService],
})
export class MyModuleModule {}
```

**Template (mobile):**
```typescript
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MyModuleService } from 'src/common/service/{domain}/{module-name}/{module-name}.service';
import { EmployeeMobileModule } from '../../employee/employee.module';
import { MyModuleController } from './my-module.controller';

@Module({
    imports: [JwtModule.register({}), EmployeeMobileModule],
    controllers: [MyModuleController],
    providers: [MyModuleService],
})
export class MyModuleMobileModule {}
```

---

### 5.7 Assistant (`*.assistant.ts`)

**Path:** `src/assistant/{name}.assistant.ts`

**Rules:**
- Plain TypeScript class — NOT `@Injectable()`, NOT NestJS-managed
- Uses imported service singletons directly (e.g., `import { myModuleService } from '...'`)
- Handles complex multi-step business logic that spans multiple services
- Always export a singleton at the bottom: `export const myAssistant = new MyAssistant();`
- Used by controllers: `import { myAssistant } from 'src/assistant/my.assistant';`
- Used inside `withTransaction` when sessions are needed

---

## 6. Shared Registry Files (Always Update These)

Every new module **must** touch these files:

### `src/common/constant/collections.ts`
```typescript
export enum CollectionNames {
  // ... existing
  MY_MODULE = 'myModules',  // add here
}
```

### `src/common/filter/common.error.ts`
```typescript
export enum ErrorCodes {
  // ... existing
  MY_MODULE = 12100,  // add here, use next block of 100
}
```

### `src/modules/admin/admin-app.module.ts`
```typescript
import { MyModuleModule } from './my-domain/my-module/my-module.module';

const modules = [
    // ... existing
    MyModuleModule,  // add here
];
```

### `src/modules/mobile/mobile.app.module.ts` (if mobile needed)
```typescript
import { MyModuleMobileModule } from './my-domain/my-module/my-module.module';

const modules = [
    // ... existing
    MyModuleMobileModule,  // add here
];
```

### `src/common/types/table.type.ts` (if export needed)
```typescript
export enum PageNames {
  // ... existing
  MY_MODULE = 'my_module',  // add here
}
```

### `src/common/utils/page-columns.util.ts` (if export needed)
```typescript
case PageNames.MY_MODULE:
    columns = [
        { key: 'name', type: TableColumnType.STRING, translation_key: 'NAME' },
        // ... more columns
    ];
    break;
```

### `src/i18n/uz/translation.json`, `ru/`, `en/`
```json
{
  "my_modules": "Mening modullarim",
  "ERROR": {
    "12100": "Modul topilmadi",
    "12101": "Bu modul allaqachon mavjud",
    "12102": "Bu modulni o'chirib bo'lmaydi"
  }
}
```

---

## 7. Naming Conventions

| Item | Convention | Example |
|---|---|---|
| File names | `kebab-case.type.ts` | `unit-of-measure.model.ts` |
| Folder names | `kebab-case` | `unit-of-measure/` |
| Class names | `PascalCase` | `UnitOfMeasure` |
| Model class | same as entity | `UnitOfMeasure` |
| Model instance export | `{Class}Model` | `UnitOfMeasureModel` |
| Service class | `{Entity}Service` | `UnitOfMeasureService` |
| Service singleton export | `{camelCase}Service` | `unitOfMeasureService` |
| Error class | `{Entity}Error` | `UnitOfMeasureError` |
| Admin controller | `{Entity}AdminController` | `UnitOfMeasureAdminController` |
| Mobile controller | `{Entity}Controller` | `UnitOfMeasureController` |
| Admin module | `{Entity}Module` | `UnitOfMeasureModule` |
| Mobile module | `{Entity}MobileModule` | `UnitOfMeasureMobileModule` |
| DTO — create | `{Entity}Dto` | `UnitOfMeasureDto` |
| DTO — get/paging | `{Entity}GetDto` | `UnitOfMeasureGetDto` |
| DTO — update | `{Entity}UpdateDto` | `UnitOfMeasureUpdateDto` |
| Collection name | `camelCase plural` | `unitsOfMeasure` |
| MongoDB index name | `snake_case` | `phone_number`, `compound` |
| DB field names | `snake_case` | `unit_of_measure.decimal_count` |
| TS property names | `snake_case` | `decimal_count: number` |
| Env keys | `UPPER_SNAKE_CASE` | `ADMIN_PORT` |

---

## 8. CommonService API Reference

All services extend `CommonService<T>`. Available methods:

| Method | Visibility | Description |
|---|---|---|
| `findById(id, options?)` | `public` | Find by `_id`, throws `NotFound` if missing or deleted |
| `findOne(query, options?)` | `public` | Find one matching document (with `is_deleted: false`) |
| `find(query, options?)` | `protected` | Find all matching documents |
| `create(data, options?)` | `public` | Insert one document, returns the saved doc |
| `insertMany(data[], options?)` | `public` | Insert multiple documents |
| `updateOne(id, data, options?)` | `public` | `findByIdAndUpdate` with `{ new: true }` |
| `updateOneByQuery(query, data, options?)` | `protected` | `findOneAndUpdate` by query |
| `updateMany(query, data, options?)` | `protected` | Update all matching |
| `deleteOne(id, deleted_by, options?)` | `public` | Soft delete (sets `is_deleted: true`) |
| `deleteMany(query, deleted_by, options?)` | `protected` | Soft delete multiple |
| `count(query, options?)` | `protected` | Count non-deleted documents |
| `countWithPipeline(pipeline, session?)` | `protected` | Count using aggregate pipeline |
| `findPaging(query, dto, pipeline?, sort?)` | `protected` | Returns `{ total, data }` with pagination |
| `aggregate(pipeline, options?)` | `protected` | Run aggregate, auto-adds `is_deleted: false` |
| `withTransaction(callback, retry?)` | `public` | Runs callback in a MongoDB session with retry on WriteConflict |
| `getDeletedIds(deleted_at)` | `public` | Get IDs soft-deleted after a given date |

**`findPaging` behavior:**
- Default sort: `{ _id: -1 }` (newest first)
- Custom sort: pass 4th argument, e.g., `{ created_at: -1 }`
- `additional_pipeline` is appended after `$match, $sort, $skip, $limit, $project`
- The `$project` stage excludes `__v`
- `dto` must have `page` (min 1) and `limit` (min 1, max 500)

---

## 9. Request / Response Contract

### Success Response (wrapped by `TransformInterceptor`)
```json
{
  "statusCode": 200,
  "code": 0,
  "message": "ok",
  "data": { ... },
  "time": "2026-01-01T00:00:00.000Z"
}
```

### Error Response (from `AllExceptionFilter`)
```json
{
  "statusCode": 400,
  "code": 12100,
  "message": "Modul topilmadi",
  "data": "64ebf64c2a561faf4ea0641a",
  "time": "2026-01-01T00:00:00.000Z",
  "path": "/v1/my-module/get-by-id/64ebf64c2a561faf4ea0641a"
}
```

### Paging Response shape (from `findPaging`)
```json
{
  "statusCode": 200,
  "code": 0,
  "data": {
    "total": 42,
    "data": [ {...}, {...} ]
  }
}
```

### Language handling
- Client sends `Accept-Language: uz` (or `ru` / `en`) header
- `LoggerMiddleware` reads it and sets `req.lang`
- Default language: `uz`
- Used in export file name and error messages

---

## 10. Guards & Authentication

### `AuthAdminGuard`
- Verifies JWT from `Authorization: Bearer <token>` header
- Loads employee from DB using phone from JWT payload
- Throws `UnauthorizedException` if `employee.type !== EmployeeType.ADMIN`
- Sets `request.user = employee`

### `AuthEmployeeGuard`
- Same as above but checks `employee.type !== EmployeeType.EMPLOYEE`

### Module requirements for guard to work
```typescript
// Both guards need JwtService + EmployeeService + ConfigService
// Satisfy this by importing:
imports: [JwtModule.register({}), EmployeeModule]  // admin
imports: [JwtModule.register({}), EmployeeMobileModule]  // mobile
```

### Login token payload shape
```typescript
{ phone_number: string, type: EmployeeType }
```

---

## 11. i18n & Translations

### Key structure in translation files
```json
{
  "my_modules": "Collection label for export",
  "COLUMN_KEY": "Column header label",
  "ERROR": {
    "12100": "Not found message",
    "12101": "Already exists message",
    "12102": "Cannot delete message"
  }
}
```

### Using i18n in controllers
```typescript
// Inject in constructor:
private i18nService: I18nService

// Usage:
this.i18nService.translate('my_modules', { lang: request.lang })
// → looks up translation.my_modules in the current language
```

### i18n in error filter
- `AllExceptionFilter` auto-translates errors using code
- Key format: `translation.ERROR.{error_code}`
- Must be added to all three language files

---

## 12. Export Feature

To add Excel export to a module:

1. Add to `PageNames` enum in `table.type.ts`
2. Add a `case` to `getPageColumns()` in `page-columns.util.ts`
3. Add translation keys for column headers in all `translation.json` files
4. In controller:
```typescript
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
```

### Column types (`TableColumnType`)
| Type | Description |
|---|---|
| `STRING` | Plain text |
| `NUMBER` | Formatted with thousand separators |
| `BOOLEAN` | Shows `+` if true |
| `DATE` | Formatted with `date_format` (default `DD.MM.YYYY`) |
| `ENUM` | Translated using `enum_values[value].translation_key` |
| `CURRENCY` | Formatted with currency symbol, reads from `currency_field` |
| `EXTRA` | Custom string appended |
| `ARRAY` | Array field |

---

## 13. Soft Delete Pattern

**There is NO hard delete anywhere in this codebase.**

- `deleteOne(id, deleted_by)` sets: `is_deleted: true`, `deleted_at: new Date()`, `deleted_by`
- All queries from `CommonService` automatically filter `is_deleted: false`
- All unique indexes use `partialFilterExpression: { is_deleted: false }` so deleted docs don't block uniqueness
- Before deleting, always check if the document is referenced in other collections:
```typescript
@Delete('delete')
async delete(@Body() dto: BaseIdDto, @Req() request: CustomRequest) {
    const item = await this.myModuleService.findById(dto._id);
    const dependent = await otherService.findOne({ my_module_id: item._id });
    if (dependent) throw MyModuleError.CannotDelete(item._id);
    return await this.myModuleService.deleteOne(dto._id, request.user._id);
}
```

---

## 14. Transaction (MongoDB Session) Pattern

Use `withTransaction` for any operation that writes to multiple collections:

```typescript
// In controller:
const result = await this.myModuleService.withTransaction(async (session) => {
    const doc = await this.myModuleService.create(dto, { session });
    await otherService.updateOne(otherId, { $inc: { count: 1 } }, { session });
    return doc;
});
```

- Automatically retries on `WriteConflict` (code 112)
- Always pass `{ session }` to every DB operation inside the callback
- Return value of callback becomes the return value of `withTransaction`

---

## 15. Counter / Auto-Number Pattern

For documents that need a sequential human-readable number:

```typescript
import { CounterType } from 'src/common/db/models/counter/counter.model';
import { counterService } from 'src/common/service/counter/counter.service';

// Inside withTransaction:
const number = await counterService.getLast(CounterType.TRANSACTION, { session });
dto.number = number; // e.g. "0042"
```

- Counter values are zero-padded to 4 digits
- Available types: `TRANSACTION`, `RECONCILIATION_ACT`, `PURCHASE`, `INVOICE`, `WRITE_OFF`
- To add a new counter type: add to `CounterType` enum and `Counter` model

---

## 16. Complete Worked Example

**Scenario:** Add a `Category` module under `settings` domain.  
Fields: `name` (string, required, unique), `color` (string, optional)  
Admin only. Has create/paging/choose/get-by-id/update/delete + export.

---

**Step 1** — `src/common/constant/collections.ts`
```typescript
CATEGORY = 'categories',
```

**Step 2** — `src/common/filter/common.error.ts`
```typescript
CATEGORY = 12200,
```

**Step 3** — `src/common/db/models/settings/category/category.model.ts`
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

**Step 4** — `src/common/db/models/settings/category/category.error.ts`
```typescript
import { CommonException, ErrorCodes } from 'src/common/filter/common.error';

export class CategoryError extends CommonException {
    static NotFound(data?: any) { return new CommonException(ErrorCodes.CATEGORY, data); }
    static AlreadyExists(data?: any) { return new CommonException(ErrorCodes.CATEGORY + 1, data); }
    static CannotDelete(data?: any) { return new CommonException(ErrorCodes.CATEGORY + 2, data); }
}
```

**Step 5** — `src/common/service/settings/category/category.service.ts`
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

**Step 6** — `src/modules/admin/settings/category/category.dto.ts`
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

**Step 7** — `src/modules/admin/settings/category/category.controller.ts`
```typescript
import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { exportAssistant } from 'src/assistant/export.assistant';
import { CategoryError } from 'src/common/db/models/settings/category/category.error';
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

**Step 8** — `src/modules/admin/settings/category/category.module.ts`
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

**Step 9** — `src/modules/admin/admin-app.module.ts`  
Add `import { CategoryModule } from './settings/category/category.module';` and `CategoryModule` to the `modules` array.

**Step 10** — `src/common/types/table.type.ts`
```typescript
CATEGORY = 'category',
```

**Step 11** — `src/common/utils/page-columns.util.ts`
```typescript
case PageNames.CATEGORY:
    columns = [
        { key: 'name', type: TableColumnType.STRING, translation_key: 'NAME' },
        { key: 'color', type: TableColumnType.STRING, translation_key: 'COLOR' },
    ];
    break;
```

**Step 12** — `src/i18n/uz/translation.json` (and ru, en):
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

---

## Quick Reference: File Checklist for Any New Module

```
[ ] src/common/constant/collections.ts            — add CollectionNames entry
[ ] src/common/filter/common.error.ts             — add ErrorCodes entry
[ ] src/common/db/models/{domain}/{name}/{name}.model.ts
[ ] src/common/db/models/{domain}/{name}/{name}.error.ts
[ ] src/common/service/{domain}/{name}/{name}.service.ts
[ ] src/modules/admin/{domain}/{name}/{name}.dto.ts
[ ] src/modules/admin/{domain}/{name}/{name}.controller.ts
[ ] src/modules/admin/{domain}/{name}/{name}.module.ts
[ ] src/modules/admin/admin-app.module.ts         — import and add to modules[]
[ ] src/common/types/table.type.ts                — add PageNames entry (if export)
[ ] src/common/utils/page-columns.util.ts         — add column definitions (if export)
[ ] src/i18n/uz/translation.json                  — add keys
[ ] src/i18n/ru/translation.json                  — add keys
[ ] src/i18n/en/translation.json                  — add keys
--- (if mobile needed) ---
[ ] src/modules/mobile/{domain}/{name}/{name}.dto.ts
[ ] src/modules/mobile/{domain}/{name}/{name}.controller.ts
[ ] src/modules/mobile/{domain}/{name}/{name}.module.ts
[ ] src/modules/mobile/mobile.app.module.ts       — import and add to modules[]
```
