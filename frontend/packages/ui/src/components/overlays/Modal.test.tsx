import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Modal } from "./Modal";

const noop = () => {};

describe("Modal", () => {
  describe("rendering and state", () => {
    it("opens the native dialog when `open` is true", () => {
      render(
        <Modal open onClose={noop} title="Settings">
          Body
        </Modal>,
      );

      const dialog = screen.getByRole("dialog");
      expect(dialog).toBeInstanceOf(HTMLDialogElement);
      expect((dialog as HTMLDialogElement).open).toBe(true);
      expect(screen.getByRole("heading", { level: 2, name: "Settings" })).toBeInTheDocument();
      expect(screen.getByText("Body")).toBeInTheDocument();
    });

    it("keeps the dialog closed when `open` is false", () => {
      const { container } = render(
        <Modal open={false} onClose={noop} title="Settings">
          Body
        </Modal>,
      );

      const dialog = container.querySelector("dialog");
      expect(dialog?.open).toBe(false);
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("opens and closes as `open` flips, without throwing on a repeated value", () => {
      const { container, rerender } = render(
        <Modal open={false} onClose={noop}>
          Body
        </Modal>,
      );
      const dialog = container.querySelector("dialog") as HTMLDialogElement;

      rerender(
        <Modal open onClose={noop}>
          Body
        </Modal>,
      );
      expect(dialog.open).toBe(true);

      // showModal() throws on an already-open dialog — this asserts the guard.
      rerender(
        <Modal open onClose={noop}>
          Body
        </Modal>,
      );
      expect(dialog.open).toBe(true);

      rerender(
        <Modal open={false} onClose={noop}>
          Body
        </Modal>,
      );
      expect(dialog.open).toBe(false);
    });

    it("renders the subtitle and footer when given", () => {
      render(
        <Modal
          open
          onClose={noop}
          title="Settings"
          subtitle="Manage your preferences"
          footer={<button type="button">Save</button>}
        >
          Body
        </Modal>,
      );

      expect(screen.getByText("Manage your preferences")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
    });

    it("lets titleContent and subtitleContent replace the defaults", () => {
      render(
        <Modal
          open
          onClose={noop}
          title="ignored"
          titleContent={<h2>Custom heading</h2>}
          subtitle="ignored too"
          subtitleContent={<p>Custom subtitle</p>}
        >
          Body
        </Modal>,
      );

      expect(screen.getByRole("heading", { name: "Custom heading" })).toBeInTheDocument();
      expect(screen.getByText("Custom subtitle")).toBeInTheDocument();
      expect(screen.queryByText("ignored")).not.toBeInTheDocument();
      expect(screen.queryByText("ignored too")).not.toBeInTheDocument();
    });

    it("omits the header entirely when there is no title or subtitle", () => {
      render(
        <Modal open onClose={noop}>
          Body
        </Modal>,
      );
      expect(screen.queryByRole("heading")).not.toBeInTheDocument();
    });

    it.each([
      ["sm", "max-w-sm"],
      ["lg", "max-w-2xl"],
      ["full", "w-11/12"],
    ] as const)("applies the %s size class to the box", (size, expected) => {
      const { container } = render(
        <Modal open onClose={noop} size={size}>
          Body
        </Modal>,
      );
      expect(container.querySelector(".modal-box")).toHaveClass(expected);
    });

    it.each([
      ["top", "modal-top"],
      ["bottom", "modal-bottom"],
      ["middle", "modal-middle"],
    ] as const)("applies the %s align class to the dialog", (align, expected) => {
      render(
        <Modal open onClose={noop} align={align}>
          Body
        </Modal>,
      );
      expect(screen.getByRole("dialog")).toHaveClass(expected);
    });

    it("merges className onto the box rather than replacing it", () => {
      const { container } = render(
        <Modal open onClose={noop} className="bg-red-50">
          Body
        </Modal>,
      );
      expect(container.querySelector(".modal-box")).toHaveClass("modal-box", "bg-red-50");
    });
  });

  describe("ARIA wiring", () => {
    it("points aria-labelledby and aria-describedby at the default header text", () => {
      render(
        <Modal open onClose={noop} title="Settings" subtitle="Manage your preferences">
          Body
        </Modal>,
      );

      const dialog = screen.getByRole("dialog");
      const heading = screen.getByRole("heading", { name: "Settings" });
      const subtitle = screen.getByText("Manage your preferences");

      expect(dialog).toHaveAttribute("aria-labelledby", heading.id);
      expect(dialog).toHaveAttribute("aria-describedby", subtitle.id);
    });

    it("drops the references when the caller supplies JSX overrides", () => {
      render(
        <Modal
          open
          onClose={noop}
          titleContent={<h2>Custom</h2>}
          subtitleContent={<p>Custom sub</p>}
        >
          Body
        </Modal>,
      );

      const dialog = screen.getByRole("dialog");
      // The generated ids live on the default elements only, so referencing
      // them here would point at nothing.
      expect(dialog).not.toHaveAttribute("aria-labelledby");
      expect(dialog).not.toHaveAttribute("aria-describedby");
    });

    it("gives the close button an accessible name", () => {
      render(
        <Modal open onClose={noop}>
          Body
        </Modal>,
      );
      expect(screen.getAllByRole("button", { name: "Close" }).length).toBeGreaterThan(0);
    });
  });

  describe("keyboard and close paths", () => {
    it("closes on Escape and reports it through onClose", async () => {
      const onClose = vi.fn();
      render(
        <Modal open onClose={onClose}>
          Body
        </Modal>,
      );

      await userEvent.keyboard("{Escape}");

      expect(onClose).toHaveBeenCalledOnce();
    });

    it("closes when the X button is pressed", async () => {
      const onClose = vi.fn();
      render(
        <Modal open onClose={onClose} closeOnBackdrop={false}>
          Body
        </Modal>,
      );

      await userEvent.click(screen.getByRole("button", { name: "Close" }));

      expect(onClose).toHaveBeenCalledOnce();
    });

    it("hides the X button when showCloseButton is false", () => {
      render(
        <Modal open onClose={noop} showCloseButton={false} closeOnBackdrop={false}>
          Body
        </Modal>,
      );
      expect(screen.queryByRole("button", { name: "Close" })).not.toBeInTheDocument();
    });

    it("omits the backdrop close form when closeOnBackdrop is false", () => {
      const { container } = render(
        <Modal open onClose={noop} closeOnBackdrop={false}>
          Body
        </Modal>,
      );
      expect(container.querySelector(".modal-backdrop")).not.toBeInTheDocument();
    });

    it("opens modally, which is what buys focus trapping and an inert background", () => {
      // The trapping itself belongs to the browser's top layer, which jsdom has
      // no concept of — asserting it here would only exercise the polyfill. What
      // is worth pinning down is the call that earns it: showModal(), not show().
      const showModal = vi.spyOn(HTMLDialogElement.prototype, "showModal");
      const show = vi.spyOn(HTMLDialogElement.prototype, "show");

      render(
        <Modal open onClose={noop}>
          Body
        </Modal>,
      );

      expect(showModal).toHaveBeenCalledOnce();
      expect(show).not.toHaveBeenCalled();

      showModal.mockRestore();
      show.mockRestore();
    });

    it("moves focus into the dialog's own controls", async () => {
      render(
        <Modal open onClose={noop} showCloseButton={false} closeOnBackdrop={false}>
          <button type="button">First</button>
          <button type="button">Second</button>
        </Modal>,
      );

      screen.getByRole("button", { name: "First" }).focus();
      await userEvent.tab();

      expect(screen.getByRole("button", { name: "Second" })).toHaveFocus();
    });
  });
});
