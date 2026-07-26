import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Brand } from "./Brand";

describe("Brand", () => {
  it("renders the mark and the wordmark", () => {
    render(<Brand name="Timo" />);

    expect(screen.getByRole("img", { name: "Timo" })).toBeInTheDocument();
    expect(screen.getByText("Timo")).toBeInTheDocument();
  });

  it("drops the wordmark when collapsed, keeping the mark as the accessible name", () => {
    render(<Brand name="Timo" collapsed />);

    expect(screen.getByRole("img", { name: "Timo" })).toBeInTheDocument();
    // Only the alt text is left — no visible wordmark on the icon rail.
    expect(screen.queryByText("Timo")).not.toBeInTheDocument();
  });
});
