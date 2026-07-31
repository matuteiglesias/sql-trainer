from pathlib import Path
import json
import sqlite3
import sys

HERE = Path(__file__).resolve().parent
db_path = HERE.parent / "target" / "public" / "db" / "hospital_v0_1.sqlite"
snapshot_path = HERE.parent / "expected" / "database_logical_snapshot.json"

snapshot = json.loads(snapshot_path.read_text(encoding="utf-8"))
connection = sqlite3.connect(db_path)

try:
    for table, expected in snapshot["tables"].items():
        cursor = connection.execute(f"SELECT * FROM {table} ORDER BY 1")
        actual = {
            "columns": [column[0] for column in cursor.description],
            "rows": [list(row) for row in cursor.fetchall()],
        }
        if actual != expected:
            raise AssertionError(f"logical fixture mismatch: {table}")
finally:
    connection.close()

print("fixture logical snapshot: PASS")
