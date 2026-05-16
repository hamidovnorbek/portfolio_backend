# Shared Registry Files (Always Update These)

Every new module **must** touch these files:

## Required for every module

### `src/common/constant/collections.ts`
Add a new entry to the `CollectionNames` enum:
```typescript
MY_MODULE = 'myModules',  // camelCase plural MongoDB collection name
```

### `src/common/filter/common.error.ts`
Add a new entry to the `ErrorCodes` enum (spaced 100 apart):
```typescript
MY_MODULE = 12100,  // use next available block of 100
```

### `src/modules/admin/admin-app.module.ts`
Import and add to `modules` array:
```typescript
import { MyModuleModule } from './my-domain/my-module/my-module.module';
const modules = [..., MyModuleModule];
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

## Required if module has export

### `src/common/types/table.type.ts`
```typescript
export enum PageNames { MY_MODULE = 'my_module' }
```

### `src/common/utils/page-columns.util.ts`
```typescript
case PageNames.MY_MODULE:
    columns = [
        { key: 'name', type: TableColumnType.STRING, translation_key: 'NAME' },
    ];
    break;
```

## Required if module has mobile

### `src/modules/mobile/mobile.app.module.ts`
Import and add to `modules` array:
```typescript
import { MyModuleMobileModule } from './my-domain/my-module/my-module.module';
const modules = [..., MyModuleMobileModule];
```

## Quick Checklist

```
[ ] src/common/constant/collections.ts            -- add CollectionNames entry
[ ] src/common/filter/common.error.ts             -- add ErrorCodes entry
[ ] src/common/db/models/{domain}/{name}/{name}.model.ts
[ ] src/common/db/models/{domain}/{name}/{name}.error.ts
[ ] src/common/service/{domain}/{name}/{name}.service.ts
[ ] src/modules/admin/{domain}/{name}/{name}.dto.ts
[ ] src/modules/admin/{domain}/{name}/{name}.controller.ts
[ ] src/modules/admin/{domain}/{name}/{name}.module.ts
[ ] src/modules/admin/admin-app.module.ts         -- import and add to modules[]
[ ] src/common/types/table.type.ts                -- add PageNames entry (if export)
[ ] src/common/utils/page-columns.util.ts         -- add column definitions (if export)
[ ] src/i18n/uz/translation.json                  -- add keys
[ ] src/i18n/ru/translation.json                  -- add keys
[ ] src/i18n/en/translation.json                  -- add keys
--- (if mobile needed) ---
[ ] src/modules/mobile/{domain}/{name}/{name}.dto.ts
[ ] src/modules/mobile/{domain}/{name}/{name}.controller.ts
[ ] src/modules/mobile/{domain}/{name}/{name}.module.ts
[ ] src/modules/mobile/mobile.app.module.ts       -- import and add to modules[]
```
