# Risk Register

| Risk | Failure signal | Owning PR | Required mitigation |
|---|---|---:|---|
| WASM path works only in dev | production preview cannot initialize SQL | PR02/PR06 | resolve asset with Vite-safe URL; test preview |
| Worker hangs | UI remains permanently busy | PR02 | centralized timeout; terminate/recreate worker |
| Database state leaks | one attempt changes later results | PR02 | fresh DB per execution; state-isolation test |
| Exercise drift | reference query throws or output changes | PR03 | execute all references; compare frozen fixtures |
| Order false negative | equivalent unordered query fails | PR04 | row multiset comparison |
| Duplicate false positive | missing duplicate still passes | PR04 | multiplicity-aware comparison |
| Null coercion | empty string accepted as null | PR04 | type-tagged canonicalization |
| UI absorbs domain logic | evaluator behavior duplicated in components | PR05 | consume typed services only |
| Dependency expansion | build complexity grows without learner value | all | dependency gate in review |
| Static path break | deployed subpath cannot find DB/content | PR06 | production preview and deployment notes |
| Scope spill into v0.2/v0.3 | accounts, authoring, analytics appear | all | reject against non-goals |
