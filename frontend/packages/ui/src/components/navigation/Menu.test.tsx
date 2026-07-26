import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Menu, type MenuItem } from "./Menu";

describe("Menu", () => {
  it("renders a link for an item with an href and a button otherwise", () => {
    render(
      <Menu
        items={[
          { id: "a", label: "Inbox", href: "/inbox" },
          { id: "b", label: "Archive" },
        ]}
      />,
    );

    expect(screen.getByRole("link", { name: "Inbox" })).toHaveAttribute("href", "/inbox");
    expect(screen.getByRole("button", { name: "Archive" })).toBeInTheDocument();
  });

  it("runs onClick on a leaf button", async () => {
    const onClick = vi.fn();
    render(<Menu items={[{ id: "a", label: "Archive", onClick }]} />);

    await userEvent.click(screen.getByRole("button", { name: "Archive" }));

    expect(onClick).toHaveBeenCalledOnce();
  });

  it("marks the active item with aria-current", () => {
    render(<Menu items={[{ id: "a", label: "Inbox", href: "/inbox", active: true }]} />);

    const link = screen.getByRole("link", { name: "Inbox" });
    expect(link).toHaveAttribute("aria-current", "page");
    expect(link).toHaveClass("menu-active");
  });

  describe("disabled items", () => {
    it("disables a leaf button", () => {
      render(<Menu items={[{ id: "a", label: "Archive", disabled: true }]} />);
      expect(screen.getByRole("button", { name: "Archive" })).toBeDisabled();
    });

    it("flags a disabled link with aria-disabled, since <a> has no disabled attribute", () => {
      render(<Menu items={[{ id: "a", label: "Inbox", href: "/i", disabled: true }]} />);

      const link = screen.getByRole("link", { name: "Inbox" });
      expect(link).toHaveAttribute("aria-disabled", "true");
      expect(link).toHaveClass("menu-disabled");
    });
  });

  it("renders a leading icon and a trailing badge", () => {
    render(
      <Menu
        items={[
          {
            id: "a",
            label: "Inbox",
            icon: <span data-testid="icon" />,
            badge: <span data-testid="badge" />,
          },
        ]}
      />,
    );

    expect(screen.getByTestId("icon")).toBeInTheDocument();
    expect(screen.getByTestId("badge")).toBeInTheDocument();
  });

  describe("section headings", () => {
    it("renders a bare title as a non-interactive row", () => {
      render(<Menu items={[{ id: "t", label: "Mail", title: true }]} />);

      const row = screen.getByText("Mail");
      expect(row.tagName).toBe("LI");
      expect(row).toHaveClass("menu-title");
    });

    it("renders a title with children as a heading over a nested list", () => {
      render(
        <Menu
          items={[{ id: "t", label: "Mail", title: true, children: [{ id: "a", label: "Inbox" }] }]}
        />,
      );

      expect(screen.getByRole("heading", { level: 2, name: "Mail" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Inbox" })).toBeInTheDocument();
    });
  });

  describe("submenus", () => {
    const NESTED: MenuItem[] = [
      { id: "group", label: "Mail", children: [{ id: "a", label: "Inbox", href: "/i" }] },
    ];

    it("renders a static nested list by default", () => {
      const { container } = render(<Menu items={NESTED} />);

      expect(container.querySelector("details")).not.toBeInTheDocument();
      expect(screen.getByRole("link", { name: "Inbox" })).toBeInTheDocument();
    });

    it("renders a collapsible submenu as <details>, closed by default", () => {
      const { container } = render(<Menu items={[{ ...NESTED[0], collapsible: true }]} />);

      const details = container.querySelector("details");
      expect(details).toBeInTheDocument();
      expect(details).not.toHaveAttribute("open");
    });

    it("starts a collapsible submenu open when asked", () => {
      const { container } = render(
        <Menu items={[{ ...NESTED[0], collapsible: true, defaultOpen: true }]} />,
      );
      expect(container.querySelector("details")).toHaveAttribute("open");
    });
  });

  it.each([
    ["xs", "menu-xs"],
    ["xl", "menu-xl"],
  ] as const)("applies the %s size class", (size, expected) => {
    const { container } = render(<Menu items={[{ id: "a", label: "Inbox" }]} size={size} />);
    expect(container.firstChild).toHaveClass(expected);
  });

  it("switches to a horizontal layout", () => {
    const { container } = render(<Menu items={[{ id: "a", label: "Inbox" }]} horizontal />);
    expect(container.firstChild).toHaveClass("menu-horizontal");
  });

  it("merges className and forwards extra props to the root", () => {
    render(<Menu items={[{ id: "a", label: "Inbox" }]} className="w-56" data-testid="menu" />);
    expect(screen.getByTestId("menu")).toHaveClass("menu", "w-56");
  });
});
