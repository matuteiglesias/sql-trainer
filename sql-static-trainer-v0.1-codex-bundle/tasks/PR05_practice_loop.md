# PR05 — End-to-end Practice Loop

**Agent:** Product UI Engineer  
**Depends on:** PR04 merged  
**Branch:** `feat/v01-practice-loop`  
**PR title:** `v0.1: deliver the end-to-end SQL practice interface`

## Objective

Connect the established contracts into the complete session-level learner
experience.

## Required work

1. Load the exercise registry and database schema.
2. Render five-item exercise navigation.
3. Render active prompt, tags, hint, and starter SQL.
4. Use a controlled monospace `<textarea>`.
5. Implement:
   - `Run query`;
   - `Check answer`;
   - previous;
   - next;
   - reset current query.
6. Display:
   - schema;
   - learner result;
   - loading state;
   - concise execution error;
   - structured evaluation feedback.
7. Mark completion in React session state after a passing check.
8. Add keyboard run shortcut.
9. Add component/integration tests for the learner path.
10. Keep domain logic outside components.

## Session-level acceptance flow

For each of the five exercises:

1. select exercise;
2. submit malformed SQL and see an error;
3. run a valid but wrong query and see rows;
4. check the wrong query and see failure;
5. submit a correct or equivalent query;
6. see pass and completion marker;
7. navigate onward.

## Allowed implementation surface

- React app/components;
- plain CSS;
- UI tests;
- minimal orchestration hooks.

## Non-goals

No `localStorage`, backend, accounts, telemetry, rich editor, routing framework,
or content authoring.

## Required commands

```bash
npm ci
npm run typecheck
npm run test:run
npm run build
npm run preview
```

Run the session-level acceptance flow in production preview.

## Exit gate

- all five exercises are solvable end-to-end;
- session completion markers work;
- no domain logic was duplicated in UI components;
- `memos/PR05_closure.md` exists.
