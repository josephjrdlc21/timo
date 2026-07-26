import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DateField } from "./DateField";

describe("DateField", () => {
  it("defaults to a date picker associated with its label", () => {
    const { container } = render(<DateField label="Due" />);
    const input = container.querySelector("input");
    expect(input).toHaveAttribute("type", "date");
    expect(container.querySelector("label.fieldset-legend")).toHaveTextContent("Due");
  });

  it.each(["datetime-local", "month", "week", "time"] as const)(
    "renders the %s picker when asked",
    (type) => {
      const { container } = render(<DateField label="Due" type={type} />);
      expect(container.querySelector("input")).toHaveAttribute("type", type);
    },
  );

  it("shows the error, flags aria-invalid, and applies the error style", () => {
    const { container } = render(<DateField label="Due" error="Pick a date" />);

    expect(container.querySelector("input")).toHaveAttribute("aria-invalid", "true");
    expect(container.querySelector("label.input")).toHaveClass("input-error");
    expect(screen.getByText("Pick a date")).toHaveClass("text-error");
  });

  it("shows the hint when there is no error", () => {
    render(<DateField label="Due" hint="Any time this month" />);
    expect(screen.getByText("Any time this month")).toBeInTheDocument();
  });

  it("renders a leading icon", () => {
    render(<DateField label="Due" startIcon={<span data-testid="icon" />} />);
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });

  it.each([
    ["xs", "input-xs"],
    ["xl", "input-xl"],
  ] as const)("applies the %s size class", (size, expected) => {
    const { container } = render(<DateField size={size} />);
    expect(container.querySelector("label.input")).toHaveClass(expected);
  });

  it("spreads extra props onto the input", () => {
    const { container } = render(<DateField label="Due" name="due" min="2026-01-01" />);
    const input = container.querySelector("input");
    expect(input).toHaveAttribute("name", "due");
    expect(input).toHaveAttribute("min", "2026-01-01");
  });
});
