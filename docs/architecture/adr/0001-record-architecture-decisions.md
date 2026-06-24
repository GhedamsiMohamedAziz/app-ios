<!-- Owned by: architect -->

# ADR 0001 — Record architecture decisions

## Status
Accepted

## Context
We need a lightweight way to capture why structural decisions were made.

## Decision
Use ADRs in `docs/architecture/adr/`, one file per decision, numbered.
Each records context, decision, and consequences.

## Consequences
- New significant structural change → new ADR.
- Reviewers can trace why a boundary exists before challenging it.
