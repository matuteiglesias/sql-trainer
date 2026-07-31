import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import initSqlJs, { type SqlJsStatic } from "sql.js";
import { beforeAll, describe, expect, it } from "vitest";
import { executeSql, introspectSchema } from "../../src/engine/sqliteCore";

const require = createRequire(import.meta.url);
let SQL: SqlJsStatic;
let fixture: Uint8Array;

beforeAll(async () => {
  SQL = await initSqlJs({ locateFile: () => require.resolve("sql.js/dist/sql-wasm.wasm") });
  fixture = new Uint8Array(await readFile("fixtures/target/public/db/hospital_v0_1.sqlite"));
});

describe("executeSql", () => {
  it("executes SELECT 1", () => {
    expect(executeSql(SQL, fixture, "SELECT 1 AS value")).toEqual({
      ok: true,
      result: { columns: ["value"], rows: [[1]] },
    });
  });

  it("executes a query against the real fixture", () => {
    expect(executeSql(SQL, fixture, "SELECT first_name FROM patients WHERE patient_id = 1")).toEqual({
      ok: true,
      result: { columns: ["first_name"], rows: [["Amina"]] },
    });
  });

  it("normalizes syntax failures", () => {
    const outcome = executeSql(SQL, fixture, "SELEC 1");
    expect(outcome.ok).toBe(false);
    if (!outcome.ok) {
      expect(outcome.error.kind).toBe("syntax");
      expect(outcome.error.message).not.toContain("\n");
    }
  });

  it("uses a fresh database for every execution", () => {
    expect(executeSql(SQL, fixture, "UPDATE patients SET first_name = 'Changed' WHERE patient_id = 1").ok).toBe(true);
    expect(executeSql(SQL, fixture, "SELECT first_name FROM patients WHERE patient_id = 1")).toEqual({
      ok: true,
      result: { columns: ["first_name"], rows: [["Amina"]] },
    });
  });
});

describe("introspectSchema", () => {
  it("returns patients and provinces with their columns", () => {
    const schema = introspectSchema(SQL, fixture);
    expect(schema.map(({ name }) => name)).toEqual(["patients", "provinces"]);
    expect(schema.find(({ name }) => name === "patients")?.columns.map(({ name }) => name)).toContain("patient_id");
    expect(schema.find(({ name }) => name === "provinces")?.columns.map(({ name }) => name)).toContain("province_name");
  });
});
