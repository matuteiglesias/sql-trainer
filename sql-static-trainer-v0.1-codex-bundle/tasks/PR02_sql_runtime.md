# PR02 — Browser SQLite Runtime

**Agent:** Runtime Engineer  
**Depends on:** PR01 merged  
**Branch:** `feat/v01-sql-runtime`  
**PR title:** `v0.1: execute SQLite queries in a browser worker`

## Objective

Provide a typed engine that loads the static database and executes SQL through
a Web Worker without retaining mutable database state.

## Required work

1. Define canonical query result and engine outcome types.
2. Implement a pure/core `sql.js` execution function suitable for unit tests.
3. Implement the worker protocol from `docs/02_architecture_contract.md`.
4. Implement a browser worker client with:
   - request correlation;
   - timeout;
   - worker recreation after timeout/protocol failure;
   - concise normalized errors.
5. Resolve the `sql.js` WASM asset in a Vite production-safe manner.
6. Introspect schema for `patients` and `provinces`.
7. Test:
   - `SELECT 1`;
   - a real fixture query;
   - syntax failure;
   - request ID correlation;
   - timeout behavior with mocked worker;
   - fresh-state isolation;
   - database load failure.

## Fresh-state acceptance test

Execute an `UPDATE` against one fresh database instance, close it, then execute
a `SELECT` through a new instance and prove the original bundled value remains.

This does not add DML support to the product; it proves isolation.

## Allowed implementation surface

- `src/engine/`;
- shared engine types;
- engine tests;
- minimal debug harness only when needed.

## Non-goals

No exercise parsing, result evaluation, practice screen, or persistence.

## Required commands

```bash
npm ci
npm run typecheck
npm run test:run
npm run build
npm run preview
```

Verify in production preview that the worker initializes and can execute
`SELECT 1`.

## Exit gate

- engine contract is stable and tested;
- worker cannot leave the UI permanently pending after timeout;
- fresh-state invariant is proven;
- production preview resolves WASM and database assets;
- `memos/PR02_closure.md` exists.
