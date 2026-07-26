import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { RadioField } from "./RadioField";

const OPTIONS = [
  { label: "Free", value: "free" },
  { label: "Pro", value: "pro" },
  { label: "Enterprise", value: "ent", disabled: true },
];

describe("RadioField", () => {
  it("renders one radio per option, each carrying its value", () => {
    render(<RadioField label="Plan" name="plan" options={OPTIONS} />);

    const radios = screen.getAllByRole("radio");
    expect(radios).toHaveLength(3);
    expect(screen.getByRole("radio", { name: "Free" })).toHaveAttribute("value", "free");
    expect(screen.getByRole("radio", { name: "Enterprise" })).toBeDisabled();
  });

  it("renders the group label as a legend", () => {
    render(<RadioField label="Plan" options={OPTIONS} />);
    expect(screen.getByText("Plan").tagName).toBe("LEGEND");
  });

  it("selects one option at a time within the group", async () => {
    const onChange = vi.fn();
    render(<RadioField name="plan" options={OPTIONS} onChange={onChange} />);

    await userEvent.click(screen.getByRole("radio", { name: "Pro" }));

    expect(screen.getByRole("radio", { name: "Pro" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "Free" })).not.toBeChecked();
    expect(onChange).toHaveBeenCalledOnce();
  });

  it("ignores clicks on a disabled option", async () => {
    const onChange = vi.fn();
    render(<RadioField name="plan" options={OPTIONS} onChange={onChange} />);

    await userEvent.click(screen.getByRole("radio", { name: "Enterprise" }));

    expect(onChange).not.toHaveBeenCalled();
  });

  it("shows the error, flags aria-invalid on every radio, and applies the error style", () => {
    render(<RadioField options={OPTIONS} error="Pick a plan" />);

    for (const radio of screen.getAllByRole("radio")) {
      expect(radio).toHaveAttribute("aria-invalid", "true");
      expect(radio).toHaveClass("radio-error");
    }
    expect(screen.getByText("Pick a plan")).toHaveClass("text-error");
  });

  it("shows the hint when there is no error", () => {
    render(<RadioField options={OPTIONS} hint="Change any time" />);
    expect(screen.getByText("Change any time")).toBeInTheDocument();
  });

  it.each([
    ["xs", "radio-xs"],
    ["lg", "radio-lg"],
  ] as const)("applies the %s size class", (size, expected) => {
    render(<RadioField options={OPTIONS} size={size} />);
    expect(screen.getAllByRole("radio")[0]).toHaveClass(expected);
  });

  it("switches between stacked and inline layout", () => {
    const { container, rerender } = render(<RadioField options={OPTIONS} />);
    expect(container.querySelector("fieldset > div")).toHaveClass("flex-col");

    rerender(<RadioField options={OPTIONS} inline />);
    expect(container.querySelector("fieldset > div")).toHaveClass("flex-row");
  });
});
