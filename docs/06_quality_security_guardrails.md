# Quality and Security Guardrails

## Trust boundary

All learner SQL runs inside the learner's browser. No query is sent to a
project-controlled server.

This is risk-reducing architecture, not an exam-security guarantee.

## Required controls

- Execute in a Web Worker so a normal query does not block React rendering.
- Create and close a fresh SQLite database for every execution.
- Add a worker timeout at the client boundary.
- Terminate and recreate the worker after timeout or protocol failure.
- Limit displayed rows to a documented UI maximum while retaining the complete
  result needed for evaluation when feasible.
- Surface concise errors, not stack traces.
- Treat exercise JSON as untrusted static content until Zod validation passes.
- Never interpolate exercise or learner SQL into application HTML.

## Query timeout

The initial timeout may be a simple wall-clock client timeout. It is acceptable
that the terminated worker discards the execution rather than interrupting
SQLite internally.

The exact timeout should be centralized in one constant and covered by a test
using a mocked worker.

## Licence and originality boundary

- Do not scrape or copy sql-practice.com's exercise corpus, source, branding,
  or layout.
- The five supplied prompts and dataset are original bundle fixtures.
- Record third-party dependencies and licences in the repository README.

## Dependency rule

A new runtime dependency requires a concrete v0.1 need. Convenience alone is
not sufficient.
