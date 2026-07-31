# SQL Static Trainer Runbook

## Install and verify

Use Node.js 20.19+ or 22.12+ and run `npm ci`. During development use
`npm run dev`; the complete local gate is `npm run check:fixtures`,
`npm run typecheck`, `npm run test:run`, and `npm run build`.

## Production preview and static deployment

Run `npm run preview` after building, then follow
`tests/manual_smoke_script.md`. Deploy the generated `dist/` directory to any
static host. The host must serve `.wasm`, worker modules, the SQLite database,
and exercise JSON without rewriting those assets to `index.html`.

## Fixture rebuild

Run `python fixtures/source/build_fixture.py`. Logical table comparison is the
authoritative reproducibility check; a SQLite-version difference can change the
file hash. Normal application development must not regenerate the fixture.

## Progress reset

Use **Reset progress** in the header and confirm the prompt. For support and
debugging, remove the `sql-static-trainer:progress:v1` local-storage key.

## Known limitations

Version 0.1 supports SQLite, one frozen hospital dataset, five easy exercises,
and read-only single-statement queries. It has no backend, accounts, sync,
analytics, rich editor, authoring tools, or draft persistence. Reference SQL is
delivered to the browser and therefore is not secret.
