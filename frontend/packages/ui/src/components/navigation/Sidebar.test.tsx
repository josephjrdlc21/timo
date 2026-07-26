import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "@timo/brand";
import { describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import type { NavSection } from "../../types/navigation";
import { TestIcon } from "../../../test/TestIcon";

const NAV: NavSection[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    items: [{ id: "o", label: "Overview", icon: TestIcon, to: "/" }],
  },
  {
    id: "support",
    label: "Support",
    footer: true,
    items: [{ id: "f", label: "Feedback", icon: TestIcon }],
  },
];

const renderSidebar = (props: Partial<Parameters<typeof Sidebar>[0]> = {}) =>
  render(
    <MemoryRouter>
      <ThemeProvider>
        <Sidebar nav={NAV} brandName="Timo" {...props} />
      </ThemeProvider>
    </MemoryRouter>,
  );

describe("Sidebar", () => {
  describe("sections", () => {
    it("renders scrolling sections inside the nav landmark", () => {
      renderSidebar();

      const nav = screen.getByRole("navigation");
      expect(within(nav).getByText("Dashboard")).toBeInTheDocument();
      expect(within(nav).getByRole("link", { name: "Overview" })).toBeInTheDocument();
    });

    it("pins a footer section outside the scrolling nav", () => {
      renderSidebar();

      const nav = screen.getByRole("navigation");
      // Rendered, but deliberately not part of the scrolling region.
      expect(screen.getByRole("button", { name: "Feedback" })).toBeInTheDocument();
      expect(within(nav).queryByText("Support")).not.toBeInTheDocument();
    });

    it("renders every section's rows through the same NavItem treatment", () => {
      renderSidebar();

      // One link (has a route) and one button (placeholder), both nav rows.
      expect(screen.getByRole("link", { name: "Overview" })).toHaveClass("rounded-field");
      expect(screen.getByRole("button", { name: "Feedback" })).toHaveClass("rounded-field");
    });
  });

  describe("collapse", () => {
    it("shows section headings, search, and labels when expanded", () => {
      renderSidebar();

      expect(screen.getByText("Dashboard")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Search anything")).toBeInTheDocument();
      expect(screen.getByRole("link", { name: "Overview" })).toBeInTheDocument();
    });

    it("hides headings and swaps search for an icon button when collapsed", () => {
      renderSidebar({ collapsed: true });

      expect(screen.queryByText("Dashboard")).not.toBeInTheDocument();
      expect(screen.queryByPlaceholderText("Search anything")).not.toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Search" })).toBeInTheDocument();
    });

    it("labels the toggle for the direction it will move", () => {
      const { rerender } = renderSidebar({ onToggle: () => {} });
      expect(screen.getByRole("button", { name: "Collapse sidebar" })).toBeInTheDocument();

      rerender(
        <MemoryRouter>
          <ThemeProvider>
            <Sidebar nav={NAV} brandName="Timo" collapsed onToggle={() => {}} />
          </ThemeProvider>
        </MemoryRouter>,
      );
      expect(screen.getByRole("button", { name: "Expand sidebar" })).toBeInTheDocument();
    });

    it("calls onToggle when the chevron is pressed", async () => {
      const onToggle = vi.fn();
      renderSidebar({ onToggle });

      await userEvent.click(screen.getByRole("button", { name: "Collapse sidebar" }));

      expect(onToggle).toHaveBeenCalledOnce();
    });

    it("omits the toggle entirely when no handler is given", () => {
      renderSidebar();
      expect(screen.queryByRole("button", { name: /sidebar/i })).not.toBeInTheDocument();
    });
  });

  describe("account card", () => {
    it("renders when any account detail is supplied", () => {
      renderSidebar({ userName: "Jane Doe", userEmail: "jane@acme.com" });
      expect(screen.getByRole("button", { name: "Account menu" })).toBeInTheDocument();
    });

    it("is omitted entirely when there is no account to show", () => {
      renderSidebar();
      expect(screen.queryByRole("button", { name: "Account menu" })).not.toBeInTheDocument();
    });
  });

  it("calls onNavigate when a real link is followed, which closes the mobile drawer", async () => {
    const onNavigate = vi.fn();
    renderSidebar({ onNavigate });

    await userEvent.click(screen.getByRole("link", { name: "Overview" }));

    expect(onNavigate).toHaveBeenCalledOnce();
  });

  it("renders the brand name", () => {
    renderSidebar();
    expect(screen.getByRole("img", { name: "Timo" })).toBeInTheDocument();
  });
});
