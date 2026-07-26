import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { FileUploadField } from "./FileUploadField";

describe("FileUploadField", () => {
  it("renders a file input associated with its label", () => {
    render(<FileUploadField label="Avatar" />);
    const input = screen.getByLabelText("Avatar");
    expect(input).toHaveAttribute("type", "file");
    expect(input).toHaveClass("file-input", "file-input-md");
  });

  it("passes accept and multiple through", () => {
    render(<FileUploadField label="Avatar" accept="image/*" multiple />);
    const input = screen.getByLabelText("Avatar");
    expect(input).toHaveAttribute("accept", "image/*");
    expect(input).toHaveAttribute("multiple");
  });

  it("accepts a selected file", async () => {
    render(<FileUploadField label="Avatar" />);
    const file = new File(["x"], "me.png", { type: "image/png" });

    const input = screen.getByLabelText("Avatar") as HTMLInputElement;
    await userEvent.upload(input, file);

    expect(input.files?.[0]).toBe(file);
  });

  it("shows the error, flags aria-invalid, and applies the error style", () => {
    render(<FileUploadField label="Avatar" error="Too large" />);

    const input = screen.getByLabelText("Avatar");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveClass("file-input-error");
    expect(screen.getByText("Too large")).toHaveClass("text-error");
  });

  it("shows the hint when there is no error", () => {
    render(<FileUploadField label="Avatar" hint="PNG or JPG" />);
    expect(screen.getByText("PNG or JPG")).toBeInTheDocument();
  });

  it.each([
    ["xs", "file-input-xs"],
    ["xl", "file-input-xl"],
  ] as const)("applies the %s size class", (size, expected) => {
    render(<FileUploadField label="Avatar" size={size} />);
    expect(screen.getByLabelText("Avatar")).toHaveClass(expected);
  });
});
