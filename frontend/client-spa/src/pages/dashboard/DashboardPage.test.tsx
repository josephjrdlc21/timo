import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DashboardPage } from "./DashboardPage";

describe("DashboardPage", () => {
  it("renders the page header with its title, subtitle and action", () => {
    render(<DashboardPage />);
    expect(screen.getByRole("heading", { level: 1, name: "Apps" })).toBeInTheDocument();
    expect(screen.getByText(/manage internal and third-party integrations/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /retry/i })).toBeInTheDocument();
  });
});
