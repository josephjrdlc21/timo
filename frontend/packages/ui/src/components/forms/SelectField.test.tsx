import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { SelectField } from "./SelectField";

const OPTIONS = [
  { label: "Philippines", value: "ph" },
  { label: "Singapore", value: "sg" },
  { label: "Japan", value: "jp", disabled: true },
];

describe("SelectField", () => {
  it("renders the options from the array and links the label", () => {
    render(<SelectField label="Country" options={OPTIONS} />);

    const select = screen.getByLabelText("Country");
    expect(select.tagName).toBe("SELECT");
    expect(screen.getAllByRole("option")).toHaveLength(3);
    expect(screen.getByRole("option", { name: "Japan" })).toBeDisabled();
  });

  it("renders a disabled placeholder first, with an empty value", () => {
    render(<SelectField label="Country" placeholder="Pick one" options={OPTIONS} />);

    const placeholder = screen.getByRole("option", { name: "Pick one" });
    expect(placeholder).toBeDisabled();
    expect(placeholder).toHaveValue("");
    expect(screen.getAllByRole("option")[0]).toBe(placeholder);
  });

  it("accepts <option> children as an alternative to the options array", () => {
    render(
      <SelectField label="Country">
        <option value="ph">Philippines</option>
      </SelectField>,
    );
    expect(screen.getByRole("option", { name: "Philippines" })).toBeInTheDocument();
  });

  it("reports a selection", async () => {
    const onChange = vi.fn();
    render(<SelectField label="Country" options={OPTIONS} onChange={onChange} />);

    await userEvent.selectOptions(screen.getByLabelText("Country"), "sg");

    expect(onChange).toHaveBeenCalledOnce();
    expect(screen.getByLabelText("Country")).toHaveValue("sg");
  });

  it("shows the error, flags aria-invalid, and applies the error style", () => {
    const { container } = render(
      <SelectField label="Country" options={OPTIONS} error="Required" />,
    );

    expect(screen.getByLabelText("Country")).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByText("Required")).toHaveClass("text-error");
    expect(container.querySelector("label.select")).toHaveClass("select-error");
  });

  it("shows the hint when there is no error", () => {
    render(<SelectField label="Country" options={OPTIONS} hint="Where you are based" />);
    expect(screen.getByText("Where you are based")).toBeInTheDocument();
  });

  it("renders a leading icon", () => {
    render(<SelectField label="Country" options={OPTIONS} startIcon={<span data-testid="i" />} />);
    expect(screen.getByTestId("i")).toBeInTheDocument();
  });

  it.each([
    ["xs", "select-xs"],
    ["lg", "select-lg"],
  ] as const)("applies the %s size class", (size, expected) => {
    const { container } = render(<SelectField options={OPTIONS} size={size} />);
    expect(container.querySelector("label.select")).toHaveClass(expected);
  });

  it("spreads extra props onto the select", () => {
    render(<SelectField label="Country" options={OPTIONS} name="country" disabled />);
    const select = screen.getByLabelText("Country");
    expect(select).toHaveAttribute("name", "country");
    expect(select).toBeDisabled();
  });
});
