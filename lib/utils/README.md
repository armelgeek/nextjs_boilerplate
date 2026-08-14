# Utility Functions

This directory contains organized utility functions grouped by category for easy access and maintenance.

## Structure

### `common.ts` - Common Utilities
- `cn()` - Merge Tailwind classes with clsx and twMerge
- `formatDate()` - Format date/time in human-readable format
- `formatTime()` - Format time only
- `formatDateOnly()` - Format date without time
- `delay()` - Promise-based delay
- `debounce()` - Debounce function calls

### `string.ts` - String Utilities
- `capitalize()` - Capitalize first letter
- `slugify()` - Convert to URL-safe slug
- `truncate()` - Truncate text with ellipsis
- `toTitleCase()` - Convert to title case
- `camelToKebab()` - Convert camelCase to kebab-case
- `kebabToCamel()` - Convert kebab-case to camelCase
- `removeSpecialChars()` - Strip special characters
- `generateSlug()` - Generate URL-safe slug
- `extractEmails()` - Extract email addresses from text

### `array.ts` - Array Utilities
- `unique()` - Remove duplicates
- `uniqueBy()` - Remove duplicates by key
- `groupBy()` - Group array items by key
- `chunk()` - Split array into chunks
- `flatten()` - Flatten nested arrays
- `compact()` - Remove null/undefined values
- `difference()` - Get difference between arrays
- `intersection()` - Get common items between arrays
- `shuffle()` - Randomly shuffle array
- `last()` - Get last element
- `first()` - Get first element

### `object.ts` - Object Utilities
- `deepClone()` - Deep clone objects
- `merge()` - Deep merge objects
- `pick()` - Pick specific keys
- `omit()` - Exclude specific keys
- `isEmpty()` - Check if empty
- `isPlainObject()` - Check if plain object
- `mapValues()` - Map over object values

### `number.ts` - Number Utilities
- `clamp()` - Clamp value between min/max
- `round()` - Round to decimal places
- `formatCurrency()` - Format as currency
- `formatNumber()` - Format number with commas
- `percentage()` - Calculate percentage
- `isEven()` - Check if even
- `isOdd()` - Check if odd
- `isPrime()` - Check if prime number
- `sum()` - Sum array of numbers
- `average()` - Calculate average
- `min()` - Get minimum value
- `max()` - Get maximum value
- `randomInt()` - Generate random integer

## Usage

### Import All Utils
```typescript
import * as utils from '@/lib/utils';

utils.capitalize('hello'); // 'Hello'
utils.formatDate(new Date()); // 'Aug 14, 2026, 08:30 AM'
```

### Import Specific Functions
```typescript
import { capitalize, formatDate, groupBy } from '@/lib/utils';

capitalize('hello'); // 'Hello'
groupBy([1, 2, 3], x => x % 2); // { 0: [2], 1: [1, 3] }
```

### Import from Category
```typescript
import { sum, average, randomInt } from '@/lib/utils/number';

sum([1, 2, 3]); // 6
average([1, 2, 3]); // 2
randomInt(1, 10); // Random number between 1-10
```

## Best Practices

1. **Use category imports for specificity** - Avoid namespace pollution
2. **Keep functions pure** - No side effects when possible
3. **Add TypeScript types** - Always type parameters and returns
4. **Document edge cases** - Handle null/undefined gracefully
5. **Test thoroughly** - Utility functions are used everywhere

## Adding New Utilities

1. Add function to appropriate category file
2. Export from category `index.ts`
3. Update this README with documentation
4. Add JSDoc comments for IDE autocomplete

Example:
```typescript
// lib/utils/number.ts
/**
 * Calculate GCD of two numbers
 * @param a First number
 * @param b Second number
 * @returns Greatest common divisor
 */
export function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}
```
