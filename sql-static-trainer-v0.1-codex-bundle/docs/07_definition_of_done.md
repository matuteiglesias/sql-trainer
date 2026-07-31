# v0.1 Definition of Done

The release is complete only when all conditions below are true.

## Product

- All five exercises load in the prescribed order.
- The schema panel shows both `patients` and `provinces`.
- A learner can run valid SQL and inspect rows.
- A learner receives a readable syntax error for invalid SQL.
- Equivalent SQL passes.
- Wrong results fail.
- Completion persists after page reload.
- Reset clears progress.
- Previous and next navigation works.
- A completed exercise can be retried.

## Data and content

- Bundled SQLite file matches the reproducible seed.
- All exercise JSON passes schema validation.
- All reference queries execute.
- All reference outputs match the frozen expected fixtures.
- No additional exercise is silently bundled.

## Engineering

- Engine, content, evaluation, storage, and UI boundaries remain separate.
- Every execution uses fresh database state.
- Worker failures and timeouts return control to the UI.
- Unit and component tests pass.
- Type checking passes.
- Production build passes.
- Production preview passes the manual smoke script.

## Repository evidence

- Six closure memos exist.
- `docs/runbook.md` exists.
- `memos/FINAL_HANDOFF.md` exists.
- README states the SQLite dialect and v0.1 limitations.
- Third-party dependencies are documented.
- `STATUS.yaml` records all PRs as merged and release as closed.
