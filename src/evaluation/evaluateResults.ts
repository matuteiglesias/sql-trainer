import type { QueryResult, QueryValue } from "../types/query";

export type EvaluationOptions = { rowOrder: "strict" | "ignore"; numericTolerance: number };
export type EvaluationVerdict =
  | { status: "pass" }
  | { status: "fail"; reason: "column-count" | "column-names" | "row-count" | "row-values"; message: string };

function cellsEqual(left: QueryValue, right: QueryValue, tolerance: number): boolean {
  if (typeof left === "number" && typeof right === "number") return Math.abs(left - right) <= tolerance;
  return left === right;
}

function rowsEqual(left: QueryValue[], right: QueryValue[], tolerance: number): boolean {
  return left.length === right.length && left.every((cell, index) => cellsEqual(cell, right[index], tolerance));
}

function unorderedRowsEqual(actual: QueryValue[][], expected: QueryValue[][], tolerance: number): boolean {
  const unmatched = [...expected];
  return actual.every((row) => {
    const match = unmatched.findIndex((candidate) => rowsEqual(row, candidate, tolerance));
    if (match < 0) return false;
    unmatched.splice(match, 1);
    return true;
  }) && unmatched.length === 0;
}

export function evaluateResults(actual: QueryResult, expected: QueryResult, options: EvaluationOptions): EvaluationVerdict {
  if (actual.columns.length !== expected.columns.length) {
    return { status: "fail", reason: "column-count", message: `Expected ${expected.columns.length} columns but received ${actual.columns.length}.` };
  }
  if (actual.columns.some((column, index) => column !== expected.columns[index])) {
    return { status: "fail", reason: "column-names", message: "Column names or order do not match the expected result." };
  }
  if (actual.rows.length !== expected.rows.length) {
    return { status: "fail", reason: "row-count", message: `Expected ${expected.rows.length} rows but received ${actual.rows.length}.` };
  }
  const equal = options.rowOrder === "strict"
    ? actual.rows.every((row, index) => rowsEqual(row, expected.rows[index], options.numericTolerance))
    : unorderedRowsEqual(actual.rows, expected.rows, options.numericTolerance);
  return equal ? { status: "pass" } : { status: "fail", reason: "row-values", message: "Result rows differ from the expected result." };
}
