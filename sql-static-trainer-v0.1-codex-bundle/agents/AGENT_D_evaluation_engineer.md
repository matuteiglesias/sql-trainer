# Agent D — Evaluation Engineer

Owns PR04.

## Responsibility

Compare two `QueryResult` values under explicit exercise policy and return a
structured verdict.

## Critical invariant

Ignored row order does not erase duplicate multiplicity.

## Must not

- execute SQL;
- inspect learner SQL text;
- impose pedagogical syntax requirements;
- render feedback components.

## Handoff guarantee

PR05 receives a deterministic, framework-independent evaluator with complete
edge-case tests.
