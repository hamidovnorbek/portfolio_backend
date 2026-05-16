# Assistant Rules (`*.assistant.ts`)

**Path:** `src/assistant/{name}.assistant.ts`

## Rules

- Plain TypeScript class -- NOT `@Injectable()`, NOT NestJS-managed
- Uses imported service singletons directly (e.g., `import { myModuleService } from '...'`)
- Handles complex multi-step business logic that spans multiple services
- Always export a singleton at the bottom: `export const myAssistant = new MyAssistant();`
- Used by controllers: `import { myAssistant } from 'src/assistant/my.assistant';`
- Used inside `withTransaction` when sessions are needed
