import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { RangeField } from "./RangeField";

describe("RangeField", () => {
  it("renders a slider associated with its label", () => {
    render(<RangeField label="Volume" />);
    const slider = screen.getByRole("slider");
    expect(slider).toHaveAttribute("type", "range");
    expect(slider).toHaveClass("range", "range-primary", "range-md");
  });

  it("passes min, max, and step through", () => {
    render(<RangeField label="Volume" min={0} max={50} step={5} />);

    const slider = screen.getByRole("slider");
    expect(slider).toHaveAttribute("min", "0");
    expect(slider).toHaveAttribute("max", "50");
    expect(slider).toHaveAttribute("step", "5");
  });

  it("shows the error message", () => {
    render(<RangeField label="Volume" error="Too loud" />);
    expect(screen.getByText("Too loud")).toHaveClass("text-error");
  });

  it("shows the hint when there is no error", () => {
    render(<RangeField label="Volume" hint="Drag to adjust" />);
    expect(screen.getByText("Drag to adjust")).toBeInTheDocument();
  });

  it.each([
    ["xs", "range-xs"],
    ["xl", "range-xl"],
  ] as const)("applies the %s size class", (size, expected) => {
    render(<RangeField size={size} />);
    expect(screen.getByRole("slider")).toHaveClass(expected);
  });

  it("respects a controlled value", () => {
    render(<RangeField label="Volume" value={30} onChange={() => {}} />);
    expect(screen.getByRole("slider")).toHaveValue("30");
  });

  it("merges className and containerClassName", () => {
    const { container } = render(<RangeField className="mt-1" containerClassName="w-64" />);
    expect(screen.getByRole("slider")).toHaveClass("range", "mt-1");
    expect(container.querySelector("fieldset")).toHaveClass("fieldset", "w-64");
  });
});
