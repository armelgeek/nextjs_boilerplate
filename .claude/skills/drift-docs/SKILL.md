---
name: drift-docs
description: Documentation — auto-generate from code, update guides
---

# Documentation

Keep docs in sync with code.

## Usage

```
/drift-docs generate
/drift-docs "update API docs"
/drift-docs --audit
```

## Workflow

1. **Generate from code**
   - Extract JSDoc/TSDoc comments
   - Generate API reference
   - Create examples from tests

2. **Update guides**
   - Architecture docs
   - Setup instructions
   - Database schema docs
   - API endpoint documentation

3. **Audit**
   - Flag outdated docs
   - Find missing docs (exported but undocumented functions)
   - Verify examples still work

## Auto-Generated

```
/drift-docs generate --api
→ Creates API reference from JSDoc
→ Includes examples
→ Links to source code
```

## Manual Docs

Keep in sync:
- CLAUDE.md (workflow guides)
- README.md (getting started)
- docs/ (architecture, patterns)
- API docs (endpoint reference)

## Missing Docs

```
/drift-docs --audit
→ Flag functions/components without JSDoc
→ Suggest what to document
→ Show coverage %
```

## Examples

Test examples serve as living docs:
```typescript
describe('User.create()', () => {
  it('creates user with email', () => {
    // This becomes an example in the docs
  })
})
```

