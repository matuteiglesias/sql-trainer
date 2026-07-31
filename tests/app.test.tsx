import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { App } from "../src/App";

describe("App", () => {
  it("identifies the trainer and its SQL dialect", () => {
    render(<App />);

    expect(screen.getByRole("heading", { name: "SQL Static Trainer" })).toBeVisible();
    expect(screen.getByText("SQLite")).toBeVisible();
  });
});
