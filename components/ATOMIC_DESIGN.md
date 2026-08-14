# Atomic Design Structure

This project follows the **Atomic Design** methodology to organize components into predictable and scalable categories.

## Directory Structure

```
components/
├── atoms/              # Basic, single-purpose components
│   ├── buttons/        # Button variants
│   ├── icons/          # Icon components
│   ├── inputs/         # Input elements
│   ├── badges/         # Badge components
│   └── loaders/        # Loading and error states
├── molecules/          # Combination of atoms
│   ├── cards/          # Card components
│   ├── forms/          # Form components
│   ├── navigation/     # Navigation components
│   └── dialogs/        # Dialog and modal components
├── organisms/          # Complex sections
│   ├── header/         # Header components
│   ├── footer/         # Footer components
│   ├── sidebar/        # Sidebar components
│   └── sections/       # Page sections (features, pricing, etc.)
├── templates/          # Page templates and layouts
├── providers/          # Context providers and wrappers
├── ui/                 # Shadcn UI components
└── skeletons/          # Loading skeleton components
```

## Guidelines

### Atoms
Smallest building blocks. Examples: buttons, inputs, icons, badges.
- Single responsibility
- Highly reusable
- No dependencies on other custom components

### Molecules
Groups of atoms bonded together. Examples: forms, cards, navigation items.
- Combination of atoms
- Still relatively simple
- Can depend on atoms

### Organisms
Complex sections combining molecules and atoms. Examples: headers, sidebars, sections.
- More complex functionality
- Can depend on molecules and atoms
- May handle state management

### Templates
Page layouts and complex page structures.
- Combine organisms and molecules
- No visual design (mostly layout)
- Wire up data flow

### Providers
Context providers, wrappers, and global configurations.
- Theme providers
- Analytics providers
- Global state

## Importing Components

### Using index files for cleaner imports

```typescript
import { Logo, ThemeToggle } from '@/components/atoms';
import { LoginForm, NavMain } from '@/components/molecules';
import { Header, Footer } from '@/components/organisms';
import { DashboardContent } from '@/components/templates';
```

### Direct imports

```typescript
import { Logo } from '@/components/atoms/icons/logo';
import { LoginForm } from '@/components/molecules/forms/login-form';
```

## Best Practices

1. **Keep atoms simple** - Single responsibility principle
2. **Build up the hierarchy** - Use lower-level components to build higher ones
3. **Use index files** - Export components from index.ts for cleaner imports
4. **Component naming** - Use PascalCase for component names
5. **Organize by feature** - Group related molecules/organisms together
