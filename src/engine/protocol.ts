import type { QueryResult, QueryValue } from "../types/query";

export type ExecuteRequest = {
  requestId: string;
  databaseUrl: string;
  sql: string;
};

export type ExecuteSuccess = {
  requestId: string;
  ok: true;
  result: QueryResult;
};

export type ExecuteFailure = {
  requestId: string;
  ok: false;
  error: {
    kind: "load" | "syntax" | "execution" | "protocol";
    message: string;
  };
};

export type ExecuteResponse = ExecuteSuccess | ExecuteFailure;

const failureKinds = new Set(["load", "syntax", "execution", "protocol"]);
const isQueryValue = (value: unknown): value is QueryValue =>
  value === null || typeof value === "string" || (typeof value === "number" && Number.isFinite(value));

export function isExecuteResponse(value: unknown): value is ExecuteResponse {
  if (!value || typeof value !== "object") return false;
  const response = value as Record<string, unknown>;
  if (typeof response.requestId !== "string" || typeof response.ok !== "boolean") return false;

  if (response.ok) {
    const result = response.result as Record<string, unknown> | undefined;
    const columns = result?.columns;
    return Boolean(
      result &&
        Array.isArray(columns) &&
        columns.every((column) => typeof column === "string") &&
        Array.isArray(result.rows) &&
        result.rows.every(
          (row) => Array.isArray(row) && row.length === columns.length && row.every(isQueryValue),
        ),
    );
  }

  const error = response.error as Record<string, unknown> | undefined;
  return Boolean(
    error &&
      typeof error.kind === "string" &&
      failureKinds.has(error.kind) &&
      typeof error.message === "string",
  );
}
