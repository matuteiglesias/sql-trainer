# Scope and Non-goals

## Functional scope

The learner can:

- see five exercises;
- select an exercise;
- inspect the database schema;
- edit a SQL query in a plain monospace text area;
- run the query;
- inspect columns and rows;
- check the result against the reference result;
- see pass, wrong-result, or execution-error feedback;
- move to previous or next exercise;
- see completed exercises;
- reset local progress.

## Supported learner SQL

v0.1 exercises require a single read-only SQLite `SELECT` statement. A leading
`WITH` clause is allowed when it produces a `SELECT`.

The evaluator's correctness boundary is the returned result set. It does not
require a particular syntax form.

## Explicit non-goals

- DML or DDL grading.
- Query-performance grading.
- SQL style grading.
- Multiple statements.
- PostgreSQL, MySQL, SQL Server, BigQuery, DuckDB, or dialect translation.
- Hidden assessment answers.
- Instructor dashboards.
- User identity or synchronization across devices.
- Content generation or bulk content import.
- Rich editor features such as autocomplete or linting.
- Accessibility certification, localization, or mobile optimization beyond
  basic responsive usability.
- Reproducing the branding, wording, database, or layout of another product.

## Deliberate simplifications

- The reference SQL is shipped to the browser because this is a practice tool.
- Progress uses `localStorage`.
- A plain `<textarea>` is the editor.
- Five JSON exercise files are loaded through one index file.
- One small database is copied from static assets into memory.
