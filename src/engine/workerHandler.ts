import type { SqlJsStatic } from "sql.js";
import type { ExecuteFailure, ExecuteRequest, ExecuteResponse } from "./protocol";
import { executeSql } from "./sqliteCore";

type WorkerDependencies = {
  fetchDatabase: typeof fetch;
  loadSqlJs: () => Promise<SqlJsStatic>;
};

function failure(requestId: string, kind: ExecuteFailure["error"]["kind"], message: string): ExecuteFailure {
  return { requestId, ok: false, error: { kind, message } };
}

export async function handleExecuteRequest(
  data: ExecuteRequest,
  dependencies: WorkerDependencies,
): Promise<ExecuteResponse> {
  const requestId = typeof data?.requestId === "string" ? data.requestId : "";
  if (!requestId || typeof data?.databaseUrl !== "string" || typeof data?.sql !== "string") {
    return failure(requestId, "protocol", "Invalid worker request.");
  }

  try {
    const databaseResponse = await dependencies.fetchDatabase(data.databaseUrl);
    if (!databaseResponse.ok) {
      return failure(requestId, "load", `Unable to load the SQLite database (${databaseResponse.status}).`);
    }

    const SQL = await dependencies.loadSqlJs();
    const outcome = executeSql(SQL, new Uint8Array(await databaseResponse.arrayBuffer()), data.sql);
    return outcome.ok
      ? { requestId, ok: true, result: outcome.result }
      : failure(requestId, outcome.error.kind === "syntax" ? "syntax" : "execution", outcome.error.message);
  } catch (error) {
    const message = error instanceof Error ? error.message.split("\n", 1)[0] : "Unable to load SQLite.";
    return failure(requestId, "load", message);
  }
}
