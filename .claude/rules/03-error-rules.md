# Error Rules (`*.error.ts`)

**Path:** `src/common/db/models/{domain}/{module-name}/{module-name}.error.ts`

## Rules

- Class extends `CommonException`
- Uses `ErrorCodes.MY_MODULE + N` where N starts from 0:
  - `+0` = NotFound
  - `+1` = AlreadyExists (duplicate key)
  - `+2`, `+3`, ... = domain-specific errors
- Every method is `static` and returns `new CommonException(code, data?)`
- Error messages are NOT put here -- they live in `i18n/{lang}/translation.json` under key `ERROR.{code}`

## Template

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
