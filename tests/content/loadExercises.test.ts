import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import { ContentLoadError, loadExercises } from "../../src/content/loadExercises";

const fixtureFiles = [
  "hospital-001-male-patients.json", "hospital-002-missing-allergies.json",
  "hospital-003-names-starting-c.json", "hospital-004-weight-range-inclusive.json",
  "hospital-005-province-names.json",
];

async function fixtureMap(): Promise<Record<string, unknown>> {
  const entries = await Promise.all(fixtureFiles.map(async (file) => [file, JSON.parse(await readFile(`fixtures/target/public/content/exercises/${file}`, "utf8"))]));
  return Object.fromEntries(entries);
}

function mockFetch(index: unknown, files: Record<string, unknown>): typeof fetch {
  return (async (input: string | URL | Request) => {
    const name = String(input).split("/").pop()!;
    const body = name === "index.json" ? index : files[name];
    return body === undefined
      ? new Response("missing", { status: 404 })
      : new Response(JSON.stringify(body), { status: 200, headers: { "content-type": "application/json" } });
  }) as typeof fetch;
}

const index = { datasetId: "hospital-v0.1", exerciseFiles: fixtureFiles };

describe("loadExercises", () => {
  it("loads exactly five exercises in index order", async () => {
    const exercises = await loadExercises("/content", mockFetch(index, await fixtureMap()));
    expect(exercises.map(({ id }) => id)).toEqual(fixtureFiles.map((file) => file.replace(/\.json$/, "")));
  });

  it.each([
    ["wrong length", { ...index, exerciseFiles: fixtureFiles.slice(0, 4) }],
    ["duplicate paths", { ...index, exerciseFiles: [...fixtureFiles.slice(0, 4), fixtureFiles[0]] }],
    ["unknown dataset", { ...index, datasetId: "other" }],
  ])("rejects an index with %s", async (_label, invalidIndex) => {
    await expect(loadExercises("/content", mockFetch(invalidIndex, await fixtureMap())))
      .rejects.toMatchObject({ kind: "invalid-index" });
  });

  it("rejects malformed exercise fields", async () => {
    const files = await fixtureMap();
    files[fixtureFiles[0]] = { ...(files[fixtureFiles[0]] as object), concepts: [] };
    await expect(loadExercises("/content", mockFetch(index, files))).rejects.toMatchObject({ kind: "invalid-exercise" });
  });

  it("rejects unknown exercise dataset IDs", async () => {
    const files = await fixtureMap();
    files[fixtureFiles[0]] = { ...(files[fixtureFiles[0]] as object), datasetId: "other" };
    await expect(loadExercises("/content", mockFetch(index, files))).rejects.toMatchObject({ kind: "invalid-exercise" });
  });

  it("rejects duplicate IDs", async () => {
    const files = await fixtureMap();
    files[fixtureFiles[1]] = { ...(files[fixtureFiles[1]] as object), id: "hospital-001-male-patients" };
    await expect(loadExercises("/content", mockFetch(index, files))).rejects.toMatchObject({ kind: "duplicate-id" });
  });

  it("returns a readable network error", async () => {
    const error = await loadExercises("/content", mockFetch(index, {})).catch((value) => value);
    expect(error).toBeInstanceOf(ContentLoadError);
    expect(error).toMatchObject({ kind: "network" });
    expect(error.message).toContain("404");
  });
});
