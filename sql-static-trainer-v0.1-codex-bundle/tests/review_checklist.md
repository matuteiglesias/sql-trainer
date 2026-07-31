# Pull-request Review Checklist

## Scope

- [ ] Implements only the assigned PR.
- [ ] No v0.2 or v0.3 capability.
- [ ] No unnecessary dependency.
- [ ] No unrelated formatting/refactor churn.

## Contracts

- [ ] Canonical types are reused rather than duplicated.
- [ ] Fresh database invariant is preserved.
- [ ] Content is validated before use.
- [ ] Evaluator semantics match the frozen contract.
- [ ] UI does not contain hidden engine/evaluation logic.

## Evidence

- [ ] Closure memo exists.
- [ ] Commands are listed with real outcomes.
- [ ] Tests cover the task's failure path.
- [ ] Production build passes when required.
- [ ] Manual evidence is specific.
- [ ] Next pointer is explicit.

## Merge decision

- [ ] Merge.
- [ ] Request bounded changes.
- [ ] Reject scope expansion.
- [ ] Block and return to upstream owner.
