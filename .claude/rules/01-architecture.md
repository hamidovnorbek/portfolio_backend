# Architecture & Tech Stack

## Tech Stack

| Layer | Library |
|---|---|
| Framework | NestJS 10 |
| Language | TypeScript |
| Database | MongoDB via Mongoose 7 + `@typegoose/typegoose` 11 |
| Auth | `@nestjs/jwt` -- Bearer token |
| Validation | `class-validator` + `class-transformer` |
| API Docs | `@nestjs/swagger` |
| i18n | `nestjs-i18n` |
| Excel Export | `exceljs` |
| Config | `dotenv` (`.env.development` / `.env.production`) |
| Process Manager | PM2 |

## Two-App Architecture

Two completely separate NestJS applications running in the same process:

| App | Module | Guard | Port env key | Swagger path |
|---|---|---|---|---|
| Admin | `AdminAppModule` | `AuthAdminGuard` | `ADMIN_PORT` | `/docs` |
| Mobile | `MobileAppModule` | `AuthEmployeeGuard` | `MOBILE_PORT` | `/docs` |

- Both apps share the same models, services, and error classes from `src/common/`
- Each app has its own controllers, DTOs, and module files under `src/modules/admin/` and `src/modules/mobile/`
- Both apps use `JwtModule.register({})` (secret resolved at runtime via `ConfigService`)
- Both apps apply: `ValidationPipe`, `AllExceptionFilter`, `TransformInterceptor`, global prefix `v1`, CORS enabled

## Folder Structure

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
│   │   ├── collections.ts           # ADD new CollectionNames enum entry here
│   │   ├── doc.constants.ts         # Swagger example constants (DOC_ID, etc.)
│   │   ├── languages.ts             # AcceptLanguages enum
│   │   └── roles.ts
│   ├── db/
│   │   ├── connect.db.ts
│   │   └── models/
│   │       ├── base.model.ts        # BaseModel with is_deleted, created_by, timestamps
│   │       ├── {domain}/{module-name}/
│   │       │   ├── {module-name}.model.ts
│   │       │   └── {module-name}.error.ts
│   │       └── counter/counter.model.ts
│   ├── filter/
│   │   ├── common.error.ts          # ADD new ErrorCodes entry here
│   │   └── http-exception.filter.ts
│   ├── interceptor/response.interceptor.ts
│   ├── middleware/logger.middleware.ts
│   ├── service/
│   │   ├── common.service.ts        # Generic base service (CRUD + aggregate + paging)
│   │   ├── with-transaction.ts
│   │   ├── counter/
│   │   └── {domain}/{module-name}/{module-name}.service.ts
│   ├── types/
│   │   ├── common.types.ts          # CustomRequest interface
│   │   └── table.type.ts            # ADD PageNames entry + Table column definitions
│   ├── utils/
│   │   ├── page-columns.util.ts     # ADD column definitions for export
│   │   └── ...
│   └── validation/
│       ├── common.dto.ts            # BaseDto, BaseIdDto, PagingDto, CommonSearchDto, DateFilterDto
│       └── custom/
│           ├── IsDate.ts
│           ├── IsGreaterDate.ts
│           └── IsMongoId.ts
├── generated/i18n.generated.ts      # Auto-generated -- do not edit
├── i18n/{uz,ru,en}/translation.json # ADD translation keys here
├── migration/migrate.ts
└── modules/
    ├── admin/
    │   ├── admin-app.module.ts      # IMPORT new admin module here
    │   └── {domain}/{module-name}/
    │       ├── {module-name}.controller.ts
    │       ├── {module-name}.dto.ts
    │       └── {module-name}.module.ts
    ├── common/
    │   ├── doc/
    │   ├── guard/auth.guard.ts      # AuthAdminGuard + AuthEmployeeGuard
    │   └── modules/{auth,i18n,upload}/
    └── mobile/
        ├── mobile.app.module.ts     # IMPORT new mobile module here
        └── {domain}/{module-name}/
            ├── {module-name}.controller.ts
            ├── {module-name}.dto.ts
            └── {module-name}.module.ts
```

Domains currently used: `settings`, `finance`, `supply`, `warehouse`, `employee`
