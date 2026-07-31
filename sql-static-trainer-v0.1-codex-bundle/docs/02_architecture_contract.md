# Architecture Contract

## Chosen stack

- Vite
- React
- TypeScript
- `sql.js`
- Web Worker
- Zod
- Vitest
- React Testing Library
- Plain CSS
- Browser `localStorage`

No backend is permitted in v0.1.

## Runtime flow

```text
static assets
  ├── hospital_v0_1.sqlite
  └── exercise JSON files
          |
          v
React application
  ├── content loader + Zod validation
  ├── learner state
  ├── result evaluator
  └── worker client
          |
          v
SQLite Web Worker
  ├── receives immutable database bytes
  ├── creates a fresh in-memory Database per execution
  ├── executes one query
  ├── serializes columns and rows
  └── closes the Database
```

## Fresh-state invariant

Each learner query and each reference query executes against a newly
constructed `sql.js` database loaded from the original fixture bytes.

The application must not retain a mutable `Database` instance across learner
attempts.

This makes accidental DML nonpersistent and prevents one attempt from
contaminating later attempts. The UI still describes v0.1 as read-only and may
reject obvious non-`SELECT` input, but lexical rejection is not treated as a
security boundary.

## Target repository shape

```text
sql-static-trainer/
├── public/
│   ├── db/hospital_v0_1.sqlite
│   └── content/exercises/
│       ├── index.json
│       ├── hospital-001-male-patients.json
│       ├── hospital-002-missing-allergies.json
│       ├── hospital-003-names-starting-c.json
│       ├── hospital-004-weight-range-inclusive.json
│       └── hospital-005-province-names.json
├── src/
│   ├── app/
│   ├── components/
│   ├── content/
│   ├── engine/
│   ├── evaluation/
│   ├── storage/
│   ├── types/
│   ├── App.tsx
│   ├── main.tsx
│   └── styles.css
├── tests/
├── scripts/
├── docs/
├── memos/
├── package.json
├── package-lock.json
└── vite.config.ts
```

Exact file names inside `src/` may differ modestly, but the boundaries must
remain visible:

- engine does not know React;
- evaluation does not execute SQL;
- content validation does not know UI state;
- storage does not know SQL;
- components consume typed contracts.

## Worker message contract

Request:

```ts
type ExecuteRequest = {
  requestId: string;
  databaseUrl: string;
  sql: string;
};
```

Success:

```ts
type ExecuteSuccess = {
  requestId: string;
  ok: true;
  result: {
    columns: string[];
    rows: unknown[][];
  };
};
```

Failure:

```ts
type ExecuteFailure = {
  requestId: string;
  ok: false;
  error: {
    kind: "load" | "syntax" | "execution" | "protocol";
    message: string;
  };
};
```

The worker must always echo `requestId`.

## Static-asset rule

The `sql.js` WASM asset and SQLite fixture must resolve correctly in both:

- `npm run dev`;
- `npm run build && npm run preview`.

Development-only success is insufficient.
