# PR03 — Exercise Registry and Integrity

**Agent:** Content Contract Engineer  
**Depends on:** PR02 merged  
**Branch:** `feat/v01-exercise-registry`  
**PR title:** `v0.1: load and validate the five exercise artifacts`

## Objective

Turn static JSON files into an ordered, typed exercise registry and prove the
reference content is executable and frozen.

## Required work

1. Implement the canonical Zod exercise schema.
2. Fetch and validate `index.json`.
3. Fetch each indexed exercise.
4. Reject:
   - duplicate IDs;
   - duplicate index paths;
   - malformed fields;
   - unknown dataset IDs;
   - an index length other than five.
5. Preserve index order.
6. Execute every `referenceSql` through the real PR02 engine.
7. Compare every reference result with the matching frozen file in
   `fixtures/expected/` copied into the test fixture area.
8. Expose a typed `loadExercises()` service.
9. Add readable content-load error types.

## Allowed implementation surface

- `src/content/`;
- exercise types;
- content tests;
- test fixtures/scripts;
- documentation corrections required by discovered fixture truth.

## Non-goals

No evaluator, UI, additional exercises, content editor, generation, or bulk
import.

## Required commands

```bash
npm ci
npm run typecheck
npm run test:run
npm run build
```

## Exit gate

- exactly five exercises load in canonical order;
- every reference query executes;
- every reference output matches the frozen audit fixture;
- malformed content fails clearly;
- `memos/PR03_closure.md` exists.
