# Pull-request Sequence

| PR | Agent contract | Outcome | Depends on | Blocks |
|---|---|---|---|---|
| PR01 | Repository Steward | Reproducible app shell and frozen fixture | — | all |
| PR02 | Runtime Engineer | Browser worker executes SQLite | PR01 | PR03+ |
| PR03 | Content Contract Engineer | Five exercises load and validate | PR02 | PR04+ |
| PR04 | Evaluation Engineer | Equivalent result sets are judged correctly | PR03 | PR05+ |
| PR05 | Product UI Engineer | Learner completes full practice loop | PR04 | PR06 |
| PR06 | Release Verifier | Persistence, production smoke, runbook, handoff | PR05 | release |

## Why the chain is linear

PR02 and PR03 could be coded in parallel, but PR03's strongest acceptance gate
is executing every reference query through the real engine. A linear chain
avoids duplicate mock infrastructure and integration repair.

The roles are execution contracts, not claims of simultaneous autonomous work.

## Merge policy

- Rebase or update from the latest `main` before final verification.
- Squash merge is acceptable.
- Never merge a PR with a blocker memo instead of a closure memo.
- Do not stack PRs unless the operator deliberately accepts stacked-review
  overhead.
