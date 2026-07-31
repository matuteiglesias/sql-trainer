# Manual Production Smoke Script

Run against:

```bash
npm run build
npm run preview
```

Record browser, URL, date, and result in `memos/FINAL_HANDOFF.md`.

## Startup

1. Open production preview.
2. Confirm the page labels the dialect as SQLite.
3. Confirm five exercises appear in canonical order.
4. Confirm schema shows `patients` and `provinces`.
5. Reload and confirm assets still load.

## Execution

1. On exercise 1, run:
   ```sql
   SELEC first_name FROM patients;
   ```
2. Confirm readable syntax failure and no stack trace.
3. Run:
   ```sql
   SELECT first_name FROM patients;
   ```
4. Confirm rows render but the exercise is not marked complete.
5. Check the same wrong answer and confirm failure.
6. Check:
   ```sql
   SELECT first_name, last_name, gender
   FROM patients
   WHERE gender = 'M';
   ```
7. Confirm pass and completion marker.

## Equivalent-query acceptance

On exercise 4, check:

```sql
SELECT first_name, last_name
FROM patients
WHERE weight >= 100
  AND weight <= 120;
```

Confirm it passes even though it differs from the reference SQL text.

## Join

On exercise 5, check the correct join and confirm all eight rows appear.

## Persistence

1. Complete at least two exercises.
2. Reload the page.
3. Confirm both remain complete.
4. Reset progress.
5. Confirm completion state clears.
6. Reload again and confirm it remains clear.

## Navigation and timeout recovery

1. Use previous/next controls.
2. Use Ctrl/Cmd+Enter to run a query.
3. Confirm buttons are not left disabled after an execution error.
4. If a timeout debug hook exists only in tests, cite the automated test rather
   than adding a production control.
