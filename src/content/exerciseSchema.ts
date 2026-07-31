import { z } from "zod";

export const evaluationSchema = z.object({
  columnOrder: z.literal("strict"),
  rowOrder: z.enum(["ignore", "strict"]),
  duplicateRows: z.literal("preserve"),
  numericTolerance: z.number().finite().nonnegative(),
}).strict();

export const exerciseSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  datasetId: z.literal("hospital-v0.1"),
  title: z.string().min(1),
  difficulty: z.literal("easy"),
  prompt: z.string().min(1),
  concepts: z.array(z.string().min(1)).min(1),
  starterSql: z.string().min(1),
  referenceSql: z.string().min(1),
  evaluation: evaluationSchema,
  hint: z.string().min(1),
  explanation: z.string().min(1),
}).strict();

export const exerciseIndexSchema = z.object({
  datasetId: z.literal("hospital-v0.1"),
  exerciseFiles: z.array(z.string().regex(/^[a-z0-9-]+\.json$/)).length(5),
}).strict();

export type Exercise = z.infer<typeof exerciseSchema>;
export type ExerciseIndex = z.infer<typeof exerciseIndexSchema>;
