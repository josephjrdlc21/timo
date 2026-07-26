import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button } from "./Button";

describe("Button", () => {
  it("renders its label and defaults to type=button so it never submits by accident", () => {
    render(<Button label="Save" />);
    const button = screen.getByRole("button", { name: "Save" });
    expect(button).toHaveAttribute("type", "button");
    expect(button).toHaveClass("btn", "btn-md");
  });

  it("falls back to children when no label is passed", () => {
    render(<Button>Cancel</Button>);
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
  });

  it.each([
    ["primary", "btn-primary"],
    ["error", "btn-error"],
    ["ghost", "btn-ghost"],
  ] as const)("applies the %s variant class", (variant, expected) => {
    render(<Button label="Go" variant={variant} />);
    expect(screen.getByRole("button")).toHaveClass(expected);
  });

  it.each([
    ["xs", "btn-xs"],
    ["lg", "btn-lg"],
  ] as const)("applies the %s size class", (size, expected) => {
    render(<Button label="Go" size={size} />);
    expect(screen.getByRole("button")).toHaveClass(expected);
  });

  it("applies the style flags", () => {
    render(<Button label="Go" outline soft block wide />);
    expect(screen.getByRole("button")).toHaveClass(
      "btn-outline",
      "btn-soft",
      "btn-block",
      "btn-wide",
    );
  });

  it("merges an incoming className instead of overriding the base classes", () => {
    render(<Button label="Go" className="mt-4" />);
    expect(screen.getByRole("button")).toHaveClass("btn", "mt-4");
  });

  it("swaps the start icon for a spinner and goes inert while loading", async () => {
    const onClick = vi.fn();
    render(<Button label="Go" loading startIcon={<span data-testid="icon" />} onClick={onClick} />);

    const button = screen.getByRole("button", { name: "Go" });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");
    expect(screen.queryByTestId("icon")).not.toBeInTheDocument();

    await userEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("renders both icons when idle", () => {
    render(
      <Button
        label="Go"
        startIcon={<span data-testid="start" />}
        endIcon={<span data-testid="end" />}
      />,
    );
    expect(screen.getByTestId("start")).toBeInTheDocument();
    expect(screen.getByTestId("end")).toBeInTheDocument();
    expect(screen.getByRole("button")).not.toHaveAttribute("aria-busy");
  });

  it("blocks clicks when disabled", async () => {
    const onClick = vi.fn();
    render(<Button label="Go" disabled onClick={onClick} />);

    await userEvent.click(screen.getByRole("button"));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("fires onClick when idle and enabled", async () => {
    const onClick = vi.fn();
    render(<Button label="Go" onClick={onClick} />);

    await userEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledOnce();
  });
});
