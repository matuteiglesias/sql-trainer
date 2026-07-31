/// <reference lib="webworker" />

import type { ExecuteRequest } from "./protocol";
import { loadSqlJs } from "./sqliteRuntime";
import { handleExecuteRequest } from "./workerHandler";

const scope: DedicatedWorkerGlobalScope = self as unknown as DedicatedWorkerGlobalScope;
const fetchDatabase: typeof fetch = (input, init) => scope.fetch(input, init);

scope.onmessage = async ({ data }: MessageEvent<ExecuteRequest>) => {
  const response = await handleExecuteRequest(data, { fetchDatabase, loadSqlJs });
  scope.postMessage(response);
};
