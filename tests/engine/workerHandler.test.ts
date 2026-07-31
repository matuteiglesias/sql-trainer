import { describe, expect, it, vi } from "vitest";
import { handleExecuteRequest } from "../../src/engine/workerHandler";

const request = { requestId: "request-1", databaseUrl: "/db.sqlite", sql: "SELECT 1" };

describe("handleExecuteRequest", () => {
  it("echoes the request ID for an invalid request", async () => {
    const response = await handleExecuteRequest(
      { ...request, sql: undefined as never },
      { fetchDatabase: vi.fn(), loadSqlJs: vi.fn() },
    );
    expect(response).toEqual({
      requestId: "request-1",
      ok: false,
      error: { kind: "protocol", message: "Invalid worker request." },
    });
  });

  it("normalizes a database HTTP load failure", async () => {
    const response = await handleExecuteRequest(request, {
      fetchDatabase: vi.fn().mockResolvedValue({ ok: false, status: 404 }),
      loadSqlJs: vi.fn(),
    });
    expect(response).toEqual({
      requestId: "request-1",
      ok: false,
      error: { kind: "load", message: "Unable to load the SQLite database (404)." },
    });
  });

  it("normalizes a rejected database load without a stack trace", async () => {
    const response = await handleExecuteRequest(request, {
      fetchDatabase: vi.fn().mockRejectedValue(new Error("Network unavailable\nstack details")),
      loadSqlJs: vi.fn(),
    });
    expect(response).toEqual({
      requestId: "request-1",
      ok: false,
      error: { kind: "load", message: "Network unavailable" },
    });
  });
});
