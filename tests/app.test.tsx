import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { App } from "../src/App";
import type { Exercise } from "../src/content";

const worker = vi.hoisted(() => {
  const runtime = {
    execute: vi.fn(async () => ({ ok: true as const, result: { columns: [], rows: [] } })),
    introspectSchema: vi.fn(async () => ({ ok: true as const, schema: [] })),
    dispose: vi.fn(),
  };
  return { runtime, Client: vi.fn(function Client() { return runtime; }) };
});

vi.mock("../src/engine", () => ({ SqliteWorkerClient: worker.Client }));

beforeEach(() => {
  vi.clearAllMocks();
  window.localStorage.clear();
});

afterEach(cleanup);

const exercise: Exercise = {
  id: "test-exercise",
  datasetId: "hospital-v0.1",
  title: "Test exercise",
  difficulty: "easy",
  prompt: "Write a query.",
  concepts: ["SELECT"],
  starterSql: "SELECT * FROM patients;",
  referenceSql: "SELECT * FROM patients;",
  evaluation: {
    columnOrder: "strict",
    rowOrder: "ignore",
    duplicateRows: "preserve",
    numericTolerance: 0,
  },
  hint: "Select the rows.",
  explanation: "This query selects the rows.",
};

describe("App", () => {
  it("identifies the trainer and its SQL dialect", async () => {
    render(<App createRuntime={() => ({
      execute: async () => ({ ok: true, result: { columns: [], rows: [] } }),
      introspectSchema: async () => ({ ok: true, schema: [] }),
      dispose: () => undefined,
    })} loadContent={async () => [exercise]} />);

    expect(await screen.findByText("SQLite")).toBeVisible();
    expect(screen.getByRole("heading", { name: "SQL Static Trainer" })).toBeVisible();
  });

  it("keeps the default worker alive and preserves edits across state updates", async () => {
    render(<App loadContent={async () => [exercise]} />);

    const editor = await screen.findByRole("textbox", { name: "SQL query" });
    fireEvent.change(editor, { target: { value: "SELECT first_name FROM patients;" } });

    expect(editor).toHaveValue("SELECT first_name FROM patients;");
    expect(worker.Client).toHaveBeenCalledTimes(1);
    expect(worker.runtime.dispose).not.toHaveBeenCalled();
  });

  it("restores the controls and reports an unexpected execution failure", async () => {
    render(<App loadContent={async () => [exercise]} createRuntime={() => ({
      execute: async () => { throw new Error("Unexpected worker failure"); },
      introspectSchema: async () => ({ ok: true, schema: [] }),
      dispose: () => undefined,
    })} />);

    const checkButton = await screen.findByRole("button", { name: "Check answer" });
    fireEvent.click(checkButton);

    expect(await screen.findByRole("alert")).toHaveTextContent("Unexpected worker failure");
    expect(checkButton).toBeEnabled();
  });
});
