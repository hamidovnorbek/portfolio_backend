# Module Rules (`*.module.ts`)

**Path:** `src/modules/admin/{domain}/{module-name}/{module-name}.module.ts`

## Rules

- `imports`: **Always include** `JwtModule.register({})` and `EmployeeModule` -- required for `AuthAdminGuard`
- Add any other module whose service is injected in this controller
- `controllers`: only this module's controller
- `providers`: this module's service + `I18nService` (if export used) + any other services injected in controller
- `exports`: export the service if other modules will import it
- Mobile module class name: `{ModuleName}MobileModule`
- Mobile module imports `EmployeeMobileModule` instead of `EmployeeModule`

## Template (Admin)

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

## Template (Mobile)

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
