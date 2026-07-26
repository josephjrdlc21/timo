import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Tabs, type TabItem } from "./Tabs";

const ITEMS: TabItem[] = [
  { id: "one", label: "One", content: "First panel" },
  { id: "two", label: "Two", content: "Second panel" },
  { id: "three", label: "Three", content: "Third panel" },
];

describe("Tabs", () => {
  describe("rendering and state", () => {
    it("selects the first tab and shows only its panel by default", () => {
      render(<Tabs items={ITEMS} />);

      expect(screen.getByRole("tab", { name: "One" })).toHaveAttribute("aria-selected", "true");
      expect(screen.getByRole("tab", { name: "Two" })).toHaveAttribute("aria-selected", "false");
      expect(screen.getByRole("tabpanel")).toHaveTextContent("First panel");
      expect(screen.queryByText("Second panel")).not.toBeInTheDocument();
    });

    it("honours defaultValue when uncontrolled", () => {
      render(<Tabs items={ITEMS} defaultValue="two" />);
      expect(screen.getByRole("tab", { name: "Two" })).toHaveAttribute("aria-selected", "true");
      expect(screen.getByRole("tabpanel")).toHaveTextContent("Second panel");
    });

    it("switches panels on click when uncontrolled", async () => {
      render(<Tabs items={ITEMS} />);

      await userEvent.click(screen.getByRole("tab", { name: "Three" }));

      expect(screen.getByRole("tab", { name: "Three" })).toHaveAttribute("aria-selected", "true");
      expect(screen.getByRole("tabpanel")).toHaveTextContent("Third panel");
    });

    it("stays on the value it is given when controlled, and reports the request", async () => {
      const onChange = vi.fn();
      render(<Tabs items={ITEMS} value="one" onChange={onChange} />);

      await userEvent.click(screen.getByRole("tab", { name: "Two" }));

      expect(onChange).toHaveBeenCalledWith("two");
      // Controlled: the parent owns the value, so nothing moves until it says so.
      expect(screen.getByRole("tab", { name: "One" })).toHaveAttribute("aria-selected", "true");
    });

    it("renders a count badge and a leading icon when the item has them", () => {
      render(
        <Tabs items={[{ id: "one", label: "One", count: 7, icon: <span data-testid="icon" /> }]} />,
      );
      expect(screen.getByTestId("icon")).toBeInTheDocument();
      expect(screen.getByText("7")).toBeInTheDocument();
    });

    it("omits the panel entirely for an item with no content", () => {
      render(<Tabs items={[{ id: "one", label: "One" }]} />);
      expect(screen.queryByRole("tabpanel")).not.toBeInTheDocument();
      expect(screen.getByRole("tab")).not.toHaveAttribute("aria-controls");
    });

    it.each([
      ["box", "tabs-box"],
      ["lift", "tabs-lift"],
      ["border", "tabs-border"],
    ] as const)("applies the %s variant class", (variant, expected) => {
      render(<Tabs items={ITEMS} variant={variant} />);
      expect(screen.getByRole("tablist")).toHaveClass(expected);
    });

    it.each([
      ["xs", "tabs-xs"],
      ["xl", "tabs-xl"],
    ] as const)("applies the %s size class", (size, expected) => {
      render(<Tabs items={ITEMS} size={size} />);
      expect(screen.getByRole("tablist")).toHaveClass(expected);
    });

    it("merges className onto the tablist and contentClassName onto the panel", () => {
      render(<Tabs items={ITEMS} className="mt-2" contentClassName="p-8" />);
      expect(screen.getByRole("tablist")).toHaveClass("tabs", "mt-2");
      expect(screen.getByRole("tabpanel")).toHaveClass("pt-4", "p-8");
    });

    it("disables a tab and ignores clicks on it", async () => {
      const onChange = vi.fn();
      render(
        <Tabs
          items={[ITEMS[0], { ...ITEMS[1], disabled: true }]}
          value="one"
          onChange={onChange}
        />,
      );

      const disabled = screen.getByRole("tab", { name: "Two" });
      expect(disabled).toBeDisabled();

      await userEvent.click(disabled);
      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe("ARIA wiring", () => {
    it("links each tab to its panel in both directions", () => {
      render(<Tabs items={ITEMS} />);

      const tab = screen.getByRole("tab", { name: "One" });
      const panel = screen.getByRole("tabpanel");

      expect(tab).toHaveAttribute("aria-controls", panel.id);
      expect(panel).toHaveAttribute("aria-labelledby", tab.id);
    });

    it("keeps only the selected tab in the tab order (roving tabindex)", () => {
      render(<Tabs items={ITEMS} defaultValue="two" />);

      expect(screen.getByRole("tab", { name: "One" })).toHaveAttribute("tabindex", "-1");
      expect(screen.getByRole("tab", { name: "Two" })).toHaveAttribute("tabindex", "0");
      expect(screen.getByRole("tab", { name: "Three" })).toHaveAttribute("tabindex", "-1");
    });
  });

  describe("keyboard navigation", () => {
    it("reaches the tablist with a single Tab press, landing on the selected tab", async () => {
      render(<Tabs items={ITEMS} defaultValue="two" />);

      await userEvent.tab();

      expect(screen.getByRole("tab", { name: "Two" })).toHaveFocus();
    });

    it("moves focus and selection with ArrowRight", async () => {
      render(<Tabs items={ITEMS} />);
      screen.getByRole("tab", { name: "One" }).focus();

      await userEvent.keyboard("{ArrowRight}");

      const two = screen.getByRole("tab", { name: "Two" });
      expect(two).toHaveFocus();
      expect(two).toHaveAttribute("aria-selected", "true");
      expect(screen.getByRole("tabpanel")).toHaveTextContent("Second panel");
    });

    it("moves backwards with ArrowLeft", async () => {
      render(<Tabs items={ITEMS} defaultValue="three" />);
      screen.getByRole("tab", { name: "Three" }).focus();

      await userEvent.keyboard("{ArrowLeft}");

      expect(screen.getByRole("tab", { name: "Two" })).toHaveFocus();
    });

    it("wraps around both ends", async () => {
      render(<Tabs items={ITEMS} />);
      screen.getByRole("tab", { name: "One" }).focus();

      await userEvent.keyboard("{ArrowLeft}");
      expect(screen.getByRole("tab", { name: "Three" })).toHaveFocus();

      await userEvent.keyboard("{ArrowRight}");
      expect(screen.getByRole("tab", { name: "One" })).toHaveFocus();
    });

    it("jumps to the first and last tab with Home and End", async () => {
      render(<Tabs items={ITEMS} defaultValue="two" />);
      screen.getByRole("tab", { name: "Two" }).focus();

      await userEvent.keyboard("{End}");
      expect(screen.getByRole("tab", { name: "Three" })).toHaveFocus();

      await userEvent.keyboard("{Home}");
      expect(screen.getByRole("tab", { name: "One" })).toHaveFocus();
    });

    it("skips disabled tabs when arrowing", async () => {
      render(
        <Tabs items={[ITEMS[0], { ...ITEMS[1], disabled: true }, ITEMS[2]]} defaultValue="one" />,
      );
      screen.getByRole("tab", { name: "One" }).focus();

      await userEvent.keyboard("{ArrowRight}");

      expect(screen.getByRole("tab", { name: "Three" })).toHaveFocus();
      expect(screen.getByRole("tab", { name: "Two" })).toHaveAttribute("aria-selected", "false");
    });

    it("reports arrow-key moves through onChange when controlled", async () => {
      const onChange = vi.fn();
      render(<Tabs items={ITEMS} value="one" onChange={onChange} />);
      screen.getByRole("tab", { name: "One" }).focus();

      await userEvent.keyboard("{ArrowRight}");

      expect(onChange).toHaveBeenCalledWith("two");
    });

    it("leaves other keys to the browser", async () => {
      const onChange = vi.fn();
      render(<Tabs items={ITEMS} onChange={onChange} />);
      screen.getByRole("tab", { name: "One" }).focus();

      await userEvent.keyboard("{ArrowDown}");

      expect(onChange).not.toHaveBeenCalled();
      expect(screen.getByRole("tab", { name: "One" })).toHaveFocus();
    });
  });
});
