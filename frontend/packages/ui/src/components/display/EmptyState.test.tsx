import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { EmptyState } from "./EmptyState";

describe("EmptyState", () => {
  it("renders the icon, title, and description", () => {
    render(
      <EmptyState
        icon={<span data-testid="icon" />}
        title="No results"
        description="Try a different search."
      />,
    );

    expect(screen.getByTestId("icon")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: "No results" })).toBeInTheDocument();
    expect(screen.getByText("Try a different search.")).toBeInTheDocument();
  });

  it("falls back to children for the description", () => {
    render(<EmptyState title="No results">Nothing here yet.</EmptyState>);
    expect(screen.getByText("Nothing here yet.")).toBeInTheDocument();
  });

  it("prefers description over children when both are given", () => {
    render(<EmptyState description="Wins">Loses</EmptyState>);
    expect(screen.getByText("Wins")).toBeInTheDocument();
    expect(screen.queryByText("Loses")).not.toBeInTheDocument();
  });

  it("renders nothing but the panel when no content is passed", () => {
    const { container } = render(<EmptyState />);
    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
    expect(container.firstChild).toHaveClass("border-dashed");
  });

  it("renders the action slot", () => {
    render(<EmptyState title="No results" action={<button type="button">Reset</button>} />);
    expect(screen.getByRole("button", { name: "Reset" })).toBeInTheDocument();
  });

  it.each([
    ["sm", "p-6"],
    ["md", "p-10"],
    ["lg", "p-16"],
  ] as const)("applies the %s padding scale", (size, expected) => {
    const { container } = render(<EmptyState size={size} title="x" />);
    expect(container.firstChild).toHaveClass(expected);
  });

  it("merges className and forwards extra props to the root", () => {
    render(<EmptyState title="x" className="mt-8" data-testid="empty" />);
    expect(screen.getByTestId("empty")).toHaveClass("mt-8", "border-dashed");
  });
});
