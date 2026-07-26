import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { InputField } from "./InputField";

describe("InputField", () => {
  it("associates the label with the input via a generated id", () => {
    render(<InputField label="Email" />);
    expect(screen.getByLabelText("Email")).toHaveAttribute("type", "text");
  });

  it("uses a caller-supplied id over the generated one", () => {
    render(<InputField label="Email" id="email" />);
    expect(screen.getByLabelText("Email")).toHaveAttribute("id", "email");
  });

  it("renders a bare input when there is no label", () => {
    render(<InputField placeholder="Search" />);
    expect(screen.getByPlaceholderText("Search")).toBeInTheDocument();
  });

  it("shows the hint when there is no error", () => {
    render(<InputField label="Email" hint="We never share it." />);
    expect(screen.getByText("We never share it.")).toBeInTheDocument();
  });

  describe("error state", () => {
    it("shows the message, flags aria-invalid, and applies the error style", () => {
      const { container } = render(<InputField label="Email" error="Required" />);

      expect(screen.getByLabelText("Email")).toHaveAttribute("aria-invalid", "true");
      expect(screen.getByText("Required")).toHaveClass("text-error");
      expect(container.querySelector("label.input")).toHaveClass("input-error");
    });

    it("takes precedence over the hint", () => {
      render(<InputField label="Email" error="Required" hint="We never share it." />);
      expect(screen.getByText("Required")).toBeInTheDocument();
      expect(screen.queryByText("We never share it.")).not.toBeInTheDocument();
    });

    it("leaves aria-invalid off when valid", () => {
      render(<InputField label="Email" />);
      expect(screen.getByLabelText("Email")).not.toHaveAttribute("aria-invalid");
    });
  });

  it("renders a leading icon", () => {
    render(<InputField label="Email" startIcon={<span data-testid="icon" />} />);
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });

  it.each([
    ["xs", "input-xs"],
    ["xl", "input-xl"],
  ] as const)("applies the %s size class", (size, expected) => {
    const { container } = render(<InputField size={size} />);
    expect(container.querySelector("label.input")).toHaveClass(expected);
  });

  it("accepts typing and reports it upward", async () => {
    const onChange = vi.fn();
    render(<InputField label="Email" onChange={onChange} />);

    await userEvent.type(screen.getByLabelText("Email"), "hi");

    expect(onChange).toHaveBeenCalledTimes(2);
    expect(screen.getByLabelText("Email")).toHaveValue("hi");
  });

  it("honours a type override", () => {
    render(<InputField label="Email" type="email" />);
    expect(screen.getByLabelText("Email")).toHaveAttribute("type", "email");
  });

  it("forwards the ref to the underlying input, which is what register() needs", () => {
    const ref = createRef<HTMLInputElement>();
    render(<InputField label="Email" ref={ref} />);
    expect(ref.current).toBe(screen.getByLabelText("Email"));
  });

  it("spreads extra props onto the input and disables it", () => {
    render(<InputField label="Email" name="email" disabled />);
    const input = screen.getByLabelText("Email");
    expect(input).toHaveAttribute("name", "email");
    expect(input).toBeDisabled();
  });

  it("merges className onto the field and containerClassName onto the fieldset", () => {
    const { container } = render(<InputField className="pl-8" containerClassName="w-64" />);
    expect(container.querySelector("fieldset")).toHaveClass("fieldset", "w-64");
    expect(container.querySelector("label.input")).toHaveClass("input", "pl-8");
  });
});
