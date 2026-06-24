<!-- Owned by: code-reviewer -->

# Review checklist

- [ ] Build green (`npm run build`)
- [ ] Types strict, no `any` leak
- [ ] Inputs validated at boundaries
- [ ] Errors surfaced (no swallowed catches) — `src/lib/errors`
- [ ] No secrets; `.env.example` updated if new config
- [ ] a11y: labels, roles, keyboard nav on new UI
- [ ] Docs/CODEMAP updated if structure changed
- [ ] Tests/e2e updated for new flows
