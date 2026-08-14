---
name: postmortem
description: "Production incident workflow: RCA → Postmortem → Fix → Prevent"
---

# /postmortem — Incident Response & Postmortem

When something breaks in production, follow this workflow to fix it fast and prevent it from happening again.

## Usage

```
/postmortem "API crashed at 3pm"
/postmortem "payments went to wrong account"
```

## Workflow

1. **Immediate Response** (drift-rca)
   - Reproduce in staging
   - Identify impact scope
   - Gather evidence (logs, traces)
   - Find temporary fix

2. **Deploy Hotfix** (drift-nextjs-ui)
   - Implement quick fix
   - Skip full testing if necessary
   - Deploy to production
   - Monitor metrics

3. **Root Cause** (drift-rca)
   - Deep investigation
   - Find why it happened
   - Document findings

4. **Permanent Fix** (drift-nextjs-ui)
   - Implement proper solution
   - Add test case
   - Prevent regression

5. **Postmortem** (drift-ccpm)
   - Timeline of events
   - What went wrong
   - What should have caught it
   - Preventive measures
   - Owner + deadline per action item

---

## Postmortem checklist

- [ ] Timeline documented
- [ ] Root cause identified
- [ ] Impact assessed
- [ ] Fix deployed
- [ ] Test added (so it doesn't happen again)
- [ ] Monitoring alert created
- [ ] Action items assigned with owners + deadlines
- [ ] Team read and acknowledged

---

## Time estimate

- **Hotfix**: 15-30 min
- **Root cause**: 1-2 hours
- **Permanent fix**: 1-4 hours
- **Postmortem write-up**: 30 min
