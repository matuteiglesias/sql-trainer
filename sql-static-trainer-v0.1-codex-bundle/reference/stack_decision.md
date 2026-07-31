# Stack Decision Record

## Decision

Use Vite + React + TypeScript, `sql.js` in a Web Worker, Zod, Vitest, React
Testing Library, plain CSS, and `localStorage`.

## Why

- Vite produces a static build.
- `sql.js` runs SQLite in the browser through WebAssembly.
- A Web Worker protects UI responsiveness and provides a termination boundary.
- Zod makes static content failures explicit.
- Vitest fits the Vite/TypeScript toolchain.
- A plain text area is sufficient for five syntax exercises.
- `localStorage` is sufficient for anonymous completion state.

## Rejected for v0.1

- Next.js: no server or routing need.
- Backend database: unnecessary operational and security surface.
- Monaco/CodeMirror: editor richness is not the current bottleneck.
- Dexie/IndexedDB: progress payload is tiny.
- Tailwind/component library: no material practice capability.
- SQL parser: result equivalence is the correctness boundary.
- Multiple dialects: destroys the single-database simplicity.

## Review trigger

Reconsider only after repeated real use demonstrates a concrete limitation.
