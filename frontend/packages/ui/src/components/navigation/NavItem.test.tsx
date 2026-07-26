import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { NavItem } from "./NavItem";
import type { NavItem as NavItemData } from "../../types/navigation";
import { TestIcon } from "../../../test/TestIcon";

const ITEM: NavItemData = { id: "overview", label: "Overview", icon: TestIcon, to: "/" };

const renderItem = (item: NavItemData, props: Partial<Parameters<typeof NavItem>[0]> = {}) =>
  render(
    <MemoryRouter initialEntries={["/"]}>
      <NavItem item={item} {...props} />
    </MemoryRouter>,
  );

describe("NavItem", () => {
  it("renders a link with its icon and label when it has a destination", () => {
    renderItem(ITEM);

    expect(screen.getByRole("link", { name: "Overview" })).toHaveAttribute("href", "/");
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });

  it("renders a button for a placeholder with no destination", () => {
    renderItem({ ...ITEM, to: undefined });

    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Overview" })).toBeInTheDocument();
  });

  it("marks the matching route as active", () => {
    renderItem(ITEM);
    expect(screen.getByRole("link")).toHaveClass("bg-base-200");
  });

  it("leaves a non-matching route inactive", () => {
    render(
      <MemoryRouter initialEntries={["/elsewhere"]}>
        <NavItem item={ITEM} />
      </MemoryRouter>,
    );
    expect(screen.getByRole("link")).not.toHaveClass("bg-base-200");
  });

  describe("trailing affordances", () => {
    it("renders a NEW badge", () => {
      renderItem({ ...ITEM, badge: "new" });
      expect(screen.getByText("NEW")).toBeInTheDocument();
    });

    it("renders a chevron for an expandable item", () => {
      const { container } = renderItem({ ...ITEM, expandable: true });
      expect(container.querySelectorAll("svg").length).toBe(2);
    });

    it("renders a clock for a coming-soon item", () => {
      const { container } = renderItem({ ...ITEM, comingSoon: true });
      expect(container.querySelectorAll("svg").length).toBe(2);
    });
  });

  describe("collapsed rail", () => {
    it("hides the label and trailing affordances, keeping the icon", () => {
      renderItem({ ...ITEM, badge: "new" }, { collapsed: true });

      expect(screen.queryByText("Overview")).not.toBeInTheDocument();
      expect(screen.queryByText("NEW")).not.toBeInTheDocument();
      expect(screen.getByTestId("icon")).toBeInTheDocument();
    });

    it("moves the label into a title so it survives as a tooltip", () => {
      renderItem(ITEM, { collapsed: true });
      expect(screen.getByRole("link")).toHaveAttribute("title", "Overview");
    });

    it("carries no title when expanded, since the label is visible", () => {
      renderItem(ITEM);
      expect(screen.getByRole("link")).not.toHaveAttribute("title");
    });
  });

  it("calls onNavigate when a real link is followed", async () => {
    const onNavigate = vi.fn();
    renderItem(ITEM, { onNavigate });

    await userEvent.click(screen.getByRole("link"));

    expect(onNavigate).toHaveBeenCalledOnce();
  });
});
