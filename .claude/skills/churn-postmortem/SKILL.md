# Churn Post-Mortem

Structure l'investigation quand un client churne ou un funnel convertit mal. Élimine les intuitions, force l'hypothèse testable.

## Quand l'utiliser

- Un client important s'est désabonné
- Conversion rate a droppé sans raison claire
- Churn spike inexpliquée
- Tu veux comprendre **pourquoi** avant de refactoriser

## Usage

```bash
/churn-postmortem "client unsubscribed after 2 weeks, said 'didn't see the value'"
/churn-postmortem "pricing page conversion dropped 30% this week"
/churn-postmortem "free trial to paid conversion at 2%, should be 8%"
```

## Output

```
Churn Signal: [what happened]

Possible Root Causes (ranked by likelihood):
1. Onboarding (user didn't reach aha moment)
2. Pricing (too expensive for perceived value)
3. Feature gap (missing critical feature)
4. Performance/Bug (app broken or slow)
5. Market fit (not the right customer)

Investigation Plan:
[ ] Check user journey logs (signup → first action → churn)
[ ] Review support tickets for keywords
[ ] Compare churned vs retained user behavior
[ ] Check for performance issues during their usage
[ ] ...

Next Action:
[specific, testable hypothesis to verify]
```

## Rules

- No guessing. Forced investigation structure.
- Data first. Intuition second.
- One hypothesis at a time.
- If you can't test it, it's not actionable.

