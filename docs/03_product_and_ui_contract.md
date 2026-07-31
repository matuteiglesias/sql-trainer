# Product and UI Contract

## Required screen

One application screen with four functional regions:

1. **Header**
   - product name;
   - `SQLite` dialect label;
   - reset-progress action.

2. **Exercise navigation**
   - all five exercise titles;
   - active state;
   - completed state;
   - previous and next controls.

3. **Practice workspace**
   - difficulty and concept tags;
   - prompt;
   - plain monospace `<textarea>`;
   - `Run query` button;
   - `Check answer` button;
   - optional `Reset query` action.

4. **Database and result inspection**
   - schema tables and columns;
   - result columns and rows;
   - execution or evaluation feedback.

## Interaction rules

- `Run query` executes learner SQL and displays the result without marking the
  exercise complete.
- `Check answer` executes both learner and reference SQL on fresh databases,
  evaluates them, and marks completion only on pass.
- `Ctrl+Enter` or `Cmd+Enter` performs `Run query`.
- Buttons are disabled while the relevant execution is pending.
- Changing exercises preserves the draft query for the session when practical;
  persistence of drafts is not required.
- A syntax error remains visible until the next execution.
- Selecting a completed exercise does not prevent retrying it.
- Resetting progress requires a confirmation step.

## Feedback minimum

Pass:

> Correct result. Exercise marked complete.

Wrong answer:

- column mismatch, or
- expected versus actual row count, or
- result rows differ.

Execution failure:

- a concise SQLite error message;
- no raw stack trace.

## Layout constraint

The application should remain usable at common desktop widths. Visual polish is
secondary to a stable practice loop. No design system or animation work belongs
in v0.1.
