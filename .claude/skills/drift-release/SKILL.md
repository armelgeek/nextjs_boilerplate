---
name: drift-release
description: Auto-generate releases with semantic versioning, tags, and changelogs
---

# drift-release

Semantic versioning + release tags + changelog. Automatic.

## Usage

Auto-triggered after deploy, or:
```
/drift-release
/drift-release --dry-run
```

## What It Does

### 1. Analyze Commits
```
Since last release (v1.2.0):
  - 3 feat commits (minor)
  - 5 fix commits (patch)
  - 1 BREAKING CHANGE (major)

Calculation: 1.2.0 → 2.0.0 (major wins)
```

### 2. Generate Changelog
```markdown
## [2.0.0] - 2025-08-10

### Features
- Add Stripe subscription support (#456)
- Implement dark mode toggle (#457)
- Add export to CSV (#458)

### Fixes
- Fix login redirect loop (#459)
- Fix timezone calculation in reports (#460)
- Fix memory leak in WebSocket (#461)

### Breaking Changes
- Remove deprecated `GET /users/:id/legacy` endpoint
- Authentication now requires OAuth2 (no basic auth)

### Internal
- Refactor database connection pooling
- Update dependencies to latest versions
```

### 3. Create Release Tag
```bash
git tag -a v2.0.0 -m "Release v2.0.0

[Changelog from above]"
```

### 4. Post Release
```
✅ RELEASE COMPLETE

Version: 2.0.0 (was 1.2.0)
Bump: MAJOR (breaking changes detected)
Changelog: 450 words
Tag: Created and pushed

Deploy info:
- Commit: abc1234
- Branch: main
- Time: 2025-08-10 14:32:00 UTC

Next: Monitor errors, stand by for hotfix
```

## Semantic Versioning

```
MAJOR.MINOR.PATCH

MAJOR: Breaking changes (API removed, behavior changed)
MINOR: New features (backward compatible)
PATCH: Bug fixes only

Detection:
  "BREAKING CHANGE:" in commit → MAJOR
  "feat:" commits → MINOR
  "fix:" commits → PATCH
```

## Output

```
Version bumped: 1.2.0 → 2.0.0
Changelog: 12 commits grouped by type
Tag created: v2.0.0
Ready to announce release.
```

## Integration

- Auto-runs after `drift-deploy --prod` completes
- Can be manually triggered
- Creates GitHub Release (auto-copy changelog)
- Sends release notification (Slack, email)

