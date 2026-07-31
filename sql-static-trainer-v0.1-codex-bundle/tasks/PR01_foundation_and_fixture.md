# PR01 — Foundation and Frozen Fixture

**Agent:** Repository Steward  
**Branch:** `feat/v01-foundation-fixture`  
**PR title:** `v0.1: bootstrap static trainer and freeze toy fixture`

## Objective

Create the Vite React TypeScript repository, baseline quality commands,
documentation surface, and exact database/content fixture.

## Required work

1. Bootstrap Vite React TypeScript.
2. Commit `package-lock.json`.
3. Add only the dependencies required by the frozen architecture:
   - runtime: `sql.js`, `zod`;
   - test/dev: Vitest, jsdom, React Testing Library, jest-dom, and any required
     type package.
4. Add scripts:
   - `dev`;
   - `build`;
   - `preview`;
   - `typecheck`;
   - `test`;
   - `test:run`.
5. Copy `fixtures/target/public/` into target repository `public/`.
6. Copy the bundle's core product/architecture documents into target `docs/`.
7. Add a minimal app shell that identifies the product and SQLite dialect.
8. Add a fixture-integrity script or test that verifies:
   - all six static files exist;
   - exercise index contains exactly five unique entries;
   - indexed exercise JSON parses;
   - database file is nonempty.
9. Add `memos/` and closure/blocker templates.

## Allowed implementation surface

- package/build configuration;
- minimal `src` shell;
- `public/`;
- `docs/`;
- `scripts/`;
- baseline tests;
- memo templates.

## Non-goals

No SQL execution, content loader service, evaluator, exercise UI, or progress.

## Required commands

```bash
npm install
npm run typecheck
npm run test:run
npm run build
```

## Exit gate

- clean install succeeds;
- five exact exercises and one exact database are committed;
- baseline commands pass;
- no later-layer code is present;
- `memos/PR01_closure.md` exists.

## Required closure evidence

- final dependency list;
- copied fixture paths and hashes;
- command outputs;
- exact next pointer: PR02.
