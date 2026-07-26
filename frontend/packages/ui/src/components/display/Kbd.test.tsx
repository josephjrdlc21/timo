import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Kbd } from "./Kbd";

describe("Kbd", () => {
  it("renders its label as a semantic <kbd> at the default size", () => {
    const { container } = render(<Kbd label="Ctrl" />);
    const kbd = container.querySelector("kbd");
    expect(kbd).toHaveTextContent("Ctrl");
    expect(kbd).toHaveClass("kbd", "kbd-md");
  });

  it("falls back to children when no label is passed", () => {
    render(<Kbd>K</Kbd>);
    expect(screen.getByText("K")).toBeInTheDocument();
  });

  it.each([
    ["xs", "kbd-xs"],
    ["xl", "kbd-xl"],
  ] as const)("applies the %s size class", (size, expected) => {
    render(<Kbd label="K" size={size} />);
    expect(screen.getByText("K")).toHaveClass(expected);
  });

  it("merges className and forwards extra props", () => {
    render(<Kbd label="K" className="ml-1" data-testid="kbd" />);
    expect(screen.getByTestId("kbd")).toHaveClass("kbd", "ml-1");
  });
});
