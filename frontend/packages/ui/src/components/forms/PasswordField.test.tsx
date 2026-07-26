import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { PasswordField } from "./PasswordField";

describe("PasswordField", () => {
  it("masks the value by default", () => {
    render(<PasswordField label="Password" />);
    expect(screen.getByLabelText("Password")).toHaveAttribute("type", "password");
  });

  describe("show / hide toggle", () => {
    it("reveals and re-masks the value, keeping its label and aria-pressed in sync", async () => {
      render(<PasswordField label="Password" />);
      const input = screen.getByLabelText("Password");

      const show = screen.getByRole("button", { name: "Show password" });
      expect(show).toHaveAttribute("aria-pressed", "false");

      await userEvent.click(show);
      expect(input).toHaveAttribute("type", "text");

      const hide = screen.getByRole("button", { name: "Hide password" });
      expect(hide).toHaveAttribute("aria-pressed", "true");

      await userEvent.click(hide);
      expect(input).toHaveAttribute("type", "password");
    });

    it("stays out of the tab order so it never sits between fields", () => {
      render(<PasswordField label="Password" />);
      expect(screen.getByRole("button", { name: "Show password" })).toHaveAttribute(
        "tabindex",
        "-1",
      );
    });

    it("can be hidden entirely", () => {
      render(<PasswordField label="Password" hideToggle />);
      expect(screen.queryByRole("button", { name: /password/i })).not.toBeInTheDocument();
    });
  });

  it("shows the error, flags aria-invalid, and applies the error style", () => {
    const { container } = render(<PasswordField label="Password" error="Too short" />);

    expect(screen.getByLabelText("Password")).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByText("Too short")).toHaveClass("text-error");
    expect(container.querySelector("label.input")).toHaveClass("input-error");
  });

  it("shows the hint when there is no error", () => {
    render(<PasswordField label="Password" hint="At least 8 characters" />);
    expect(screen.getByText("At least 8 characters")).toBeInTheDocument();
  });

  it("renders a leading icon", () => {
    render(<PasswordField label="Password" startIcon={<span data-testid="icon" />} />);
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });

  it.each([
    ["sm", "input-sm"],
    ["lg", "input-lg"],
  ] as const)("applies the %s size class", (size, expected) => {
    const { container } = render(<PasswordField size={size} />);
    expect(container.querySelector("label.input")).toHaveClass(expected);
  });

  it("accepts typing", async () => {
    render(<PasswordField label="Password" />);
    await userEvent.type(screen.getByLabelText("Password"), "secret");
    expect(screen.getByLabelText("Password")).toHaveValue("secret");
  });
});
