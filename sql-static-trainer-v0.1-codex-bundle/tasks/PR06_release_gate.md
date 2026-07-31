# PR06 — Persistence and Static Release Gate

**Agent:** Release Verifier  
**Depends on:** PR05 merged  
**Branch:** `feat/v01-release-gate`  
**PR title:** `v0.1: persist progress and close the static release`

## Objective

Persist completion locally, prove the production artifact, close documentation,
and leave an auditable handoff.

## Required work

1. Implement a versioned `localStorage` progress adapter.
2. Persist only:
   - schema version;
   - completed exercise IDs.
3. Ignore unknown/stale exercise IDs on load.
4. Add reset-progress confirmation.
5. Test:
   - save/load;
   - reload restoration;
   - unknown ID cleanup;
   - malformed storage recovery;
   - reset.
6. Add `docs/runbook.md` with:
   - install;
   - development;
   - test;
   - typecheck;
   - build;
   - preview;
   - static deployment;
   - fixture rebuild;
   - progress reset;
   - known limitations.
7. Add dependency/licence notes.
8. Run the complete automated suite.
9. Run `tests/manual_smoke_script.md` against production preview.
10. Deploy to a static host when credentials/configuration are available, or
    record the precise external blocker without pretending deployment occurred.
11. Create:
    - `memos/PR06_closure.md`;
    - `memos/FINAL_HANDOFF.md`.
12. Update `STATUS.yaml` to closed only when the release gate is genuinely met.

## Storage contract

Suggested key:

```text
sql-static-trainer:progress:v1
```

Suggested payload:

```json
{
  "schemaVersion": 1,
  "completedExerciseIds": []
}
```

## Non-goals

No draft-query persistence, cloud synchronization, accounts, analytics,
content factory, or teaching layer.

## Required commands

```bash
npm ci
npm run typecheck
npm run test:run
npm run build
npm run preview
```

## Exit gate

Every item in `docs/07_definition_of_done.md` is verified or explicitly
recorded as blocked. A blocked deployment may be documented, but the static
production preview and all local release checks remain mandatory.
