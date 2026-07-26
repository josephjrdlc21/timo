import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Dropdown, type DropdownItem } from "./Dropdown";

const ITEMS: DropdownItem[] = [
  { label: "Edit", onClick: () => {} },
  { label: "Open", href: "/open" },
  { label: "Delete", danger: true },
];

describe("Dropdown", () => {
  describe("trigger", () => {
    it("renders a text trigger from label", () => {
      render(<Dropdown items={ITEMS} label="Actions" />);
      const trigger = screen.getByRole("button", { name: "Actions" });
      expect(trigger).toHaveClass("btn-neutral");
    });

    it("falls back to an icon-only ellipsis trigger with a default label", () => {
      render(<Dropdown items={ITEMS} />);
      const trigger = screen.getByRole("button", { name: "Open menu" });
      expect(trigger).toHaveClass("btn-circle");
    });

    it("takes a custom aria-label for the icon-only trigger", () => {
      render(<Dropdown items={ITEMS} ariaLabel="Row actions" />);
      expect(screen.getByRole("button", { name: "Row actions" })).toBeInTheDocument();
    });

    it("renders fully custom trigger content", () => {
      render(<Dropdown items={ITEMS} trigger={<span data-testid="custom" />} />);
      expect(screen.getByTestId("custom")).toBeInTheDocument();
    });

    it("is reachable by keyboard, which is what opens it under the focus method", () => {
      render(<Dropdown items={ITEMS} label="Actions" />);
      expect(screen.getByRole("button", { name: "Actions" })).toHaveAttribute("tabindex", "0");
    });

    it("merges triggerClassName", () => {
      render(<Dropdown items={ITEMS} label="Actions" triggerClassName="btn-sm" />);
      expect(screen.getByRole("button", { name: "Actions" })).toHaveClass("btn", "btn-sm");
    });
  });

  describe("items", () => {
    it("renders a link for an item with an href and a button otherwise", () => {
      render(<Dropdown items={ITEMS} label="Actions" />);

      expect(screen.getByRole("link", { name: "Open" })).toHaveAttribute("href", "/open");
      expect(screen.getByRole("button", { name: "Edit" })).toBeInTheDocument();
    });

    it("runs onClick and blurs so the menu dismisses", async () => {
      const onClick = vi.fn();
      render(<Dropdown items={[{ label: "Edit", onClick }]} label="Actions" />);

      const item = screen.getByRole("button", { name: "Edit" });
      item.focus();
      await userEvent.click(item);

      expect(onClick).toHaveBeenCalledOnce();
      expect(item).not.toHaveFocus();
    });

    it("ignores a click on a disabled item", async () => {
      const onClick = vi.fn();
      render(<Dropdown items={[{ label: "Edit", onClick, disabled: true }]} label="Actions" />);

      await userEvent.click(screen.getByRole("button", { name: "Edit" }));

      expect(onClick).not.toHaveBeenCalled();
    });

    it("flags a disabled link with aria-disabled", () => {
      render(<Dropdown items={[{ label: "Open", href: "/o", disabled: true }]} label="Actions" />);

      const link = screen.getByRole("link", { name: "Open" });
      expect(link).toHaveAttribute("aria-disabled", "true");
      expect(link).toHaveClass("menu-disabled");
    });

    it("styles a danger item distinctly", () => {
      render(<Dropdown items={ITEMS} label="Actions" />);
      expect(screen.getByRole("button", { name: "Delete" })).toHaveClass("text-error");
    });

    it("renders an item icon", () => {
      render(<Dropdown items={[{ label: "Edit", icon: <span data-testid="i" /> }]} label="A" />);
      expect(screen.getByTestId("i")).toBeInTheDocument();
    });
  });

  describe("placement", () => {
    it.each([
      ["top", "dropdown-top"],
      ["bottom", "dropdown-bottom"],
      ["left", "dropdown-left"],
      ["right", "dropdown-right"],
    ] as const)("opens toward the %s", (placement, expected) => {
      const { container } = render(<Dropdown items={ITEMS} label="A" placement={placement} />);
      expect(container.firstChild).toHaveClass(expected);
    });

    it("aligns to the end when asked", () => {
      const { container } = render(<Dropdown items={ITEMS} label="A" align="end" />);
      expect(container.firstChild).toHaveClass("dropdown-end");
    });

    it("merges className onto the menu", () => {
      const { container } = render(<Dropdown items={ITEMS} label="A" className="w-64" />);
      expect(container.querySelector(".dropdown-content")).toHaveClass("menu", "w-64");
    });
  });
});
