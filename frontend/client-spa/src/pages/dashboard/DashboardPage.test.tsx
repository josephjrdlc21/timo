import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DashboardPage } from "./DashboardPage";

describe("DashboardPage", () => {
  it("renders the heading, CTA and empty state", () => {
    render(<DashboardPage />);
    expect(screen.getByRole("heading", { level: 1, name: "Apps" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /retry/i })).toBeInTheDocument();
    expect(screen.getByText(/no apps found/i)).toBeInTheDocument();
  });
});
