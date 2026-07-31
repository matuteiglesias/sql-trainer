# Dependency Graph

```mermaid
flowchart TD
    P1[PR01 Foundation + fixture]
    P2[PR02 SQL runtime]
    P3[PR03 Exercise registry]
    P4[PR04 Result evaluator]
    P5[PR05 Practice UI]
    P6[PR06 Persistence + release]

    P1 --> P2
    P2 --> P3
    P3 --> P4
    P4 --> P5
    P5 --> P6
```

## Contract flow

```text
database bytes ──PR02──> QueryResult
exercise JSON ───PR03──> Exercise
QueryResult + Exercise.evaluation ──PR04──> EvaluationVerdict
all contracts ───PR05──> learner interaction
learner completion ──PR06──> local persisted release
```

## Earliest-defect rule

When a downstream test reveals a defect in an upstream contract, repair the
earliest owning layer. Do not add UI workarounds for engine or evaluator bugs.
