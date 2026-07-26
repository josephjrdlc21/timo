import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Skeleton } from "./Skeleton";

describe("Skeleton", () => {
  it("renders the shimmer box", () => {
    const { container } = render(<Skeleton />);
    expect(container.firstChild).toHaveClass("skeleton");
  });

  it("treats a numeric width / height as pixels", () => {
    render(<Skeleton width={120} height={16} data-testid="s" />);
    expect(screen.getByTestId("s")).toHaveStyle({ width: "120px", height: "16px" });
  });

  it("passes a string width / height through untouched", () => {
    render(<Skeleton width="50%" height="2rem" data-testid="s" />);
    expect(screen.getByTestId("s")).toHaveStyle({ width: "50%", height: "2rem" });
  });

  it("rounds fully in circle mode", () => {
    const { container } = render(<Skeleton circle />);
    expect(container.firstChild).toHaveClass("rounded-full");
  });

  it("lets an incoming style override the convenience props", () => {
    render(<Skeleton width={120} style={{ width: "10rem" }} data-testid="s" />);
    expect(screen.getByTestId("s")).toHaveStyle({ width: "10rem" });
  });

  it("merges className and forwards extra props", () => {
    render(<Skeleton className="mb-2" data-testid="s" />);
    expect(screen.getByTestId("s")).toHaveClass("skeleton", "mb-2");
  });
});
