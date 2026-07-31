# Agent Coordination Protocol

## Shared rules

Each role owns one bounded pull request. It may repair a directly discovered
defect in an upstream contract only when:

- the repair is necessary for its acceptance test;
- the diff remains small;
- the closure memo names the contract correction;
- the task does not silently broaden scope.

Otherwise, create a blocker memo and return the defect to the owning layer.

## Handoff payload

Every closure memo must contain:

- commit/branch/PR identity;
- changed-file summary;
- commands actually run;
- test outcomes;
- manual evidence;
- contract decisions;
- known gaps;
- exact next task and entry file.

## Review order

Review contract and test changes before UI screenshots.

## Prohibited coordination pattern

Do not let multiple roles independently invent:

- the exercise schema;
- the query result shape;
- error kinds;
- evaluation semantics;
- progress keys.

Those contracts are canonical in `docs/`.
