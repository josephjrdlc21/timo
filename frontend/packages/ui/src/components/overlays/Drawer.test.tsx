import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Drawer } from "./Drawer";

const noop = () => {};

describe("Drawer", () => {
  describe("rendering and state", () => {
    it("opens the native dialog when `open` is true", () => {
      render(
        <Drawer open onClose={noop} title="Filters">
          Body
        </Drawer>,
      );

      const dialog = screen.getByRole("dialog");
      expect((dialog as HTMLDialogElement).open).toBe(true);
      expect(screen.getByRole("heading", { level: 2, name: "Filters" })).toBeInTheDocument();
    });

    it("stays closed when `open` is false", () => {
      const { container } = render(
        <Drawer open={false} onClose={noop}>
          Body
        </Drawer>,
      );
      expect(container.querySelector("dialog")?.open).toBe(false);
    });

    it("opens and closes as `open` flips", () => {
      const { container, rerender } = render(
        <Drawer open={false} onClose={noop}>
          Body
        </Drawer>,
      );
      const dialog = container.querySelector("dialog") as HTMLDialogElement;

      rerender(
        <Drawer open onClose={noop}>
          Body
        </Drawer>,
      );
      expect(dialog.open).toBe(true);

      rerender(
        <Drawer open={false} onClose={noop}>
          Body
        </Drawer>,
      );
      expect(dialog.open).toBe(false);
    });

    it("renders the subtitle and footer", () => {
      render(
        <Drawer
          open
          onClose={noop}
          title="Filters"
          subtitle="Narrow the list"
          footer={<button type="button">Apply</button>}
        >
          Body
        </Drawer>,
      );
      expect(screen.getByText("Narrow the list")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Apply" })).toBeInTheDocument();
    });

    it("lets titleContent and subtitleContent replace the defaults", () => {
      render(
        <Drawer
          open
          onClose={noop}
          title="ignored"
          titleContent={<h2>Custom</h2>}
          subtitleContent={<p>Custom sub</p>}
        >
          Body
        </Drawer>,
      );
      expect(screen.getByRole("heading", { name: "Custom" })).toBeInTheDocument();
      expect(screen.queryByText("ignored")).not.toBeInTheDocument();
    });
  });

  describe("side and size", () => {
    it.each([
      ["left", "modal-start"],
      ["right", "modal-end"],
      ["top", "modal-top"],
      ["bottom", "modal-bottom"],
    ] as const)("anchors to the %s edge", (side, expected) => {
      render(
        <Drawer open onClose={noop} side={side}>
          Body
        </Drawer>,
      );
      expect(screen.getByRole("dialog")).toHaveClass(expected);
    });

    it("sizes the width for left / right drawers", () => {
      const { container } = render(
        <Drawer open onClose={noop} side="right" size="lg">
          Body
        </Drawer>,
      );
      expect(container.querySelector(".modal-box")).toHaveClass("w-[32rem]");
    });

    it("sizes the height for top / bottom drawers", () => {
      const { container } = render(
        <Drawer open onClose={noop} side="bottom" size="lg">
          Body
        </Drawer>,
      );
      expect(container.querySelector(".modal-box")).toHaveClass("h-1/2");
    });

    it("merges className onto the panel", () => {
      const { container } = render(
        <Drawer open onClose={noop} className="p-0">
          Body
        </Drawer>,
      );
      expect(container.querySelector(".modal-box")).toHaveClass("modal-box", "p-0");
    });
  });

  describe("ARIA wiring", () => {
    it("points aria-labelledby and aria-describedby at the default header text", () => {
      render(
        <Drawer open onClose={noop} title="Filters" subtitle="Narrow the list">
          Body
        </Drawer>,
      );

      const dialog = screen.getByRole("dialog");
      expect(dialog).toHaveAttribute(
        "aria-labelledby",
        screen.getByRole("heading", { name: "Filters" }).id,
      );
      expect(dialog).toHaveAttribute("aria-describedby", screen.getByText("Narrow the list").id);
    });

    it("drops the references when the caller supplies JSX overrides", () => {
      render(
        <Drawer open onClose={noop} titleContent={<h2>Custom</h2>}>
          Body
        </Drawer>,
      );
      expect(screen.getByRole("dialog")).not.toHaveAttribute("aria-labelledby");
    });
  });

  describe("keyboard and close paths", () => {
    it("closes on Escape and reports it through onClose", async () => {
      const onClose = vi.fn();
      render(
        <Drawer open onClose={onClose}>
          Body
        </Drawer>,
      );

      await userEvent.keyboard("{Escape}");

      expect(onClose).toHaveBeenCalledOnce();
    });

    it("closes when the X button is pressed", async () => {
      const onClose = vi.fn();
      render(
        <Drawer open onClose={onClose} closeOnBackdrop={false}>
          Body
        </Drawer>,
      );

      await userEvent.click(screen.getByRole("button", { name: "Close" }));

      expect(onClose).toHaveBeenCalledOnce();
    });

    it("hides the X button and the backdrop form when told to", () => {
      const { container } = render(
        <Drawer open onClose={noop} showCloseButton={false} closeOnBackdrop={false}>
          Body
        </Drawer>,
      );
      expect(screen.queryByRole("button", { name: "Close" })).not.toBeInTheDocument();
      expect(container.querySelector(".modal-backdrop")).not.toBeInTheDocument();
    });

    it("opens modally, which is what buys focus trapping and an inert background", () => {
      const showModal = vi.spyOn(HTMLDialogElement.prototype, "showModal");

      render(
        <Drawer open onClose={noop}>
          Body
        </Drawer>,
      );

      expect(showModal).toHaveBeenCalledOnce();
      showModal.mockRestore();
    });
  });
});
