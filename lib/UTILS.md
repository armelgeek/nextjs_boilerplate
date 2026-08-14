# Utility Functions

General-purpose helper functions organized by category.

## Directory

- **utils/** - Utility functions
  - array.ts - Array manipulation (unique, flatten, chunk, etc.)
  - object.ts - Object manipulation (omit, pick, merge, etc.)
  - string.ts - String manipulation (capitalize, slug, truncate, etc.)
  - number.ts - Number manipulation (format, parse, round, etc.)
  - common.ts - Common utilities (delay, retry, etc.)
  - index.ts - Central exports

## Array Utilities

```typescript
import { unique, flatten, compact } from '@/lib/utils/array'

unique([1, 2, 2, 3])           // [1, 2, 3]
flatten([[1, 2], [3, 4]])      // [1, 2, 3, 4]
compact([1, null, 2, undefined]) // [1, 2]
```

## Object Utilities

```typescript
import { omit, pick, merge } from '@/lib/utils/object'

omit({ a: 1, b: 2, c: 3 }, ['b'])  // { a: 1, c: 3 }
pick({ a: 1, b: 2, c: 3 }, ['a'])  // { a: 1 }
merge({ a: 1 }, { b: 2 })          // { a: 1, b: 2 }
```

## String Utilities

```typescript
import { capitalize, slug, truncate } from '@/lib/utils/string'

capitalize('hello')           // 'Hello'
slug('Hello World')          // 'hello-world'
truncate('Long text', 5)     // 'Lon...'
```

## Number Utilities

```typescript
import { formatCurrency, formatNumber } from '@/lib/utils/number'

formatCurrency(1000, 'USD')  // '$1,000.00'
formatNumber(1000)           // '1,000'
```

## Common Utilities

```typescript
import { delay, retry } from '@/lib/utils/common'

await delay(1000)  // Wait 1 second
await retry(() => fetch('/api'), { attempts: 3 })
```
