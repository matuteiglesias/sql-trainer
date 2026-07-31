# PR03 Deferred Verification Memo

> DEPENDENCY VERIFICATION DEFERRED — npm registry HTTP 403

## Identity

- Task: PR03 — Exercise Registry and Integrity
- Branch: `feat/v01-exercise-registry`
- Base branch: `feat/v01-sql-runtime`
- Date: 2026-07-31

## Implementation completed

- Added strict canonical Zod schemas for the exercise index, exercises, and evaluation settings.
- Added an ordered `loadExercises()` service with readable typed content errors.
- Enforced five index entries, canonical and unique paths, the frozen dataset ID, required fields, and unique exercise IDs.
- Copied all five frozen expected result artifacts into the test fixture area.

## Tests authored

- Canonical five-exercise loading and order preservation.
- Wrong index length, duplicate paths, malformed fields, unknown dataset IDs, duplicate IDs, and network failures.
- Real-engine execution of all five reference queries against the bundled database.
- Exact comparison of every reference result with its frozen expected artifact.

## Checks actually run

| Command | Result |
|---|---|
| `npm run check:fixtures` | pass; canonical files and hashes verified |
| `node --check scripts/check-fixtures.mjs` | pass |
| JSON parse check for package, public content, and expected audit fixtures | pass |
| `git diff --check` | pass |
| branch/status checks | pass |

## Commands deferred

- `npm ci`
- `npm run typecheck`
- `npm run test:run`
- `npm run build`

These dependency-backed commands are deferred, not passed.

## Dependency-sensitive assumptions

- The pinned Zod version supports the strict schemas, discriminated parse results, finite numbers, and inferred types used here.
- The Fetch `Response` implementation supplied by jsdom/Node in Vitest behaves like the browser response used by `loadExercises()`.
- PR02's deferred sql.js initialization and execution assumptions must pass before the reference audit can be accepted.

## Exact re-verification commands

```bash
npm install
npm ci
npm run check:fixtures
npm run typecheck
npm run test:run
npm run build
```

## Next PR

- PR04 — `tasks/PR04_result_evaluator.md`
- Branch: `feat/v01-result-evaluator`, based on this branch
- Title: `v0.1: compare learner and reference result sets`
