from pathlib import Path
import sqlite3

HERE = Path(__file__).resolve().parent
seed = (HERE / "hospital_v0_1_seed.sql").read_text(encoding="utf-8")
target = HERE.parent / "target" / "public" / "db" / "hospital_v0_1.sqlite"
target.parent.mkdir(parents=True, exist_ok=True)

if target.exists():
    target.unlink()

connection = sqlite3.connect(target)
try:
    connection.executescript(seed)
    connection.commit()
finally:
    connection.close()

print(target)
