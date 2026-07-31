import { describe, expect, it } from "vitest";
import { loadProgress, PROGRESS_KEY, resetProgress, saveProgress } from "../../src/storage/progress";
describe("progress storage", () => {
  it("round trips and removes stale IDs", () => {
    saveProgress(localStorage, ["known", "stale"]);
    expect(loadProgress(localStorage, ["known"])).toEqual({ schemaVersion: 1, completedExerciseIds: ["known"] });
  });
  it("recovers from malformed data and resets", () => {
    localStorage.setItem(PROGRESS_KEY, "not json");
    expect(loadProgress(localStorage, ["known"]).completedExerciseIds).toEqual([]);
    resetProgress(localStorage);
    expect(localStorage.getItem(PROGRESS_KEY)).toBeNull();
  });
});
