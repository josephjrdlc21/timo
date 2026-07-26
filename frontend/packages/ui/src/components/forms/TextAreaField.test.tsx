import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { TextAreaField } from "./TextAreaField";

describe("TextAreaField", () => {
  it("associates the label with the textarea", () => {
    render(<TextAreaField label="Bio" />);
    expect(screen.getByLabelText("Bio").tagName).toBe("TEXTAREA");
  });

  it("accepts multi-line typing", async () => {
    render(<TextAreaField label="Bio" />);
    await userEvent.type(screen.getByLabelText("Bio"), "line one{enter}line two");
    expect(screen.getByLabelText("Bio")).toHaveValue("line one\nline two");
  });

  it("shows the error, flags aria-invalid, and applies the error style", () => {
    render(<TextAreaField label="Bio" error="Too long" />);

    const field = screen.getByLabelText("Bio");
    expect(field).toHaveAttribute("aria-invalid", "true");
    expect(field).toHaveClass("textarea-error");
    expect(screen.getByText("Too long")).toHaveClass("text-error");
  });

  it("shows the hint when there is no error", () => {
    render(<TextAreaField label="Bio" hint="Max 200 characters" />);
    expect(screen.getByText("Max 200 characters")).toBeInTheDocument();
  });

  it.each([
    ["xs", "textarea-xs"],
    ["xl", "textarea-xl"],
  ] as const)("applies the %s size class", (size, expected) => {
    render(<TextAreaField label="Bio" size={size} />);
    expect(screen.getByLabelText("Bio")).toHaveClass(expected);
  });

  it("forwards the ref and spreads extra props", () => {
    const ref = createRef<HTMLTextAreaElement>();
    render(<TextAreaField label="Bio" ref={ref} rows={6} name="bio" />);

    const field = screen.getByLabelText("Bio");
    expect(ref.current).toBe(field);
    expect(field).toHaveAttribute("rows", "6");
    expect(field).toHaveAttribute("name", "bio");
  });
});
