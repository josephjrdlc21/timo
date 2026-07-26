import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Card } from "./Card";

describe("Card", () => {
  it("renders its body at the default size", () => {
    const { container } = render(<Card>Body</Card>);
    expect(screen.getByText("Body")).toBeInTheDocument();
    expect(container.firstChild).toHaveClass("card", "card-md");
  });

  it("renders the title and subtitle", () => {
    render(
      <Card title="Revenue" subtitle="Last 30 days">
        Body
      </Card>,
    );
    expect(screen.getByRole("heading", { level: 2, name: "Revenue" })).toBeInTheDocument();
    expect(screen.getByText("Last 30 days")).toBeInTheDocument();
  });

  it("lets titleContent and subtitleContent replace the defaults", () => {
    render(
      <Card
        title="ignored"
        titleContent={<h3>Custom</h3>}
        subtitle="ignored too"
        subtitleContent={<span>Custom sub</span>}
      >
        Body
      </Card>,
    );
    expect(screen.getByRole("heading", { name: "Custom" })).toBeInTheDocument();
    expect(screen.getByText("Custom sub")).toBeInTheDocument();
    expect(screen.queryByText("ignored")).not.toBeInTheDocument();
  });

  it("omits the header when there is no title or subtitle", () => {
    render(<Card>Body</Card>);
    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
  });

  it("renders the footer actions and the figure", () => {
    const { container } = render(
      <Card image={<img alt="cover" src="/c.png" />} footer={<button type="button">Go</button>}>
        Body
      </Card>,
    );
    expect(container.querySelector("figure")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "cover" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Go" })).toBeInTheDocument();
    expect(container.querySelector(".card-actions")).toBeInTheDocument();
  });

  it.each([
    ["xs", "card-xs"],
    ["xl", "card-xl"],
  ] as const)("applies the %s size class", (size, expected) => {
    const { container } = render(<Card size={size}>Body</Card>);
    expect(container.firstChild).toHaveClass(expected);
  });

  it("applies the border, dash, side, and image-full styles", () => {
    const { container } = render(
      <Card bordered dash side imageFull>
        Body
      </Card>,
    );
    expect(container.firstChild).toHaveClass("card-border", "card-dash", "card-side", "image-full");
  });

  it("merges className and forwards extra props to the root", () => {
    render(
      <Card className="mt-4" data-testid="card">
        Body
      </Card>,
    );
    expect(screen.getByTestId("card")).toHaveClass("card", "mt-4");
  });
});
