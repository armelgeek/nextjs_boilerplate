---
name: drift-commit-validator
description: Validate commits follow conventional commits format and project conventions
---

# drift-commit-validator

Validate every commit before it's final.

## Usage

Auto-triggered before commit (via drift-guide), or:
```
/drift-commit-validator "feat(auth): add OAuth2 login"
```

## What It Checks

### Format
- ✓ Type (feat, fix, docs, refactor, test, chore, perf, ci)
- ✓ Scope (auth, api, database, ui, etc.)
- ✓ Subject (< 50 chars, imperative mood, no period)

### Security
- ✗ No API keys, passwords, secrets
- ✓ No hardcoded credentials

### Quality
- ✓ References related issue (#123)
- ✓ Body explains WHY not WHAT
- ✓ No multiple concerns mixed

## Output

```
✅ VALID COMMIT

Type: feat
Scope: auth
Subject: "Add OAuth2 login" (38 chars)
Format: ✓ Correct
Security: ✓ No secrets detected
Quality: ✓ Issue reference found (#456)

Commit ready for push.
```

Or:

```
❌ INVALID COMMIT

Issues:
1. Type missing (should be one of: feat, fix, docs, ...)
2. Subject too long: 67 chars (max 50)
3. No issue reference (add "Closes #XXX" in body)

Fix and retry.
```

## Auto-Fixes Available

```
/drift-commit-validator --auto-fix

Proposed:
- Type: "feat"
- Scope: "auth" (inferred from files)
- Subject: "Add OAuth2 login" (from commit message)
- Add: "Closes #456" (from git branch name)

Accept? (y/n)
```

## Integration

- Runs before commit (drift-guide hook)
- Runs before PR (drift-pr-generator)
- Runs on every commit (pre-commit hook)

