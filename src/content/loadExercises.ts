import { ZodError } from "zod";
import { exerciseIndexSchema, exerciseSchema, type Exercise } from "./exerciseSchema";

export type ContentLoadErrorKind = "network" | "invalid-index" | "invalid-exercise" | "duplicate-id";

export class ContentLoadError extends Error {
  constructor(
    public readonly kind: ContentLoadErrorKind,
    message: string,
    public readonly resource?: string,
  ) {
    super(message);
    this.name = "ContentLoadError";
  }
}

async function fetchJson(fetcher: typeof fetch, url: string): Promise<unknown> {
  let response: Response;
  try {
    response = await fetcher(url);
  } catch {
    throw new ContentLoadError("network", `Unable to load exercise content: ${url}.`, url);
  }
  if (!response.ok) {
    throw new ContentLoadError("network", `Unable to load exercise content (${response.status}): ${url}.`, url);
  }
  try {
    return await response.json();
  } catch {
    throw new ContentLoadError("network", `Exercise content is not valid JSON: ${url}.`, url);
  }
}

function validationMessage(error: ZodError): string {
  const issue = error.issues[0];
  return issue ? `${issue.path.join(".") || "content"}: ${issue.message}` : "Content validation failed.";
}

export async function loadExercises(
  baseUrl = "/content/exercises",
  fetcher: typeof fetch = fetch,
): Promise<Exercise[]> {
  const root = baseUrl.replace(/\/$/, "");
  const indexUrl = `${root}/index.json`;
  const rawIndex = await fetchJson(fetcher, indexUrl);
  const parsedIndex = exerciseIndexSchema.safeParse(rawIndex);
  if (!parsedIndex.success) {
    throw new ContentLoadError("invalid-index", `Invalid exercise index: ${validationMessage(parsedIndex.error)}`, indexUrl);
  }

  const { exerciseFiles } = parsedIndex.data;
  if (new Set(exerciseFiles).size !== exerciseFiles.length) {
    throw new ContentLoadError("invalid-index", "Exercise index contains duplicate file paths.", indexUrl);
  }

  const exercises = await Promise.all(exerciseFiles.map(async (filename) => {
    const url = `${root}/${filename}`;
    const parsed = exerciseSchema.safeParse(await fetchJson(fetcher, url));
    if (!parsed.success) {
      throw new ContentLoadError("invalid-exercise", `Invalid exercise ${filename}: ${validationMessage(parsed.error)}`, url);
    }
    return parsed.data;
  }));

  const seen = new Set<string>();
  for (const exercise of exercises) {
    if (seen.has(exercise.id)) {
      throw new ContentLoadError("duplicate-id", `Duplicate exercise ID: ${exercise.id}.`);
    }
    seen.add(exercise.id);
  }
  return exercises;
}
