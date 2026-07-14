import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DashboardPage } from "./DashboardPage";

describe("DashboardPage", () => {
  it("renders the heading and CTA", () => {
    render(<DashboardPage />);
    expect(screen.getByRole("heading", { name: /iam dashboard/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /manage access/i })).toBeInTheDocument();
  });
});
