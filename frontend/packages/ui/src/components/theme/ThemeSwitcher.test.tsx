import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "@timo/brand";
import { beforeEach, describe, expect, it } from "vitest";
import { ThemeSwitcher } from "./ThemeSwitcher";

const renderSwitcher = (collapsed = false) =>
  render(
    <ThemeProvider>
      <ThemeSwitcher collapsed={collapsed} />
    </ThemeProvider>,
  );

beforeEach(() => {
  window.localStorage.clear();
});

describe("ThemeSwitcher", () => {
  describe("expanded", () => {
    it("renders all three preferences as a labelled group", () => {
      renderSwitcher();

      expect(screen.getByRole("group", { name: "Theme" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Light" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Dark" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "System" })).toBeInTheDocument();
    });

    it("marks the active preference with aria-pressed", () => {
      renderSwitcher();
      // The provider defaults to following the OS.
      expect(screen.getByRole("button", { name: "System" })).toHaveAttribute(
        "aria-pressed",
        "true",
      );
      expect(screen.getByRole("button", { name: "Light" })).toHaveAttribute(
        "aria-pressed",
        "false",
      );
    });

    it("switches the preference on click and persists it", async () => {
      renderSwitcher();

      await userEvent.click(screen.getByRole("button", { name: "Dark" }));

      expect(screen.getByRole("button", { name: "Dark" })).toHaveAttribute("aria-pressed", "true");
      expect(document.documentElement).toHaveAttribute("data-theme", "timo-dark");
    });
  });

  describe("collapsed rail", () => {
    it("collapses to a single cycling button", () => {
      renderSwitcher(true);

      expect(screen.getAllByRole("button")).toHaveLength(1);
      expect(screen.getByRole("button", { name: /Theme: System/ })).toBeInTheDocument();
    });

    it("cycles Light → Dark → System", async () => {
      renderSwitcher(true);

      // Starts on System, so the first press moves to Light.
      await userEvent.click(screen.getByRole("button", { name: /Theme:/ }));
      expect(screen.getByRole("button", { name: /Theme: Light/ })).toBeInTheDocument();

      await userEvent.click(screen.getByRole("button", { name: /Theme:/ }));
      expect(screen.getByRole("button", { name: /Theme: Dark/ })).toBeInTheDocument();

      await userEvent.click(screen.getByRole("button", { name: /Theme:/ }));
      expect(screen.getByRole("button", { name: /Theme: System/ })).toBeInTheDocument();
    });
  });
});
