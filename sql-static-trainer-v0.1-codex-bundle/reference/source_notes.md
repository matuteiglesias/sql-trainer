# Source Notes

Architecture choices should be checked against official project documentation
during implementation.

- `sql.js` is the selected browser SQLite implementation.
- Vite is the selected static build tool.
- React and TypeScript form the UI/application shell.
- Package versions should be pinned by the committed lockfile at PR01 time
  rather than hard-coded in this planning bundle.

Do not treat third-party technology-profiler output as evidence of another
site's internal query-execution architecture.
