import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { AccountMenu } from "./AccountMenu";
import type { AccountMenuItem } from "../../types/navigation";
import { TestIcon } from "../../../test/TestIcon";

const ITEMS: AccountMenuItem[] = [
  { id: "profile", label: "Profile", to: "/profile" },
  { id: "settings", label: "Settings", onClick: () => {} },
  { id: "logout", label: "Log out", danger: true },
];

const renderMenu = (props: Partial<Parameters<typeof AccountMenu>[0]> = {}) =>
  render(
    <MemoryRouter>
      <AccountMenu userName="Jane Doe" userEmail="jane@acme.com" items={ITEMS} {...props} />
    </MemoryRouter>,
  );

const trigger = () => screen.getByRole("button", { name: "Account menu" });

describe("AccountMenu", () => {
  describe("trigger", () => {
    it("shows the name and email", () => {
      renderMenu();
      expect(screen.getAllByText("Jane Doe")[0]).toBeInTheDocument();
      expect(screen.getAllByText("jane@acme.com")[0]).toBeInTheDocument();
    });

    it("falls back to a generic name", () => {
      renderMenu({ userName: undefined, userEmail: undefined });
      expect(screen.getAllByText("Account")[0]).toBeInTheDocument();
    });

    it("advertises the popup and its collapsed state", () => {
      renderMenu();
      expect(trigger()).toHaveAttribute("aria-haspopup", "menu");
      expect(trigger()).toHaveAttribute("aria-expanded", "false");
    });

    it("is inert with no menu items", async () => {
      renderMenu({ items: [] });

      expect(trigger()).not.toHaveAttribute("aria-haspopup");
      await userEvent.click(trigger());
      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    });

    it("hides the name block and chevron in the collapsed panel", () => {
      renderMenu({ variant: "panel", collapsed: true });
      expect(screen.queryByText("Jane Doe")).not.toBeInTheDocument();
    });
  });

  describe("opening and closing", () => {
    it("opens on click and wires aria-controls to the menu", async () => {
      renderMenu();

      await userEvent.click(trigger());

      const menu = screen.getByRole("menu", { name: "Account" });
      expect(trigger()).toHaveAttribute("aria-expanded", "true");
      expect(trigger()).toHaveAttribute("aria-controls", menu.id);
    });

    it("toggles shut on a second click", async () => {
      renderMenu();

      await userEvent.click(trigger());
      await userEvent.click(trigger());

      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    });

    it("closes on Escape and returns focus to the trigger", async () => {
      renderMenu();
      await userEvent.click(trigger());

      await userEvent.keyboard("{Escape}");

      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
      expect(trigger()).toHaveFocus();
    });

    it("closes on an outside click", async () => {
      renderMenu();
      await userEvent.click(trigger());

      await userEvent.click(document.body);

      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    });

    it("stays open when clicking inside the menu's own chrome", async () => {
      renderMenu();
      await userEvent.click(trigger());

      await userEvent.click(screen.getByRole("menu"));

      expect(screen.getByRole("menu")).toBeInTheDocument();
    });
  });

  describe("items", () => {
    it("renders links for items with a destination and buttons for the rest", async () => {
      renderMenu();
      await userEvent.click(trigger());

      expect(screen.getByRole("menuitem", { name: "Profile" })).toHaveAttribute("href", "/profile");
      expect(screen.getByRole("menuitem", { name: "Settings" }).tagName).toBe("BUTTON");
    });

    it("styles a danger item distinctly", async () => {
      renderMenu();
      await userEvent.click(trigger());
      expect(screen.getByRole("menuitem", { name: "Log out" })).toHaveClass("text-error");
    });

    it("renders an item icon", async () => {
      renderMenu({ items: [{ id: "profile", label: "Profile", icon: TestIcon }] });
      await userEvent.click(trigger());
      expect(screen.getByTestId("icon")).toBeInTheDocument();
    });

    it("runs the handler and closes the menu on selection", async () => {
      const onClick = vi.fn();
      renderMenu({ items: [{ id: "settings", label: "Settings", onClick }] });

      await userEvent.click(trigger());
      await userEvent.click(screen.getByRole("menuitem", { name: "Settings" }));

      expect(onClick).toHaveBeenCalledOnce();
      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    });
  });

  describe("placement", () => {
    it("drops downward for the bar variant", async () => {
      renderMenu();
      await userEvent.click(trigger());
      expect(screen.getByRole("menu")).toHaveClass("mt-2");
    });

    it("opens upward for the sidebar panel, where there is nothing below it", async () => {
      renderMenu({ variant: "panel" });
      await userEvent.click(trigger());

      const menu = screen.getByRole("menu");
      expect(menu).toHaveClass("bottom-full", "mb-2");
    });
  });
});
