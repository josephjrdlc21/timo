import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Alert } from "./Alert";

describe("Alert", () => {
  it("renders the title and message with the alert role", () => {
    render(<Alert title="Heads up" message="Your trial ends soon." />);

    const alert = screen.getByRole("alert");
    expect(alert).toHaveClass("alert");
    expect(screen.getByRole("heading", { level: 3, name: "Heads up" })).toBeInTheDocument();
    expect(screen.getByText("Your trial ends soon.")).toBeInTheDocument();
  });

  it("falls back to children for the message", () => {
    render(<Alert>Body copy</Alert>);
    expect(screen.getByText("Body copy")).toBeInTheDocument();
  });

  it.each([
    ["info", "alert-info"],
    ["success", "alert-success"],
    ["warning", "alert-warning"],
    ["error", "alert-error"],
  ] as const)("applies the %s variant class", (variant, expected) => {
    render(<Alert variant={variant} message="x" />);
    expect(screen.getByRole("alert")).toHaveClass(expected);
  });

  describe("announcement urgency", () => {
    it.each(["warning", "error"] as const)("announces %s assertively", (variant) => {
      render(<Alert variant={variant} message="x" />);
      expect(screen.getByRole("alert")).toHaveAttribute("aria-live", "assertive");
    });

    it.each(["info", "success"] as const)("announces %s politely", (variant) => {
      render(<Alert variant={variant} message="x" />);
      expect(screen.getByRole("alert")).toHaveAttribute("aria-live", "polite");
    });

    it("announces the neutral base politely", () => {
      render(<Alert message="x" />);
      expect(screen.getByRole("alert")).toHaveAttribute("aria-live", "polite");
    });
  });

  describe("icon resolution", () => {
    it("uses the variant's default icon when icon is unset", () => {
      const { container } = render(<Alert variant="info" message="x" />);
      expect(container.querySelector("svg")).toBeInTheDocument();
    });

    it("renders no icon for the neutral base", () => {
      const { container } = render(<Alert message="x" />);
      expect(container.querySelector("svg")).not.toBeInTheDocument();
    });

    it("hides the icon when explicitly passed null", () => {
      const { container } = render(<Alert variant="info" icon={null} message="x" />);
      expect(container.querySelector("svg")).not.toBeInTheDocument();
    });

    it("uses a custom icon over the variant default", () => {
      render(<Alert variant="info" icon={<span data-testid="custom" />} message="x" />);
      expect(screen.getByTestId("custom")).toBeInTheDocument();
    });
  });

  it("shows a close button only when onClose is given, and calls it", async () => {
    const onClose = vi.fn();
    const { rerender } = render(<Alert message="x" />);
    expect(screen.queryByRole("button", { name: "Close" })).not.toBeInTheDocument();

    rerender(<Alert message="x" onClose={onClose} />);
    await userEvent.click(screen.getByRole("button", { name: "Close" }));

    expect(onClose).toHaveBeenCalledOnce();
  });

  it("renders the action slot", () => {
    render(<Alert message="x" action={<button type="button">Undo</button>} />);
    expect(screen.getByRole("button", { name: "Undo" })).toBeInTheDocument();
  });

  it("applies the soft, outline, dash, and vertical styles", () => {
    render(<Alert message="x" soft outline dash vertical />);
    expect(screen.getByRole("alert")).toHaveClass(
      "alert-soft",
      "alert-outline",
      "alert-dash",
      "alert-vertical",
    );
  });

  it("merges className and forwards extra props to the root", () => {
    render(<Alert message="x" className="mt-2" data-testid="alert" />);
    expect(screen.getByTestId("alert")).toHaveClass("alert", "mt-2");
  });
});
