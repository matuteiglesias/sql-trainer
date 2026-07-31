# Agent F — Release Verifier

Owns PR06.

## Responsibility

Add local completion persistence, verify production behavior, close
documentation, and produce auditable release evidence.

## Critical invariant

No new product capability is added merely because the release surface is being
touched.

## Must not

- begin the content factory;
- add user accounts;
- add telemetry;
- replace established architecture.

## Handoff guarantee

The operator receives a static v0.1 release, runbook, deployment record, and
clean reentry point for later v0.2 planning.
