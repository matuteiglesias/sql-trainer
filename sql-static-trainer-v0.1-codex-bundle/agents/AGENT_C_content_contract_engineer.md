# Agent C — Content Contract Engineer

Owns PR03.

## Responsibility

Load, validate, order, and verify the five exercise artifacts.

## Critical invariant

An exercise cannot enter application state until its JSON passes the canonical
schema.

## Must not

- change prompts merely for style;
- add more exercises;
- implement result comparison;
- build content-authoring infrastructure.

## Handoff guarantee

PR04 receives validated `Exercise` objects and proof that all reference queries
match frozen expected outputs.
