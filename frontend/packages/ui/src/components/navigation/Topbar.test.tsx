import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { Topbar } from "./Topbar";

const renderTopbar = (props: Partial<Parameters<typeof Topbar>[0]> = {}) =>
  render(
    <MemoryRouter>
      <Topbar onOpenMobile={() => {}} {...props} />
    </MemoryRouter>,
  );

describe("Topbar", () => {
  it("renders the notification and settings actions", () => {
    renderTopbar();

    expect(screen.getByRole("button", { name: "Notifications" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Settings" })).toBeInTheDocument();
  });

  it("renders the breadcrumb trail when given one", () => {
    renderTopbar({ breadcrumb: [{ label: "Overview", href: "/" }, { label: "Dashboard" }] });

    expect(screen.getByRole("navigation", { name: "Breadcrumb" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Overview" })).toBeInTheDocument();
  });

  it("leaves the left side empty when there is no breadcrumb", () => {
    renderTopbar();
    expect(screen.queryByRole("navigation", { name: "Breadcrumb" })).not.toBeInTheDocument();
  });

  it("opens the mobile drawer from the hamburger", async () => {
    const onOpenMobile = vi.fn();
    renderTopbar({ onOpenMobile });

    await userEvent.click(screen.getByRole("button", { name: "Open navigation menu" }));

    expect(onOpenMobile).toHaveBeenCalledOnce();
  });

  it("is transparent and not sticky, so content never runs behind it", () => {
    const { container } = renderTopbar();

    const header = container.querySelector("header") as HTMLElement;
    expect(header).not.toHaveClass("sticky");
    expect(header.className).not.toMatch(/bg-/);
  });

  it("insets its dashed rule from the column edges", () => {
    const { container } = renderTopbar();

    const row = container.querySelector("header > div") as HTMLElement;
    expect(row).toHaveClass("border-b", "border-dashed", "mx-3");
  });
});
