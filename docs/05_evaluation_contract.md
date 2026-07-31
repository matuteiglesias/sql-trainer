# Evaluation Contract

## Principle

Correctness is determined by the result set, never by comparing SQL strings.

## Canonical result

```ts
type QueryResult = {
  columns: string[];
  rows: unknown[][];
};
```

## Comparison order

1. Confirm both executions succeeded.
2. Compare column count.
3. Compare column names and order.
4. Compare row count.
5. Compare rows using the exercise's row-order rule.
6. Preserve duplicate multiplicity.
7. Return a structured verdict.

## Value semantics

- `null` equals only `null`.
- Empty string does not equal `null`.
- Strings are case-sensitive.
- Integers and finite numbers compare numerically.
- Numeric values may differ by at most `numericTolerance`.
- Boolean-like SQLite outputs remain numeric unless the query returns text.
- Unsupported nested values should produce a protocol error, not silent
  coercion.

## Row order

For `rowOrder: strict`, compare rows positionally.

For `rowOrder: ignore`:

1. canonicalize each cell with an explicit type tag;
2. canonicalize each row;
3. count occurrences of each canonical row;
4. compare the two multisets.

Do not use a JavaScript `Set`, because it would erase duplicate multiplicity.

## Required verdict shape

```ts
type EvaluationVerdict =
  | { status: "pass" }
  | {
      status: "fail";
      reason:
        | "column-count"
        | "column-names"
        | "row-count"
        | "row-values";
      message: string;
    };
```

Execution errors are not evaluation verdicts. They remain engine outcomes.

## Required evaluator cases

- reference SQL and equivalent alternative SQL pass;
- reordered rows pass when order is ignored;
- reordered rows fail when order is strict;
- wrong column alias fails;
- missing row fails;
- extra row fails;
- duplicate-count mismatch fails;
- `NULL` versus empty string fails;
- numbers inside tolerance pass;
- numbers outside tolerance fail.
