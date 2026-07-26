import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DashboardPage } from "./DashboardPage";

describe("DashboardPage", () => {
  it("renders the page header with its title and subtitle", () => {
    render(<DashboardPage />);
    expect(screen.getByRole("heading", { level: 1, name: "Overview" })).toBeInTheDocument();
    expect(screen.getByText(/a snapshot of your workspace at a glance/i)).toBeInTheDocument();
  });

  it("renders the empty state while there is no activity to show", () => {
    render(<DashboardPage />);
    expect(
      screen.getByRole("heading", { level: 3, name: /nothing to show yet/i }),
    ).toBeInTheDocument();
  });
});
