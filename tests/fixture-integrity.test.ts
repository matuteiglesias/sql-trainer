import { execFileSync } from "node:child_process";
import { describe, expect, it } from "vitest";

describe("frozen fixture", () => {
  it("contains the database and exactly five parseable indexed exercises", () => {
    expect(() => execFileSync(process.execPath, ["scripts/check-fixtures.mjs"])).not.toThrow();
  });
});
