# Naming Conventions

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
| DTO -- create | `{Entity}Dto` | `UnitOfMeasureDto` |
| DTO -- get/paging | `{Entity}GetDto` | `UnitOfMeasureGetDto` |
| DTO -- update | `{Entity}UpdateDto` | `UnitOfMeasureUpdateDto` |
| Collection name | `camelCase plural` | `unitsOfMeasure` |
| MongoDB index name | `snake_case` | `phone_number`, `compound` |
| DB field names | `snake_case` | `unit_of_measure.decimal_count` |
| TS property names | `snake_case` | `decimal_count: number` |
| Env keys | `UPPER_SNAKE_CASE` | `ADMIN_PORT` |
