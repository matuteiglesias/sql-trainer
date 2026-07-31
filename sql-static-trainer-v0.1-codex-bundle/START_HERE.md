# Start Here

## Mission

Build the smallest trustworthy SQL syntax trainer that can be extended later
without committing to the content-factory or teaching-layer architecture.

## Operator procedure

Use a linear merge chain:

1. `PR01` — repository shell and frozen fixture.
2. `PR02` — SQLite execution engine.
3. `PR03` — exercise registry and validation.
4. `PR04` — deterministic evaluator.
5. `PR05` — complete learner practice loop.
6. `PR06` — progress persistence, release verification, and handoff.

Do not ask one Codex run to implement multiple PRs. Each run must:

1. start from the latest merged `main`;
2. read this bundle and the assigned task;
3. modify only the task's declared scope;
4. run every required command;
5. create the required closure memo;
6. open one pull request;
7. stop.

## Branch and PR names

| Task | Branch | Pull-request title |
|---|---|---|
| PR01 | `feat/v01-foundation-fixture` | `v0.1: bootstrap static trainer and freeze toy fixture` |
| PR02 | `feat/v01-sql-runtime` | `v0.1: execute SQLite queries in a browser worker` |
| PR03 | `feat/v01-exercise-registry` | `v0.1: load and validate the five exercise artifacts` |
| PR04 | `feat/v01-result-evaluator` | `v0.1: compare learner and reference result sets` |
| PR05 | `feat/v01-practice-loop` | `v0.1: deliver the end-to-end SQL practice interface` |
| PR06 | `feat/v01-release-gate` | `v0.1: persist progress and close the static release` |

## Required merge gate

A PR is not mergeable merely because the UI appears to work. It needs:

- scoped diff;
- passing declared commands;
- test evidence;
- closure memo;
- no unresolved blocker;
- no feature from v0.2 or v0.3;
- exact next pointer.

## Current bottleneck rule

At any time, only the next unmerged PR is active. Do not start downstream work
to compensate for a blocked upstream contract. Record the blocker and resolve
the earliest broken gate.
