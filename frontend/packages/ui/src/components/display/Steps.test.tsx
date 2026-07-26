import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Steps, type StepItem } from "./Steps";

const ITEMS: StepItem[] = [
  { id: "a", label: "Account" },
  { id: "b", label: "Billing" },
  { id: "c", label: "Done" },
];

describe("Steps", () => {
  it("renders every step, colouring only the first by default", () => {
    render(<Steps items={ITEMS} />);

    const steps = screen.getAllByRole("listitem");
    expect(steps).toHaveLength(3);
    expect(steps[0]).toHaveClass("step", "step-primary");
    expect(steps[1]).not.toHaveClass("step-primary");
  });

  it("colours every step at or before `current`", () => {
    render(<Steps items={ITEMS} current={1} />);

    const steps = screen.getAllByRole("listitem");
    expect(steps[0]).toHaveClass("step-primary");
    expect(steps[1]).toHaveClass("step-primary");
    expect(steps[2]).not.toHaveClass("step-primary");
  });

  it("colours nothing when current is -1", () => {
    render(<Steps items={ITEMS} current={-1} />);
    for (const step of screen.getAllByRole("listitem")) {
      expect(step).not.toHaveClass("step-primary");
    }
  });

  it("marks the active step with aria-current", () => {
    render(<Steps items={ITEMS} current={1} />);

    const steps = screen.getAllByRole("listitem");
    expect(steps[1]).toHaveAttribute("aria-current", "step");
    // Completed steps are coloured but are not the current one.
    expect(steps[0]).not.toHaveAttribute("aria-current");
  });

  it("applies the colour to completed steps", () => {
    render(<Steps items={ITEMS} color="success" current={0} />);
    expect(screen.getAllByRole("listitem")[0]).toHaveClass("step-success");
  });

  it("exposes a custom marker through data-content", () => {
    render(<Steps items={[{ id: "a", label: "Account", marker: "✓" }]} />);
    expect(screen.getByRole("listitem")).toHaveAttribute("data-content", "✓");
  });

  it("switches between horizontal and vertical layout", () => {
    const { container, rerender } = render(<Steps items={ITEMS} />);
    expect(container.firstChild).toHaveClass("steps-horizontal");

    rerender(<Steps items={ITEMS} vertical />);
    expect(container.firstChild).toHaveClass("steps-vertical");
  });

  it("merges className and forwards extra props to the root", () => {
    render(<Steps items={ITEMS} className="w-full" data-testid="steps" />);
    expect(screen.getByTestId("steps")).toHaveClass("steps", "w-full");
  });
});
