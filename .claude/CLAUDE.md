# Backend Template Project

NestJS 10 + MongoDB (Mongoose 7 + Typegoose 11) backend with two-app architecture (Admin + Mobile).

## Architecture Overview

- **Two apps** in one process: Admin (`AdminAppModule`, `AuthAdminGuard`, `ADMIN_PORT`) and Mobile (`MobileAppModule`, `AuthEmployeeGuard`, `MOBILE_PORT`)
- Both apps share models, services, and errors from `src/common/`
- Each app has its own controllers, DTOs, and modules under `src/modules/admin/` and `src/modules/mobile/`
- Domains: `settings`, `finance`, `supply`, `warehouse`, `employee`

## Key Conventions

- **No hard deletes** -- all deletes are soft (`is_deleted: true`)
- All unique indexes must use `partialFilterExpression: { is_deleted: false }`
- Properties use `snake_case`, files use `kebab-case`, classes use `PascalCase`
- Services always export a singleton at the bottom of the file
- Error codes are spaced 100 apart per module
- Translation keys must be added to all three languages: `uz`, `ru`, `en`

## Adding a New Module

Follow the 12-step checklist in exact order. See `.claude/rules/` for detailed rules per file type:

1. Register collection name in `src/common/constant/collections.ts`
2. Register error code in `src/common/filter/common.error.ts`
3. Create model at `src/common/db/models/{domain}/{name}/{name}.model.ts`
4. Create error class at `src/common/db/models/{domain}/{name}/{name}.error.ts`
5. Create service at `src/common/service/{domain}/{name}/{name}.service.ts`
6. Create admin DTO at `src/modules/admin/{domain}/{name}/{name}.dto.ts`
7. Create admin controller at `src/modules/admin/{domain}/{name}/{name}.controller.ts`
8. Create admin module at `src/modules/admin/{domain}/{name}/{name}.module.ts`
9. Register in `src/modules/admin/admin-app.module.ts`
10. Add export support (if needed) in `table.type.ts` + `page-columns.util.ts`
11. Add translation keys to `src/i18n/{uz,ru,en}/translation.json`
12. Create mobile module (if needed) under `src/modules/mobile/`

## Rule Files

Detailed rules are split into `.claude/rules/`:
- `01-architecture.md` -- Tech stack, two-app architecture, folder structure
- `02-model-rules.md` -- Typegoose model file conventions
- `03-error-rules.md` -- Error class conventions
- `04-service-rules.md` -- Service file conventions + CommonService API
- `05-dto-rules.md` -- DTO file conventions
- `06-controller-rules.md` -- Controller file conventions
- `07-module-rules.md` -- NestJS module file conventions
- `08-assistant-rules.md` -- Assistant (business logic orchestrator) conventions
- `09-naming-conventions.md` -- Full naming table
- `10-patterns.md` -- Soft delete, transactions, counters, export, i18n, guards
- `11-registry-files.md` -- Shared files that must be updated for every new module
- `12-worked-example.md` -- Complete Category module example
