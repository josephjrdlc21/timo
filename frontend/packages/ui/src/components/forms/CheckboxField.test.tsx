import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { CheckboxField } from "./CheckboxField";

describe("CheckboxField", () => {
  it("renders an unchecked checkbox labelled by its text", () => {
    render(<CheckboxField label="I agree" />);
    const box = screen.getByRole("checkbox", { name: "I agree" });
    expect(box).not.toBeChecked();
    expect(box).toHaveClass("checkbox", "checkbox-primary", "checkbox-md");
  });

  it("toggles on click and reports the change", async () => {
    const onChange = vi.fn();
    render(<CheckboxField label="I agree" onChange={onChange} />);

    await userEvent.click(screen.getByRole("checkbox"));

    expect(screen.getByRole("checkbox")).toBeChecked();
    expect(onChange).toHaveBeenCalledOnce();
  });

  it("toggles from the label text too", async () => {
    render(<CheckboxField label="I agree" />);
    await userEvent.click(screen.getByText("I agree"));
    expect(screen.getByRole("checkbox")).toBeChecked();
  });

  it("shows the error, flags aria-invalid, and applies the error style", () => {
    render(<CheckboxField label="I agree" error="You must accept" />);

    const box = screen.getByRole("checkbox");
    expect(box).toHaveAttribute("aria-invalid", "true");
    expect(box).toHaveClass("checkbox-error");
    expect(screen.getByText("You must accept")).toHaveClass("text-error");
  });

  it("shows the hint when there is no error", () => {
    render(<CheckboxField label="I agree" hint="Required to continue" />);
    expect(screen.getByText("Required to continue")).toBeInTheDocument();
  });

  it.each([
    ["xs", "checkbox-xs"],
    ["xl", "checkbox-xl"],
  ] as const)("applies the %s size class", (size, expected) => {
    render(<CheckboxField size={size} />);
    expect(screen.getByRole("checkbox")).toHaveClass(expected);
  });

  it("blocks interaction when disabled", async () => {
    const onChange = vi.fn();
    render(<CheckboxField label="I agree" disabled onChange={onChange} />);

    await userEvent.click(screen.getByRole("checkbox"));

    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByRole("checkbox")).not.toBeChecked();
  });

  it("merges className onto the control and containerClassName onto the fieldset", () => {
    const { container } = render(<CheckboxField className="mr-2" containerClassName="p-0" />);
    expect(screen.getByRole("checkbox")).toHaveClass("checkbox", "mr-2");
    expect(container.querySelector("fieldset")).toHaveClass("fieldset", "p-0");
  });
});
