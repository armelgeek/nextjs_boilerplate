---
name: drift-security
description: Security audit — scan for vulnerabilities, secrets, OWASP issues
---

# Security

Audit code for vulnerabilities and compliance.

## Usage

```
/drift-security
/drift-security --audit
/drift-security --secrets
/drift-security --owasp
```

## Workflow

1. **OWASP Top 10 scan**
   - SQL injection (parameterized queries)
   - XSS (sanitized output)
   - CSRF tokens (present on forms)
   - Broken auth (check OAuth/JWT)
   - Sensitive data exposure (encryption at rest/transit)

2. **Secrets scanning**
   - API keys in code
   - Database passwords
   - Private keys
   - Tokens hardcoded

3. **Dependency audit**
   - `npm audit` / `pnpm audit`
   - CVE scanning
   - Outdated packages

4. **Code review scan**
   - Input validation missing
   - Rate limiting absent
   - Error messages leak info
   - Debug code in production
   - Weak crypto

5. **Infrastructure**
   - HTTPS enforced
   - CORS properly configured
   - Security headers present

## Report

Generate security report with:
- Critical issues (must fix before deploy)
- Warnings (should fix soon)
- Info (good to know)
- Fixes (if possible, auto-apply)

## Common Issues

- ❌ Unparameterized SQL queries
- ❌ Secrets in code
- ❌ Missing input validation
- ❌ Weak password requirements
- ❌ CORS wildcard origins
- ✓ SQL parameterization
- ✓ Environment variables for secrets
- ✓ Zod validation
- ✓ Strong password policy
- ✓ Specific CORS origins

