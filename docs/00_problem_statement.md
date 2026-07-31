# Problem Statement

Existing SQL practice sites provide useful repetition, but the instructor does
not control the exercise corpus, sequencing, datasets, or later classroom
instrumentation.

The v0.1 problem is narrower than building a learning platform:

> Provide a static application where a learner repeatedly writes SQLite
> `SELECT` queries against one known database and receives deterministic,
> immediate feedback.

## User

A learner who understands basic relational concepts and needs high-frequency
syntax practice.

## Primary job

Given a prompt and visible schema:

1. write SQL;
2. execute it;
3. inspect the returned rows or syntax error;
4. check the answer;
5. correct the query;
6. proceed to another exercise.

## Success criteria

A fresh user can complete all five supplied exercises without setup, a server,
or an instructor. Equivalent SQL formulations pass even when their text
differs from the reference query.

## Failure modes this release must prevent

- Accepting only the reference SQL string.
- Reusing a mutated database between attempts.
- Treating `NULL` as an empty string.
- Losing duplicate rows while comparing results.
- Accidentally making row order significant when the exercise does not.
- Shipping exercises whose reference queries fail.
- Declaring release completion based only on development-server behavior.
