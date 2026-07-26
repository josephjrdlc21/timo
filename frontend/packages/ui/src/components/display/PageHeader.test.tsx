import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PageHeader } from "./PageHeader";

describe("PageHeader", () => {
  it("renders the title as the page's h1", () => {
    render(<PageHeader title="Overview" />);
    expect(screen.getByRole("heading", { level: 1, name: "Overview" })).toBeInTheDocument();
  });

  it("renders the subtitle when given", () => {
    render(<PageHeader title="Overview" subtitle="At a glance" />);
    expect(screen.getByText("At a glance")).toBeInTheDocument();
  });

  it("omits the subtitle paragraph entirely when there is none", () => {
    const { container } = render(<PageHeader title="Overview" />);
    expect(container.querySelector("p")).not.toBeInTheDocument();
  });

  it("renders the actions slot", () => {
    render(<PageHeader title="Overview" actions={<button type="button">Retry</button>} />);
    expect(screen.getByRole("button", { name: "Retry" })).toBeInTheDocument();
  });

  it("merges className onto the root", () => {
    const { container } = render(<PageHeader title="Overview" className="mb-6" />);
    expect(container.firstChild).toHaveClass("flex", "mb-6");
  });
});
