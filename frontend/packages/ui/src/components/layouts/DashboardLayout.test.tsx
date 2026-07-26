import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "@timo/brand";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it } from "vitest";
import { DashboardLayout } from "./DashboardLayout";
import type { NavSection } from "../../types/navigation";
import { TestIcon } from "../../../test/TestIcon";

const NAV: NavSection[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    items: [{ id: "o", label: "Overview", icon: TestIcon, to: "/" }],
  },
];

const renderLayout = (props: Partial<Parameters<typeof DashboardLayout>[0]> = {}) =>
  render(
    <MemoryRouter>
      <ThemeProvider>
        <DashboardLayout nav={NAV} brandName="Timo" {...props}>
          <p>Page content</p>
        </DashboardLayout>
      </ThemeProvider>
    </MemoryRouter>,
  );

beforeEach(() => {
  window.localStorage.clear();
});

describe("DashboardLayout", () => {
  it("renders the sidebar, top bar, and routed content together", () => {
    renderLayout({ breadcrumb: [{ label: "Overview" }] });

    expect(screen.getByRole("img", { name: "Timo" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Notifications" })).toBeInTheDocument();
    expect(screen.getByRole("main")).toHaveTextContent("Page content");
  });

  it("keeps the closed drawer's duplicate nav out of the accessibility tree", () => {
    const { container } = renderLayout();

    // The drawer's copy stays mounted so it can transition rather than pop,
    // but a closed drawer is aria-hidden — so only one Overview is exposed.
    expect(container.querySelectorAll('a[href="/"]')).toHaveLength(2);
    expect(screen.getAllByRole("link", { name: "Overview" })).toHaveLength(1);
  });

  describe("collapse persistence", () => {
    it("starts expanded when nothing is stored", () => {
      renderLayout();
      expect(screen.getByRole("button", { name: "Collapse sidebar" })).toBeInTheDocument();
    });

    it("writes the collapsed state to localStorage", async () => {
      renderLayout();

      await userEvent.click(screen.getByRole("button", { name: "Collapse sidebar" }));

      expect(window.localStorage.getItem("timo.sidebar.collapsed")).toBe("true");
      expect(screen.getByRole("button", { name: "Expand sidebar" })).toBeInTheDocument();
    });

    it("restores a stored collapsed state on mount", () => {
      window.localStorage.setItem("timo.sidebar.collapsed", "true");
      renderLayout();
      expect(screen.getByRole("button", { name: "Expand sidebar" })).toBeInTheDocument();
    });
  });

  describe("mobile drawer", () => {
    it("stays closed until the hamburger is pressed", async () => {
      renderLayout();

      expect(screen.queryByRole("dialog", { name: "Navigation" })).not.toBeInTheDocument();

      await userEvent.click(screen.getByRole("button", { name: "Open navigation menu" }));

      expect(screen.getByRole("dialog", { name: "Navigation" })).toBeInTheDocument();
    });

    it("closes when a link inside it is followed", async () => {
      renderLayout();
      await userEvent.click(screen.getByRole("button", { name: "Open navigation menu" }));

      const drawer = screen.getByRole("dialog", { name: "Navigation" });
      await userEvent.click(within(drawer).getByRole("link", { name: "Overview" }));

      expect(screen.queryByRole("dialog", { name: "Navigation" })).not.toBeInTheDocument();
    });
  });

  it("passes the account through to the sidebar footer", () => {
    renderLayout({
      userName: "Jane Doe",
      userEmail: "jane@acme.com",
      accountMenuItems: [{ id: "logout", label: "Log out" }],
    });
    expect(screen.getAllByRole("button", { name: "Account menu" }).length).toBeGreaterThan(0);
  });
});
