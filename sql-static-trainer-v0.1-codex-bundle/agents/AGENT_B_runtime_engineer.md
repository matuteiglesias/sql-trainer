# Agent B — Runtime Engineer

Owns PR02.

## Responsibility

Turn immutable database bytes plus learner SQL into a typed success or failure
through a Web Worker.

## Critical invariant

Every execution creates and closes a fresh `sql.js` Database.

## Must not

- parse exercise files;
- compare expected answers;
- build learner UI;
- persist state.

## Handoff guarantee

PR03 receives a tested engine API that can execute all supplied reference
queries without knowledge of exercise semantics.
