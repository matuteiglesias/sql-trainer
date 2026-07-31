# Fixture Copy Map

During PR01, copy:

```text
bundle/fixtures/target/public/db/hospital_v0_1.sqlite
    -> target-repo/public/db/hospital_v0_1.sqlite

bundle/fixtures/target/public/content/exercises/*
    -> target-repo/public/content/exercises/
```

Do not rename, edit, or regenerate the fixture during normal application work.

To verify reproducibility, run:

```bash
python fixtures/source/build_fixture.py
```

Then compare the rebuilt database's logical contents and hash against the
committed target. SQLite file hashes can change when rebuilt by a different
SQLite version even when logical content is identical, so logical table
comparison is the authoritative gate; record both version and hash.
