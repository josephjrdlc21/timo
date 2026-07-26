import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ErrorState } from "./ErrorState";

describe("ErrorState", () => {
  it("announces politely with a default title and icon", () => {
    const { container } = render(<ErrorState />);

    const root = screen.getByRole("alert");
    expect(root).toHaveAttribute("aria-live", "polite");
    expect(
      screen.getByRole("heading", { level: 3, name: "Something went wrong" }),
    ).toBeInTheDocument();
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("takes a custom title and description", () => {
    render(<ErrorState title="Upload failed" description="The file was too large." />);
    expect(screen.getByRole("heading", { name: "Upload failed" })).toBeInTheDocument();
    expect(screen.getByText("The file was too large.")).toBeInTheDocument();
  });

  it("falls back to children for the description", () => {
    render(<ErrorState>Try again later.</ErrorState>);
    expect(screen.getByText("Try again later.")).toBeInTheDocument();
  });

  it("hides the icon when explicitly passed null", () => {
    const { container } = render(<ErrorState icon={null} />);
    expect(container.querySelector("svg")).not.toBeInTheDocument();
  });

  it("uses a custom icon over the default triangle", () => {
    render(<ErrorState icon={<span data-testid="custom" />} />);
    expect(screen.getByTestId("custom")).toBeInTheDocument();
  });

  it("renders the action slot", () => {
    render(<ErrorState action={<button type="button">Retry</button>} />);
    expect(screen.getByRole("button", { name: "Retry" })).toBeInTheDocument();
  });

  it.each([
    ["sm", "p-6"],
    ["lg", "p-16"],
  ] as const)("applies the %s padding scale", (size, expected) => {
    render(<ErrorState size={size} />);
    expect(screen.getByRole("alert")).toHaveClass(expected);
  });

  it("merges className and forwards extra props to the root", () => {
    render(<ErrorState className="mt-8" data-testid="err" />);
    expect(screen.getByTestId("err")).toHaveClass("mt-8", "border-dashed");
  });
});
