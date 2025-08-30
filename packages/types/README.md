# @repo/types

This package contains shared TypeScript types for the Bastion Research monorepo. It is used by both the frontend (`apps/web`) and backend (`apps/server`) to ensure type safety and consistency across the entire application.

## Usage

To use the types from this package, import them directly from `@repo/types` in any of the applications within the monorepo.

For example:

```typescript
import { User } from '@repo/types';

const user: User = {
  id: '123',
  name: 'John Doe',
  email: 'john.doe@example.com',
};
```

## Adding New Types

To add new types, simply create a new file in the `src` directory or add them to the `index.ts` file. Make sure to export them from `index.ts` so they can be imported by other packages.
