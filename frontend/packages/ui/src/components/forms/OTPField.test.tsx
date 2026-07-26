import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { OTPField } from "./OTPField";

const boxes = () => screen.getAllByRole("textbox");

describe("OTPField", () => {
  describe("rendering", () => {
    it("renders six numbered boxes by default", () => {
      render(<OTPField label="Code" />);
      expect(boxes()).toHaveLength(6);
      expect(screen.getByLabelText("Digit 1")).toBeInTheDocument();
      expect(screen.getByLabelText("Digit 6")).toBeInTheDocument();
    });

    it("honours a custom length", () => {
      render(<OTPField length={4} />);
      expect(boxes()).toHaveLength(4);
    });

    it("spreads defaultValue across the boxes", () => {
      render(<OTPField length={4} defaultValue="12" />);
      expect(boxes()[0]).toHaveValue("1");
      expect(boxes()[1]).toHaveValue("2");
      expect(boxes()[2]).toHaveValue("");
    });

    it("marks the first box for one-time-code autofill only", () => {
      render(<OTPField length={3} />);
      expect(boxes()[0]).toHaveAttribute("autocomplete", "one-time-code");
      expect(boxes()[1]).toHaveAttribute("autocomplete", "off");
    });

    it("shows the error, flags aria-invalid, and applies the error style", () => {
      render(<OTPField length={3} error="Wrong code" />);

      for (const box of boxes()) {
        expect(box).toHaveAttribute("aria-invalid", "true");
        expect(box).toHaveClass("input-error");
      }
      expect(screen.getByText("Wrong code")).toHaveClass("text-error");
    });

    it("disables every box", () => {
      render(<OTPField length={3} disabled />);
      for (const box of boxes()) expect(box).toBeDisabled();
    });
  });

  describe("typing", () => {
    it("fills a box and auto-advances to the next", async () => {
      render(<OTPField length={3} />);

      await userEvent.type(boxes()[0], "1");

      expect(boxes()[0]).toHaveValue("1");
      expect(boxes()[1]).toHaveFocus();
    });

    it("reports the joined code through onChange", async () => {
      const onChange = vi.fn();
      render(<OTPField length={3} onChange={onChange} />);

      await userEvent.type(boxes()[0], "12");

      expect(onChange).toHaveBeenLastCalledWith("12");
    });

    it("fires onComplete once every box is filled", async () => {
      const onComplete = vi.fn();
      render(<OTPField length={3} onComplete={onComplete} />);

      await userEvent.type(boxes()[0], "123");

      expect(onComplete).toHaveBeenCalledWith("123");
    });

    it("rejects non-digits in numeric mode", async () => {
      render(<OTPField length={3} />);

      await userEvent.type(boxes()[0], "a");

      expect(boxes()[0]).toHaveValue("");
    });

    it("accepts letters in alphanumeric mode", async () => {
      render(<OTPField length={3} mode="alphanumeric" />);

      await userEvent.type(boxes()[0], "a");

      expect(boxes()[0]).toHaveValue("a");
    });
  });

  describe("keyboard navigation", () => {
    it("moves between boxes with the arrow keys", async () => {
      render(<OTPField length={3} />);
      boxes()[1].focus();

      await userEvent.keyboard("{ArrowLeft}");
      expect(boxes()[0]).toHaveFocus();

      await userEvent.keyboard("{ArrowRight}");
      expect(boxes()[1]).toHaveFocus();
    });

    it("clamps arrow navigation at both ends", async () => {
      render(<OTPField length={3} />);
      boxes()[0].focus();

      await userEvent.keyboard("{ArrowLeft}");
      expect(boxes()[0]).toHaveFocus();

      boxes()[2].focus();
      await userEvent.keyboard("{ArrowRight}");
      expect(boxes()[2]).toHaveFocus();
    });

    it("steps back and clears on Backspace in an empty box", async () => {
      render(<OTPField length={3} defaultValue="12" />);
      boxes()[2].focus();

      await userEvent.keyboard("{Backspace}");

      expect(boxes()[1]).toHaveFocus();
      expect(boxes()[1]).toHaveValue("");
    });

    it("clears in place when the box has a character", async () => {
      render(<OTPField length={3} defaultValue="12" />);
      boxes()[1].focus();

      await userEvent.keyboard("{Backspace}");

      expect(boxes()[1]).toHaveValue("");
    });
  });

  describe("paste", () => {
    it("fills across boxes from the paste position", async () => {
      const onChange = vi.fn();
      render(<OTPField length={6} onChange={onChange} />);

      boxes()[0].focus();
      await userEvent.paste("123456");

      expect(onChange).toHaveBeenLastCalledWith("123456");
      expect(boxes()[5]).toHaveValue("6");
    });

    it("strips characters the mode disallows", async () => {
      const onChange = vi.fn();
      render(<OTPField length={4} onChange={onChange} />);

      boxes()[0].focus();
      await userEvent.paste("1a2b");

      expect(onChange).toHaveBeenLastCalledWith("12");
    });

    it("ignores a paste with nothing usable in it", async () => {
      const onChange = vi.fn();
      render(<OTPField length={4} onChange={onChange} />);

      boxes()[0].focus();
      await userEvent.paste("abcd");

      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe("controlled mode", () => {
    it("renders the value it is given and does not self-update", async () => {
      const onChange = vi.fn();
      render(<OTPField length={3} value="9" onChange={onChange} />);

      expect(boxes()[0]).toHaveValue("9");

      await userEvent.type(boxes()[1], "8");

      expect(onChange).toHaveBeenLastCalledWith("98");
      // The parent owns the value, so the box only changes when it says so.
      expect(boxes()[1]).toHaveValue("");
    });
  });
});
