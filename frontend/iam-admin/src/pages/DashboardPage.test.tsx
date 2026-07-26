import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DashboardPage } from "./DashboardPage";

describe("DashboardPage", () => {
  it("renders the heading and the intro copy", () => {
    render(<DashboardPage />);
    expect(screen.getByRole("heading", { name: /iam dashboard/i })).toBeInTheDocument();
    expect(screen.getByText(/one install, one source of truth/i)).toBeInTheDocument();
  });
});
