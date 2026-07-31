# PR02 Deferred Verification Memo

> DEPENDENCY VERIFICATION DEFERRED — npm registry HTTP 403

## Identity

- Task: PR02 — Browser SQLite Runtime
- Branch: `feat/v01-sql-runtime`
- Date: 2026-07-31
- Base branch: `feat/v01-foundation-fixture`

## Implementation completed

- Added canonical query result, schema, engine outcome, and normalized error types.
- Added a dependency-injected `sql.js` execution core that copies fixture bytes,
  creates a new `Database` for each call, serializes one result, and always
  closes the database.
- Added schema introspection for `patients` and `provinces`.
- Added the typed worker request/response protocol and response validation.
- Added the Vite worker entry point, production-oriented WASM URL import, static
  database fetch, and normalized load failures.
- Added a correlated worker client with one centralized timeout, recovery after
  timeout/protocol/worker failure, and explicit disposal.

## Tests authored

- `SELECT 1` and a real hospital fixture query.
- Concise syntax failure normalization.
- Fresh-state isolation by executing an `UPDATE` and then reading unchanged
  fixture state through a new database.
- Schema introspection for both required tables.
- Out-of-order request correlation.
- Database HTTP/rejection load failures.
- Timeout and worker recreation.
- Invalid protocol response and worker recreation.

## Checks actually run

| Command | Result |
|---|---|
| `npm run check:fixtures` | pass; five artifacts, database size, and all frozen hashes verified |
| `node --check scripts/check-fixtures.mjs` | pass |
| JSON parse check for `package.json` and `public/content/exercises/*.json` | pass |
| `git diff --check` | pass |
| repository branch/status checks | pass |

The one-time trusted-cache inspection requested by the operator found the npm
registry configured as `https://registry.npmjs.org/`, cache path `/root/.npm`,
no usable cache listing, and no project dependency installation within the
bounded search. No dependency directories were copied.

## Commands deferred

- `npm ci`
- `npm run typecheck`
- `npm run test:run`
- `npm run build`
- `npm run preview`
- production-preview worker, WASM, database URL, and `SELECT 1` smoke checks

These commands are deferred, not passed.

## Dependency-sensitive assumptions

- `initSqlJs({ locateFile })` and the installed `@types/sql.js` declarations
  accept the initialization and database APIs used by the core.
- Vite converts `sql.js/dist/sql-wasm.wasm?url` into a production-safe asset URL,
  and `locateFile` may return that URL.
- Vite bundles `new Worker(new URL("./sqlite.worker.ts", import.meta.url),
  { type: "module" })` correctly for development and production.
- Root-relative database URLs supplied by the caller resolve in both Vite dev
  and static preview deployments, including an eventual configured base path.
- Database response bytes are copied into a fresh `Uint8Array` and then copied
  again before `new SQL.Database`; no transferable buffer optimization is
  assumed or required by the current worker request contract.

## Exact re-verification commands

```bash
npm install
npm ci
npm run check:fixtures
npm run typecheck
npm run test:run
npm run build
npm run preview
```

With preview running, execute `SELECT 1` through `SqliteWorkerClient`, execute a
real fixture query, and confirm the generated WASM and database requests both
succeed without a server-side runtime.

## Next PR

- PR03 — `tasks/PR03_exercise_registry.md`
- Branch from this branch: `feat/v01-exercise-registry`
- Prescribed title: `v0.1: load and validate the five exercise artifacts`
