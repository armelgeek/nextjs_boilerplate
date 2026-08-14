# Scope Cutter

Force le découpage MVP vs V2+ avant de coder. Élimine le feature creep en forçant des choix binaires.

## Quand l'utiliser

- Dès qu'une feature semble "grosse"
- Avant de créer une branche feature
- Quand tu hésite entre inclure X ou pas
- Avant d'estimer un travail

## Usage

```bash
/scope-cut "Ajouter un système de team collaboration avec permissions granulaires"
```

Retourne:
- ✅ MVP core (ce qui fait la feature fonctionner)
- 🚀 V2 features (can wait, aucune perte de valeur en V1)
- ⚠️ Edge cases à ignorer (complexité inutile)
- ⏱️ Estimation rapide

## How it works

1. **Parse la feature** — comprend la demande
2. **Pose 3 questions** — clarifie le core value
3. **Découpe MVP vs V2** — binaire, pas de "on peut faire les deux"
4. **Donne des estimations** — solo dev friendly (hours, not weeks)
5. **Liste les gotchas** — piègges classiques en V1

L'output est **prêt pour commit** — tu peux le coller dans ton ticket/PR et commencer à coder.

## Example output

```
Feature: Team collaboration with permissions

MVP (Ship this):
✅ Create teams (invite by email, auto-join)
✅ Basic roles (admin, member)
✅ Share workspace with team
✅ Per-feature basic access control

V2 (Backlog):
🚀 Custom role builder
🚀 Granular permission matrix (read/write/delete per resource)
🚀 Audit logs
🚀 SAML/SSO
🚀 Team member invitations with expiry

Ignore in V1:
⚠️ Row-level permissions
⚠️ Delegation workflows
⚠️ Permission inheritance trees

Estimate: 12-16h (solo dev, full stack)
```

## Tips

- **If it takes >1 day, it's not MVP** — split again
- **"Nice to have" = V2** — ruthless about this
- **One job per role** — admin does everything, member reads
- **Revisit in 2 weeks** — after real users, you'll know what V2 needs

