# Patterns & Cross-Cutting Concerns

## Soft Delete Pattern

**There is NO hard delete anywhere in this codebase.**

- `deleteOne(id, deleted_by)` sets: `is_deleted: true`, `deleted_at: new Date()`, `deleted_by`
- All queries from `CommonService` automatically filter `is_deleted: false`
- All unique indexes use `partialFilterExpression: { is_deleted: false }` so deleted docs don't block uniqueness
- Before deleting, always check if the document is referenced in other collections

```typescript
@Delete('delete')
async delete(@Body() dto: BaseIdDto, @Req() request: CustomRequest) {
    const item = await this.myModuleService.findById(dto._id);
    const dependent = await otherService.findOne({ my_module_id: item._id });
    if (dependent) throw MyModuleError.CannotDelete(item._id);
    return await this.myModuleService.deleteOne(dto._id, request.user._id);
}
```

## Transaction (MongoDB Session) Pattern

Use `withTransaction` for any operation that writes to multiple collections:

```typescript
const result = await this.myModuleService.withTransaction(async (session) => {
    const doc = await this.myModuleService.create(dto, { session });
    await otherService.updateOne(otherId, { $inc: { count: 1 } }, { session });
    return doc;
});
```

- Automatically retries on `WriteConflict` (code 112)
- Always pass `{ session }` to every DB operation inside the callback

## Counter / Auto-Number Pattern

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

## Guards & Authentication

### AuthAdminGuard
- Verifies JWT from `Authorization: Bearer <token>` header
- Loads employee from DB, checks `employee.type === EmployeeType.ADMIN`
- Sets `request.user = employee`

### AuthEmployeeGuard
- Same but checks `employee.type === EmployeeType.EMPLOYEE`

### Module requirements for guards
```typescript
imports: [JwtModule.register({}), EmployeeModule]        // admin
imports: [JwtModule.register({}), EmployeeMobileModule]   // mobile
```

### Login token payload
```typescript
{ phone_number: string, type: EmployeeType }
```

## i18n & Translations

### Key structure
```json
{
  "my_modules": "Collection label for export",
  "COLUMN_KEY": "Column header label",
  "ERROR": {
    "12100": "Not found message",
    "12101": "Already exists message"
  }
}
```

### Usage in controllers
```typescript
this.i18nService.translate('my_modules', { lang: request.lang })
```

- `AllExceptionFilter` auto-translates errors using key `translation.ERROR.{error_code}`
- Must add keys to all three language files (`uz`, `ru`, `en`)
- Default language: `uz`

## Request / Response Contract

### Success Response (wrapped by `TransformInterceptor`)
```json
{ "statusCode": 200, "code": 0, "message": "ok", "data": { ... }, "time": "..." }
```

### Error Response (from `AllExceptionFilter`)
```json
{ "statusCode": 400, "code": 12100, "message": "Modul topilmadi", "data": "...", "time": "...", "path": "..." }
```

### Paging Response
```json
{ "statusCode": 200, "code": 0, "data": { "total": 42, "data": [{...}] } }
```

## Export Feature

To add Excel export to a module:

1. Add to `PageNames` enum in `table.type.ts`
2. Add a `case` to `getPageColumns()` in `page-columns.util.ts`
3. Add translation keys for column headers
4. In controller use `exportAssistant.excel(PageNames.X, data, label, i18nService, lang)`

### Column types (`TableColumnType`)

| Type | Description |
|---|---|
| `STRING` | Plain text |
| `NUMBER` | Formatted with thousand separators |
| `BOOLEAN` | Shows `+` if true |
| `DATE` | Formatted (default `DD.MM.YYYY`) |
| `ENUM` | Translated via `enum_values[value].translation_key` |
| `CURRENCY` | With currency symbol from `currency_field` |
| `EXTRA` | Custom string appended |
| `ARRAY` | Array field |
