import type { Database, SqlJsStatic } from "sql.js";
import type { EngineOutcome, QueryResult, QueryValue, SchemaTable } from "../types/query";

function normalizeMessage(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);
  return message.replace(/^Error:\s*/i, "").split("\n", 1)[0] || "SQLite execution failed.";
}

function isQueryValue(value: unknown): value is QueryValue {
  return value === null || typeof value === "string" || (typeof value === "number" && Number.isFinite(value));
}

function serializeFirstResult(database: Database, sql: string): QueryResult {
  const results = database.exec(sql);
  if (results.length === 0) return { columns: [], rows: [] };
  if (results.length !== 1) throw new Error("Only one SQL statement is supported.");

  const [result] = results;
  if (!result.values.every((row) => row.every(isQueryValue))) {
    throw new Error("SQLite returned an unsupported value type.");
  }
  return { columns: [...result.columns], rows: result.values.map((row) => [...row]) };
}

export function executeSql(SQL: SqlJsStatic, databaseBytes: Uint8Array, sql: string): EngineOutcome {
  let database: Database | undefined;
  try {
    database = new SQL.Database(databaseBytes.slice());
    return { ok: true, result: serializeFirstResult(database, sql) };
  } catch (error) {
    const message = normalizeMessage(error);
    return {
      ok: false,
      error: {
        kind: /syntax error|incomplete input|unrecognized token/i.test(message) ? "syntax" : "execution",
        message,
      },
    };
  } finally {
    database?.close();
  }
}

export function introspectSchema(SQL: SqlJsStatic, databaseBytes: Uint8Array): SchemaTable[] {
  const database = new SQL.Database(databaseBytes.slice());
  try {
    const tableResult = database.exec(
      "SELECT name FROM sqlite_master WHERE type = 'table' AND name IN ('patients', 'provinces') ORDER BY name",
    )[0];
    if (!tableResult) return [];

    return tableResult.values.map(([tableName]) => {
      if (typeof tableName !== "string") throw new Error("Invalid schema table name.");
      const escapedName = tableName.replaceAll('"', '""');
      const columns = database.exec(`PRAGMA table_info("${escapedName}")`)[0]?.values ?? [];
      return {
        name: tableName,
        columns: columns.map((column) => ({
          name: String(column[1]),
          type: String(column[2]),
          nullable: column[3] === 0,
          primaryKey: column[5] !== 0,
        })),
      };
    });
  } finally {
    database.close();
  }
}
