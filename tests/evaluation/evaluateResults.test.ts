import { describe, expect, it } from "vitest";
import { evaluateResults } from "../../src/evaluation";
const options = { rowOrder: "ignore" as const, numericTolerance: 0.01 };
const result = (columns: string[], rows: (string | number | null)[][]) => ({ columns, rows });

describe("evaluateResults", () => {
  it("compares columns strictly", () => {
    expect(evaluateResults(result(["a"], []), result(["a", "b"], []), options)).toMatchObject({ reason: "column-count" });
    expect(evaluateResults(result(["alias"], []), result(["a"], []), options)).toMatchObject({ reason: "column-names" });
  });
  it("preserves duplicate multiplicity while ignoring order", () => {
    expect(evaluateResults(result(["a"], [[2], [1]]), result(["a"], [[1], [2]]), options)).toEqual({ status: "pass" });
    expect(evaluateResults(result(["a"], [[1], [1]]), result(["a"], [[1], [2]]), options)).toMatchObject({ reason: "row-values" });
  });
  it("supports strict ordering", () => {
    expect(evaluateResults(result(["a"], [[2], [1]]), result(["a"], [[1], [2]]), { ...options, rowOrder: "strict" })).toMatchObject({ reason: "row-values" });
  });
  it("distinguishes null, empty strings, and row counts", () => {
    expect(evaluateResults(result(["a"], [[null]]), result(["a"], [[""]]), options)).toMatchObject({ reason: "row-values" });
    expect(evaluateResults(result(["a"], []), result(["a"], [[1]]), options)).toMatchObject({ reason: "row-count" });
  });
  it("applies numeric tolerance inclusively", () => {
    expect(evaluateResults(result(["a"], [[1.005]]), result(["a"], [[1]]), options)).toEqual({ status: "pass" });
    expect(evaluateResults(result(["a"], [[1.02]]), result(["a"], [[1]]), options)).toMatchObject({ reason: "row-values" });
  });
});
