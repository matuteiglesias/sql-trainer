# Exercise Content Contract

## Canonical storage

`public/content/exercises/index.json` contains the ordered list of exercise file
names. Each named file contains exactly one exercise.

## Required exercise shape

```ts
type Exercise = {
  id: string;
  datasetId: "hospital-v0.1";
  title: string;
  difficulty: "easy";
  prompt: string;
  concepts: string[];
  starterSql: string;
  referenceSql: string;
  evaluation: {
    columnOrder: "strict";
    rowOrder: "ignore" | "strict";
    duplicateRows: "preserve";
    numericTolerance: number;
  };
  hint: string;
  explanation: string;
};
```

## Validation rules

- IDs are unique and match `^[a-z0-9-]+$`.
- Index entries are unique.
- Every indexed file exists.
- No unindexed exercise file exists.
- `datasetId` is exactly `hospital-v0.1`.
- `referenceSql` is nonempty and executes successfully.
- `starterSql` is nonempty.
- `concepts` has at least one entry.
- `numericTolerance` is nonnegative.
- v0.1 uses `columnOrder: strict`.
- v0.1 uses `duplicateRows: preserve`.
- Prompts and solutions are original to this repository.

## Supplied exercises

| ID | Concept |
|---|---|
| `hospital-001-male-patients` | equality filter |
| `hospital-002-missing-allergies` | `IS NULL` |
| `hospital-003-names-starting-c` | `LIKE` prefix |
| `hospital-004-weight-range-inclusive` | inclusive range |
| `hospital-005-province-names` | inner join |

## Content drift gate

A test must execute all five `referenceSql` values against the bundled database.
A reference query failure blocks the release.

The expected-output files supplied in this bundle are audit fixtures. The
application may calculate expected results dynamically from `referenceSql`;
the audit test must still prove they match the frozen expected-output files.
