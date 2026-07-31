import { describe, expect, it, vi } from "vitest";
import { SqliteWorkerClient, type WorkerLike } from "../../src/engine/workerClient";
import type { ExecuteRequest, ExecuteResponse } from "../../src/engine/protocol";

class MockWorker implements WorkerLike {
  onmessage: ((event: MessageEvent) => void) | null = null;
  onerror: ((event: ErrorEvent) => void) | null = null;
  postMessage = vi.fn();
  terminate = vi.fn();

  respond(response: ExecuteResponse): void {
    this.onmessage?.({ data: response } as MessageEvent);
  }
}

describe("SqliteWorkerClient", () => {
  it("correlates responses by request ID", async () => {
    const worker = new MockWorker();
    const client = new SqliteWorkerClient(() => worker);
    const first = client.execute("/db.sqlite", "SELECT 1");
    const second = client.execute("/db.sqlite", "SELECT 2");
    const [firstRequest, secondRequest] = worker.postMessage.mock.calls.map(([request]) => request as ExecuteRequest);

    worker.respond({ requestId: secondRequest.requestId, ok: true, result: { columns: ["value"], rows: [[2]] } });
    worker.respond({ requestId: firstRequest.requestId, ok: true, result: { columns: ["value"], rows: [[1]] } });

    await expect(first).resolves.toMatchObject({ ok: true, result: { rows: [[1]] } });
    await expect(second).resolves.toMatchObject({ ok: true, result: { rows: [[2]] } });
    client.dispose();
  });

  it("returns load failures without changing their kind", async () => {
    const worker = new MockWorker();
    const client = new SqliteWorkerClient(() => worker);
    const outcome = client.execute("/missing.sqlite", "SELECT 1");
    const request = worker.postMessage.mock.calls[0][0] as ExecuteRequest;
    worker.respond({ requestId: request.requestId, ok: false, error: { kind: "load", message: "Unable to load database." } });

    await expect(outcome).resolves.toEqual({ ok: false, error: { kind: "load", message: "Unable to load database." } });
    client.dispose();
  });

  it("introspects the required schema through the worker", async () => {
    const worker = new MockWorker();
    const client = new SqliteWorkerClient(() => worker);
    const schema = client.introspectSchema("/db.sqlite");
    const request = worker.postMessage.mock.calls[0][0] as ExecuteRequest;
    worker.respond({
      requestId: request.requestId,
      ok: true,
      result: {
        columns: ["name", "name", "type", "notnull", "pk"],
        rows: [
          ["patients", "patient_id", "INTEGER", 0, 1],
          ["provinces", "province_id", "TEXT", 1, 1],
        ],
      },
    });

    await expect(schema).resolves.toEqual({
      ok: true,
      schema: [
        {
          name: "patients",
          columns: [{ name: "patient_id", type: "INTEGER", nullable: true, primaryKey: true }],
        },
        {
          name: "provinces",
          columns: [{ name: "province_id", type: "TEXT", nullable: false, primaryKey: true }],
        },
      ],
    });
    client.dispose();
  });

  it("times out and recreates the worker", async () => {
    vi.useFakeTimers();
    const workers = [new MockWorker(), new MockWorker()];
    const client = new SqliteWorkerClient(() => workers.shift()!, 25);
    const outcome = client.execute("/db.sqlite", "SELECT 1");

    await vi.advanceTimersByTimeAsync(25);

    await expect(outcome).resolves.toEqual({
      ok: false,
      error: { kind: "timeout", message: "SQLite execution timed out." },
    });
    expect(workers).toHaveLength(0);
    vi.useRealTimers();
    client.dispose();
  });

  it("recreates the worker after a protocol failure", async () => {
    const workers = [new MockWorker(), new MockWorker()];
    const firstWorker = workers[0];
    const client = new SqliteWorkerClient(() => workers.shift()!);
    const outcome = client.execute("/db.sqlite", "SELECT 1");

    firstWorker.respond({ unexpected: true } as never);

    await expect(outcome).resolves.toEqual({
      ok: false,
      error: { kind: "protocol", message: "SQLite worker returned an invalid response." },
    });
    expect(firstWorker.terminate).toHaveBeenCalledOnce();
    client.dispose();
  });
});
