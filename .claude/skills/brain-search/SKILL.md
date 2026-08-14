---
name: brain-search
description: Query Mooz Brain for decisions, learnings, and patterns
---

# Brain Search

Query the Mooz Brain SQLite knowledge graph. Ask about past decisions, reusable patterns, or hot files.

## Examples

- `/brain-search "authentication"` — Show all auth-related decisions
- `/brain-search decisions by domain:database` — List database decisions only
- `/brain-search learnings confidence:>0.7` — High-confidence learnings
- `/brain-search hot-files` — Most frequently changed files
- `/brain-search decisions locked` — All locked decisions (never ask again)

## Query Types

### Decisions
```
Query: /brain-search decisions [domain] [locked|unlocked]
Shows: Question → Answer, domain, confidence, locked status
Example: /brain-search decisions auth
```

### Learnings
```
Query: /brain-search learnings [domain] [confidence:>N]
Shows: Pattern, problem, solution, confidence, use count
Example: /brain-search learnings database confidence:>0.7
```

### Hot Files
```
Query: /brain-search hot-files [limit:10]
Shows: File path, change count, domains, last changed
Example: /brain-search hot-files limit:5
```

### Conventions
```
Query: /brain-search conventions [key]
Shows: Project-wide conventions (naming, imports, patterns)
Example: /brain-search conventions import-style
```

## How It Works

Brain search queries `.drift-brain.db`:
1. **Decisions table** — locked Q&A pairs (never ask same question twice)
2. **Learnings table** — error→fix patterns with confidence scoring
3. **Hot files table** — frequently co-changed files from git history
4. **Conventions table** — project-wide patterns and standards
5. **Model performance table** — which agent/model works best per domain

Results are returned with:
- Relevance ranking (exact match first)
- Confidence scores (0.0–1.0)
- Context (when decision was made, which task learned it)

## Output Format

For each result:
- **Title** (decision/learning/file name)
- **Content** (answer, solution, or data)
- **Metadata** (domain, confidence, timestamp, use count)
- **Context** (if available)

## Tips

- Queries are case-insensitive
- Use domain filters to narrow results: `auth`, `ui`, `api`, `database`, `infra`, `content`
- Use confidence filters: `>0.8` (high confidence), `<0.5` (uncertain)
- Prefix with `-` to exclude: `/brain-search decisions -ui` (non-UI decisions)
- Combine filters: `/brain-search learnings database confidence:>0.7` (high-confidence database learnings)

## Limitations

Brain only stores decisions made in Mooz workflows. To add decisions manually:
- Use `/learn` to record patterns
- Make decisions during `/ship-feature` or `/ship-bug`
- Scribe agent records them automatically

$ARGUMENTS
