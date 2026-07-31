import { isExecuteResponse, type ExecuteRequest } from "./protocol";
import type { EngineOutcome, SchemaOutcome, SchemaTable } from "../types/query";

export const WORKER_TIMEOUT_MS = 5_000;

export type WorkerLike = {
  postMessage(message: unknown): void;
  terminate(): void;
  onmessage: ((event: MessageEvent<unknown>) => unknown) | null;
  onerror: ((event: ErrorEvent) => unknown) | null;
};
export type WorkerFactory = () => WorkerLike;

type PendingRequest = {
  resolve: (outcome: EngineOutcome) => void;
  timeoutId: ReturnType<typeof setTimeout>;
};

const defaultWorkerFactory: WorkerFactory = () =>
  new Worker(new URL("./sqlite.worker.ts", import.meta.url), { type: "module" });

export class SqliteWorkerClient {
  private worker: WorkerLike;
  private readonly pending = new Map<string, PendingRequest>();
  private sequence = 0;

  constructor(
    private readonly createWorker: WorkerFactory = defaultWorkerFactory,
    private readonly timeoutMs = WORKER_TIMEOUT_MS,
  ) {
    this.worker = this.startWorker();
  }

  execute(databaseUrl: string, sql: string): Promise<EngineOutcome> {
    const requestId = `sql-${Date.now()}-${++this.sequence}`;
    const request: ExecuteRequest = { requestId, databaseUrl, sql };

    return new Promise((resolve) => {
      const timeoutId = setTimeout(() => {
        this.pending.delete(requestId);
        resolve({ ok: false, error: { kind: "timeout", message: "SQLite execution timed out." } });
        this.recreateWorker("SQLite worker restarted after timeout.");
      }, this.timeoutMs);
      this.pending.set(requestId, { resolve, timeoutId });
      this.worker.postMessage(request);
    });
  }

  async introspectSchema(databaseUrl: string): Promise<SchemaOutcome> {
    const outcome = await this.execute(
      databaseUrl,
      `SELECT tables.name, columns.name, columns.type, columns."notnull", columns.pk
       FROM sqlite_master AS tables
       JOIN pragma_table_info(tables.name) AS columns
       WHERE tables.type = 'table' AND tables.name IN ('patients', 'provinces')
       ORDER BY tables.name, columns.cid`,
    );
    if (!outcome.ok) return outcome;

    try {
      const tables = new Map<string, SchemaTable>();
      for (const row of outcome.result.rows) {
        const [tableName, columnName, type, notNull, primaryKey] = row;
        if (
          typeof tableName !== "string" ||
          typeof columnName !== "string" ||
          typeof type !== "string" ||
          typeof notNull !== "number" ||
          typeof primaryKey !== "number"
        ) {
          throw new Error("SQLite returned invalid schema metadata.");
        }
        const table = tables.get(tableName) ?? { name: tableName, columns: [] };
        table.columns.push({
          name: columnName,
          type,
          nullable: notNull === 0,
          primaryKey: primaryKey !== 0,
        });
        tables.set(tableName, table);
      }
      return { ok: true, schema: [...tables.values()] };
    } catch (error) {
      return {
        ok: false,
        error: {
          kind: "protocol",
          message: error instanceof Error ? error.message : "SQLite returned invalid schema metadata.",
        },
      };
    }
  }

  dispose(): void {
    this.failAll("protocol", "SQLite worker was disposed.");
    this.worker.terminate();
  }

  private startWorker(): WorkerLike {
    const worker = this.createWorker();
    worker.onmessage = ({ data }: MessageEvent<unknown>) => {
      if (!isExecuteResponse(data)) {
        this.recreateWorker("SQLite worker returned an invalid response.");
        return;
      }
      const pending = this.pending.get(data.requestId);
      if (!pending) return;
      clearTimeout(pending.timeoutId);
      this.pending.delete(data.requestId);
      pending.resolve(data.ok ? { ok: true, result: data.result } : { ok: false, error: data.error });
    };
    worker.onerror = () => this.recreateWorker("SQLite worker failed.");
    return worker;
  }

  private recreateWorker(message: string): void {
    this.worker.terminate();
    this.failAll("protocol", message);
    this.worker = this.startWorker();
  }

  private failAll(kind: "protocol", message: string): void {
    for (const pending of this.pending.values()) {
      clearTimeout(pending.timeoutId);
      pending.resolve({ ok: false, error: { kind, message } });
    }
    this.pending.clear();
  }
}
