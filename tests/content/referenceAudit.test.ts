import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import initSqlJs from "sql.js";
import { describe, expect, it } from "vitest";
import { exerciseSchema } from "../../src/content/exerciseSchema";
import { executeSql } from "../../src/engine/sqliteCore";

const require = createRequire(import.meta.url);

describe("frozen reference query audit", () => {
  it("executes every reference query and matches its frozen output", async () => {
    const index = JSON.parse(await readFile("fixtures/target/public/content/exercises/index.json", "utf8"));
    const databaseBytes = new Uint8Array(await readFile("fixtures/target/public/db/hospital_v0_1.sqlite"));
    const SQL = await initSqlJs({ locateFile: () => require.resolve("sql.js/dist/sql-wasm.wasm") });

    for (const filename of index.exerciseFiles) {
      const exercise = exerciseSchema.parse(JSON.parse(await readFile(`fixtures/target/public/content/exercises/${filename}`, "utf8")));
      const expected = JSON.parse(await readFile(`tests/fixtures/expected/${filename}`, "utf8"));
      const outcome = executeSql(SQL, databaseBytes, exercise.referenceSql);
      expect(outcome, exercise.id).toEqual({
        ok: true,
        result: { columns: expected.columns, rows: expected.rows },
      });
      expect(expected.exerciseId).toBe(exercise.id);
    }
  });
});
