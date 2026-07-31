# PR04 — Deterministic Result Evaluator

**Agent:** Evaluation Engineer  
**Depends on:** PR03 merged  
**Branch:** `feat/v01-result-evaluator`  
**PR title:** `v0.1: compare learner and reference result sets`

## Objective

Implement framework-independent result-set equivalence under the frozen
evaluation contract.

## Required work

1. Implement typed cell canonicalization.
2. Implement numeric tolerance.
3. Implement strict column name/order comparison.
4. Implement strict row-order comparison.
5. Implement order-insensitive multiset comparison.
6. Preserve duplicate row counts.
7. Return the canonical structured verdict.
8. Add the complete evaluator test matrix from
   `docs/05_evaluation_contract.md`.
9. Add integration tests using at least:
   - the supplied weight-range exercise;
   - an equivalent alternative predicate;
   - a deliberately incomplete result;
   - a deliberately incorrect column alias.

## Allowed implementation surface

- `src/evaluation/`;
- evaluator types/tests;
- small contract corrections only when proven necessary.

## Non-goals

No SQL parser, SQL style checks, UI feedback components, or exercise changes.

## Required commands

```bash
npm ci
npm run typecheck
npm run test:run
npm run build
```

## Exit gate

- all semantic edge cases are explicit and passing;
- equivalent SQL text differences do not matter;
- duplicate multiplicity and null distinctions are proven;
- `memos/PR04_closure.md` exists.
