import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Loader } from "./Loader";

describe("Loader", () => {
  it("exposes a status role with a default accessible label", () => {
    render(<Loader />);
    const loader = screen.getByRole("status", { name: "Loading" });
    expect(loader).toHaveClass("loading", "loading-spinner", "loading-md");
  });

  it("takes a custom label", () => {
    render(<Loader label="Fetching results" />);
    expect(screen.getByRole("status", { name: "Fetching results" })).toBeInTheDocument();
  });

  it.each([
    ["xs", "loading-xs"],
    ["xl", "loading-xl"],
  ] as const)("applies the %s size class", (size, expected) => {
    render(<Loader size={size} />);
    expect(screen.getByRole("status")).toHaveClass(expected);
  });

  it("merges className and forwards extra props", () => {
    render(<Loader className="text-primary" data-testid="loader" />);
    expect(screen.getByTestId("loader")).toHaveClass("loading", "text-primary");
  });
});
