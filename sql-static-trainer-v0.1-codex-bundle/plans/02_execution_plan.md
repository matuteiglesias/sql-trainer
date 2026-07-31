# Execution Plan

## Phase A — Freeze inputs

PR01 establishes the repository, immutable toy database, five exercise files,
expected outputs, scripts, and baseline checks.

Gate: every supplied artifact is present and reproducible.

## Phase B — Make SQL executable

PR02 loads the static SQLite bytes, runs SQL in a worker, serializes results,
and normalizes execution failures.

Gate: fresh-state execution is proven by tests.

## Phase C — Make content trustworthy

PR03 loads the index and exercise files, validates them, and executes every
reference query through the runtime.

Gate: no malformed or drifting exercise can enter the practice loop.

## Phase D — Judge outcomes

PR04 implements deterministic result comparison with explicit null, numeric,
ordering, and duplicate semantics.

Gate: equivalent SQL passes and known incorrect variants fail.

## Phase E — Close the learner loop

PR05 connects prompt, schema, editor, execution, results, feedback, and
navigation.

Gate: a user can solve all five exercises in development mode.

## Phase F — Release

PR06 persists completion, adds reset behavior, verifies the production bundle,
records the operational runbook, and creates the final handoff.

Gate: production preview passes the exact smoke script.
