# Acceptance Matrix

| Capability | Automated evidence | Manual evidence | Owner |
|---|---|---|---|
| Fixture reproducibility | seed hash and DB content test | inspect schema | PR01 |
| Query execution | engine unit tests | run `SELECT 1` | PR02 |
| Fresh state | mutation-isolation test | rerun exercise after attempted update | PR02 |
| Exercise validation | content contract tests | inspect five-item list | PR03 |
| Reference integrity | execute all reference SQL | none required | PR03 |
| Result equivalence | evaluator test matrix | submit alternative syntax | PR04 |
| Practice loop | component tests | solve five exercises | PR05 |
| Error feedback | component/engine tests | submit malformed SQL | PR05 |
| Progress persistence | storage/component tests | reload page | PR06 |
| Static release | typecheck + test + build | preview smoke script | PR06 |
