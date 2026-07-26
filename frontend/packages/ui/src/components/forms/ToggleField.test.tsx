import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ToggleField } from "./ToggleField";

describe("ToggleField", () => {
  it("renders as a checkbox under the hood, labelled by its text", () => {
    render(<ToggleField label="Notifications" />);
    const toggle = screen.getByRole("checkbox", { name: "Notifications" });
    expect(toggle).not.toBeChecked();
    expect(toggle).toHaveClass("toggle", "toggle-primary", "toggle-md");
  });

  it("toggles on click and reports the change", async () => {
    const onChange = vi.fn();
    render(<ToggleField label="Notifications" onChange={onChange} />);

    await userEvent.click(screen.getByRole("checkbox"));

    expect(screen.getByRole("checkbox")).toBeChecked();
    expect(onChange).toHaveBeenCalledOnce();
  });

  it("shows the error, flags aria-invalid, and applies the error style", () => {
    render(<ToggleField label="Notifications" error="Pick one" />);

    const toggle = screen.getByRole("checkbox");
    expect(toggle).toHaveAttribute("aria-invalid", "true");
    expect(toggle).toHaveClass("toggle-error");
    expect(screen.getByText("Pick one")).toHaveClass("text-error");
  });

  it("shows the hint when there is no error", () => {
    render(<ToggleField label="Notifications" hint="Email and push" />);
    expect(screen.getByText("Email and push")).toBeInTheDocument();
  });

  it.each([
    ["xs", "toggle-xs"],
    ["xl", "toggle-xl"],
  ] as const)("applies the %s size class", (size, expected) => {
    render(<ToggleField size={size} />);
    expect(screen.getByRole("checkbox")).toHaveClass(expected);
  });

  it("blocks interaction when disabled", async () => {
    const onChange = vi.fn();
    render(<ToggleField label="Notifications" disabled onChange={onChange} />);

    await userEvent.click(screen.getByRole("checkbox"));

    expect(onChange).not.toHaveBeenCalled();
  });

  it("respects a controlled checked value", () => {
    render(<ToggleField label="Notifications" checked readOnly />);
    expect(screen.getByRole("checkbox")).toBeChecked();
  });
});
