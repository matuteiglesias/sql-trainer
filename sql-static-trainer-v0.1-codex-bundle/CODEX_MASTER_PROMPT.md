# Master prompt for Codex

You are implementing **SQL Static Trainer v0.1** from a frozen development
bundle.

## Execution contract

1. Inspect `START_HERE.md`, `STATUS.yaml`, all files in `docs/`, and the next
   pending task in `tasks/`.
2. Work on exactly one pull request.
3. Start from the latest merged `main`.
4. Respect the task's allowed file surface and explicit non-goals.
5. Preserve the contracts; do not redesign the product.
6. Use the supplied files under `fixtures/target/` rather than inventing a
   different toy dataset or exercise corpus.
7. Keep dependencies minimal. Do not introduce a backend, router, UI library,
   CSS framework, rich code editor, authentication, analytics, or content
   authoring system.
8. Run every acceptance command named in the task.
9. Create `memos/PRXX_closure.md` using
   `memos/templates/PR_CLOSURE_TEMPLATE.md`.
10. If a required command cannot run, create
    `memos/PRXX_blocker.md` using the blocker template. Do not claim completion.
11. Open one pull request with the prescribed title and stop.

## Quality priorities

- Deterministic behavior over clever abstractions.
- Fresh SQLite state for every learner query.
- Result equivalence, not SQL text equivalence.
- Explicit handling of `NULL`, duplicate rows, column order, and row order.
- Useful errors without exposing internal stack traces in the learner UI.
- Static production build must work with no server-side runtime.

## Completion statement

Do not write “done” unless the task's exit gate and all tests pass. Report:

- changed files;
- commands and outcomes;
- acceptance evidence;
- remaining limitations;
- exact next PR.
