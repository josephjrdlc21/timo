import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Toast } from "./Toast";

afterEach(() => {
  vi.useRealTimers();
});

describe("Toast", () => {
  it("renders nothing when closed", () => {
    render(<Toast open={false} message="Saved" />);
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("renders the title and message when open", () => {
    render(<Toast open title="Saved" message="Your changes are live." />);

    expect(screen.getByRole("heading", { level: 3, name: "Saved" })).toBeInTheDocument();
    expect(screen.getByText("Your changes are live.")).toBeInTheDocument();
  });

  it("falls back to children for the message", () => {
    render(<Toast open>Body copy</Toast>);
    expect(screen.getByText("Body copy")).toBeInTheDocument();
  });

  it.each([
    ["info", "alert-info"],
    ["success", "alert-success"],
    ["warning", "alert-warning"],
    ["error", "alert-error"],
  ] as const)("applies the %s variant class", (variant, expected) => {
    render(<Toast open variant={variant} message="x" />);
    expect(screen.getByRole("alert")).toHaveClass(expected);
  });

  it.each([
    ["top-start", "toast-top"],
    ["bottom-end", "toast-bottom"],
    ["top-center", "toast-center"],
  ] as const)("applies the %s position class", (position, expected) => {
    const { container } = render(<Toast open position={position} message="x" />);
    expect(container.querySelector(".toast")).toHaveClass(expected);
  });

  it.each(["warning", "error"] as const)("announces %s assertively", (variant) => {
    render(<Toast open variant={variant} message="x" />);
    expect(screen.getByRole("alert")).toHaveAttribute("aria-live", "assertive");
  });

  it.each(["info", "success"] as const)("announces %s politely", (variant) => {
    render(<Toast open variant={variant} message="x" />);
    expect(screen.getByRole("alert")).toHaveAttribute("aria-live", "polite");
  });

  it("always carries an icon, and lets one be overridden", () => {
    const { container, rerender } = render(<Toast open message="x" />);
    expect(container.querySelector("svg")).toBeInTheDocument();

    rerender(<Toast open message="x" icon={<span data-testid="custom" />} />);
    expect(screen.getByTestId("custom")).toBeInTheDocument();
  });

  it("shows a close button only when onClose is given, and calls it", async () => {
    const onClose = vi.fn();
    const { rerender } = render(<Toast open message="x" />);
    expect(screen.queryByRole("button", { name: "Close" })).not.toBeInTheDocument();

    rerender(<Toast open message="x" onClose={onClose} />);
    await userEvent.click(screen.getByRole("button", { name: "Close" }));

    expect(onClose).toHaveBeenCalledOnce();
  });

  it("renders the action slot", () => {
    render(<Toast open message="x" action={<button type="button">Undo</button>} />);
    expect(screen.getByRole("button", { name: "Undo" })).toBeInTheDocument();
  });

  describe("auto-dismiss", () => {
    it("calls onClose once the duration elapses", () => {
      vi.useFakeTimers();
      const onClose = vi.fn();
      render(<Toast open message="x" duration={3000} onClose={onClose} />);

      expect(onClose).not.toHaveBeenCalled();
      act(() => void vi.advanceTimersByTime(3000));
      expect(onClose).toHaveBeenCalledOnce();
    });

    it("does not auto-dismiss without a duration", () => {
      vi.useFakeTimers();
      const onClose = vi.fn();
      render(<Toast open message="x" onClose={onClose} />);

      act(() => void vi.advanceTimersByTime(60_000));
      expect(onClose).not.toHaveBeenCalled();
    });

    it("cancels the timer when the toast closes before it fires", () => {
      vi.useFakeTimers();
      const onClose = vi.fn();
      const { rerender } = render(<Toast open message="x" duration={3000} onClose={onClose} />);

      rerender(<Toast open={false} message="x" duration={3000} onClose={onClose} />);
      act(() => void vi.advanceTimersByTime(3000));

      expect(onClose).not.toHaveBeenCalled();
    });
  });

  it("merges className onto the alert", () => {
    render(<Toast open message="x" className="w-80" />);
    expect(screen.getByRole("alert")).toHaveClass("alert", "w-80");
  });
});
