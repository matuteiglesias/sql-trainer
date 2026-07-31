/// <reference lib="webworker" />

import type { ExecuteRequest } from "./protocol";
import { loadSqlJs } from "./sqliteRuntime";
import { handleExecuteRequest } from "./workerHandler";

const scope: DedicatedWorkerGlobalScope = self as unknown as DedicatedWorkerGlobalScope;

scope.onmessage = async ({ data }: MessageEvent<ExecuteRequest>) => {
  const response = await handleExecuteRequest(data, { fetchDatabase: fetch, loadSqlJs });
  scope.postMessage(response);
};
