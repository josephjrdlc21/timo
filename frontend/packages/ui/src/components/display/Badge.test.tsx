import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Badge } from "./Badge";

describe("Badge", () => {
  it("renders its label at the default size", () => {
    render(<Badge label="New" />);
    const badge = screen.getByText("New");
    expect(badge).toHaveClass("badge", "badge-md");
  });

  it("falls back to children when no label is passed", () => {
    render(<Badge>Beta</Badge>);
    expect(screen.getByText("Beta")).toBeInTheDocument();
  });

  it.each([
    ["primary", "badge-primary"],
    ["error", "badge-error"],
    ["ghost", "badge-ghost"],
  ] as const)("applies the %s variant class", (variant, expected) => {
    render(<Badge label="x" variant={variant} />);
    expect(screen.getByText("x")).toHaveClass(expected);
  });

  it.each([
    ["xs", "badge-xs"],
    ["xl", "badge-xl"],
  ] as const)("applies the %s size class", (size, expected) => {
    render(<Badge label="x" size={size} />);
    expect(screen.getByText("x")).toHaveClass(expected);
  });

  it("applies the outline, soft, and dash styles", () => {
    render(<Badge label="x" outline soft dash />);
    expect(screen.getByText("x")).toHaveClass("badge-outline", "badge-soft", "badge-dash");
  });

  it("renders a leading icon", () => {
    render(<Badge label="x" icon={<span data-testid="icon" />} />);
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });

  it("merges className and forwards extra props to the root", () => {
    render(<Badge label="x" className="ml-2" data-testid="badge" title="hi" />);
    const badge = screen.getByTestId("badge");
    expect(badge).toHaveClass("badge", "ml-2");
    expect(badge).toHaveAttribute("title", "hi");
  });
});
