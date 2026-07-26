import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { NumberField } from "./NumberField";

describe("NumberField", () => {
  it("renders a numeric input associated with its label", () => {
    render(<NumberField label="Quantity" />);
    expect(screen.getByLabelText("Quantity")).toHaveAttribute("type", "number");
  });

  it("passes min, max, and step through", () => {
    render(<NumberField label="Quantity" min={1} max={10} step={2} />);

    const input = screen.getByLabelText("Quantity");
    expect(input).toHaveAttribute("min", "1");
    expect(input).toHaveAttribute("max", "10");
    expect(input).toHaveAttribute("step", "2");
  });

  it("accepts numeric typing", async () => {
    render(<NumberField label="Quantity" />);
    await userEvent.type(screen.getByLabelText("Quantity"), "42");
    expect(screen.getByLabelText("Quantity")).toHaveValue(42);
  });

  it("shows the error, flags aria-invalid, and applies the error style", () => {
    const { container } = render(<NumberField label="Quantity" error="Out of range" />);

    expect(screen.getByLabelText("Quantity")).toHaveAttribute("aria-invalid", "true");
    expect(container.querySelector("label.input")).toHaveClass("input-error");
    expect(screen.getByText("Out of range")).toHaveClass("text-error");
  });

  it("shows the hint when there is no error", () => {
    render(<NumberField label="Quantity" hint="Between 1 and 10" />);
    expect(screen.getByText("Between 1 and 10")).toBeInTheDocument();
  });

  it("renders a leading icon", () => {
    render(<NumberField label="Quantity" startIcon={<span data-testid="icon" />} />);
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });

  it.each([
    ["sm", "input-sm"],
    ["lg", "input-lg"],
  ] as const)("applies the %s size class", (size, expected) => {
    const { container } = render(<NumberField size={size} />);
    expect(container.querySelector("label.input")).toHaveClass(expected);
  });
});
