import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { Breadcrumb } from "./Breadcrumb";
import type { BreadcrumbItem } from "../../types/navigation";
import { TestIcon } from "../../../test/TestIcon";

const renderTrail = (items: BreadcrumbItem[], className?: string) =>
  render(
    <MemoryRouter>
      <Breadcrumb items={items} className={className} />
    </MemoryRouter>,
  );

describe("Breadcrumb", () => {
  it("renders nothing for an empty trail", () => {
    const { container } = renderTrail([]);
    expect(container).toBeEmptyDOMElement();
  });

  it("labels the trail for assistive tech", () => {
    renderTrail([{ label: "Overview", href: "/" }, { label: "Dashboard" }]);
    expect(screen.getByRole("navigation", { name: "Breadcrumb" })).toBeInTheDocument();
  });

  it("links ancestors and leaves the last item as plain text", () => {
    renderTrail([{ label: "Overview", href: "/" }, { label: "Dashboard" }]);

    expect(screen.getByRole("link", { name: "Overview" })).toHaveAttribute("href", "/");
    expect(screen.queryByRole("link", { name: "Dashboard" })).not.toBeInTheDocument();
  });

  it("marks the last item as the current page by default", () => {
    renderTrail([{ label: "Overview", href: "/" }, { label: "Dashboard" }]);
    expect(screen.getByText("Dashboard")).toHaveAttribute("aria-current", "page");
  });

  it("honours an explicit active flag over the position default", () => {
    renderTrail([
      { label: "Overview", href: "/", active: true },
      { label: "Dashboard", href: "/d" },
    ]);

    expect(screen.getByText("Overview")).toHaveAttribute("aria-current", "page");
    // Flagged active, so it renders as text even though it has an href.
    expect(screen.queryByRole("link", { name: "Overview" })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Dashboard" })).toBeInTheDocument();
  });

  it("renders an item without an href as text", () => {
    renderTrail([{ label: "Overview" }, { label: "Dashboard" }]);
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  describe("separators", () => {
    it("puts a slash between items but not before the first", () => {
      renderTrail([{ label: "A", href: "/" }, { label: "B", href: "/b" }, { label: "C" }]);
      expect(screen.getAllByText("/")).toHaveLength(2);
    });

    it("hides separators from assistive tech", () => {
      renderTrail([{ label: "A", href: "/" }, { label: "B" }]);
      expect(screen.getByText("/")).toHaveAttribute("aria-hidden", "true");
    });
  });

  describe("icons", () => {
    it("renders the icon on the head of the trail", () => {
      renderTrail([{ label: "Overview", icon: TestIcon, href: "/" }, { label: "Dashboard" }]);

      expect(screen.getByTestId("icon")).toBeInTheDocument();
      // Still part of the link, so the accessible name is unchanged.
      expect(screen.getByRole("link", { name: "Overview" })).toBeInTheDocument();
    });

    it("renders an icon on a current-page item too", () => {
      renderTrail([
        { label: "Overview", href: "/" },
        { label: "Dashboard", icon: TestIcon },
      ]);
      expect(screen.getByTestId("icon")).toBeInTheDocument();
    });

    it("renders no icon when the item has none", () => {
      const { container } = renderTrail([{ label: "Overview" }]);
      expect(container.querySelector("svg")).not.toBeInTheDocument();
    });
  });

  it("merges className onto the nav", () => {
    renderTrail([{ label: "Overview" }], "hidden sm:block");
    expect(screen.getByRole("navigation")).toHaveClass("hidden", "sm:block", "min-w-0");
  });
});
