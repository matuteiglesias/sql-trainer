export const PROGRESS_KEY = "sql-static-trainer:progress:v1";
export type Progress = { schemaVersion: 1; completedExerciseIds: string[] };

export function loadProgress(storage: Pick<Storage, "getItem">, validIds: readonly string[]): Progress {
  try {
    const value: unknown = JSON.parse(storage.getItem(PROGRESS_KEY) ?? "null");
    if (!value || typeof value !== "object" || !("schemaVersion" in value) || value.schemaVersion !== 1 ||
      !("completedExerciseIds" in value) || !Array.isArray(value.completedExerciseIds)) return emptyProgress();
    const allowed = new Set(validIds);
    return { schemaVersion: 1, completedExerciseIds: [...new Set(value.completedExerciseIds.filter((id): id is string => typeof id === "string" && allowed.has(id)))] };
  } catch { return emptyProgress(); }
}

export function saveProgress(storage: Pick<Storage, "setItem">, completedExerciseIds: Iterable<string>): void {
  storage.setItem(PROGRESS_KEY, JSON.stringify({ schemaVersion: 1, completedExerciseIds: [...completedExerciseIds] } satisfies Progress));
}

export function resetProgress(storage: Pick<Storage, "removeItem">): void { storage.removeItem(PROGRESS_KEY); }
export function emptyProgress(): Progress { return { schemaVersion: 1, completedExerciseIds: [] }; }
