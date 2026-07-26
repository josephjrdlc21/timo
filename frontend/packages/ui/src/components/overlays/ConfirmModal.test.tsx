import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ConfirmModal } from "./ConfirmModal";

const noop = () => {};

describe("ConfirmModal", () => {
  describe("variant defaults", () => {
    it("uses the neutral question and Confirm label by default", () => {
      render(<ConfirmModal open onClose={noop} onConfirm={noop} />);

      expect(screen.getByRole("heading", { name: "Are you sure?" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Confirm" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
    });

    it("uses the destructive question and Delete label for danger", () => {
      render(<ConfirmModal open onClose={noop} onConfirm={noop} variant="danger" />);

      expect(screen.getByRole("heading", { name: "Delete item?" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Delete" })).toHaveClass("btn-error");
    });

    it("uses the primary colour for the confirm flow", () => {
      render(<ConfirmModal open onClose={noop} onConfirm={noop} />);
      expect(screen.getByRole("button", { name: "Confirm" })).toHaveClass("btn-primary");
    });

    it("takes custom titles and labels", () => {
      render(
        <ConfirmModal
          open
          onClose={noop}
          onConfirm={noop}
          title="Discard draft?"
          confirmLabel="Discard"
          cancelLabel="Keep editing"
        />,
      );

      expect(screen.getByRole("heading", { name: "Discard draft?" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Discard" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Keep editing" })).toBeInTheDocument();
    });
  });

  describe("body and icon", () => {
    it("renders the description and falls back to children", () => {
      const { rerender } = render(
        <ConfirmModal open onClose={noop} onConfirm={noop} description="This cannot be undone." />,
      );
      expect(screen.getByText("This cannot be undone.")).toBeInTheDocument();

      rerender(
        <ConfirmModal open onClose={noop} onConfirm={noop}>
          From children
        </ConfirmModal>,
      );
      expect(screen.getByText("From children")).toBeInTheDocument();
    });

    it("shows a warning icon for danger and none for confirm", () => {
      const { container, rerender } = render(
        <ConfirmModal open onClose={noop} onConfirm={noop} variant="danger" description="x" />,
      );
      expect(container.querySelectorAll(".modal-box svg").length).toBeGreaterThan(0);

      rerender(
        <ConfirmModal
          open
          onClose={noop}
          onConfirm={noop}
          variant="danger"
          icon={null}
          description="x"
        />,
      );
      // Only the X close button's glyph should be left.
      expect(container.querySelector(".flex.gap-3 span")).not.toBeInTheDocument();
    });
  });

  describe("confirm and cancel", () => {
    it("calls onConfirm when the confirm button is pressed", async () => {
      const onConfirm = vi.fn();
      render(<ConfirmModal open onClose={noop} onConfirm={onConfirm} />);

      await userEvent.click(screen.getByRole("button", { name: "Confirm" }));

      expect(onConfirm).toHaveBeenCalledOnce();
    });

    it("calls onClose when cancel is pressed", async () => {
      const onClose = vi.fn();
      render(<ConfirmModal open onClose={onClose} onConfirm={noop} />);

      await userEvent.click(screen.getByRole("button", { name: "Cancel" }));

      expect(onClose).toHaveBeenCalledOnce();
    });

    it("closes on Escape when idle", async () => {
      const onClose = vi.fn();
      render(<ConfirmModal open onClose={onClose} onConfirm={noop} />);

      await userEvent.keyboard("{Escape}");

      expect(onClose).toHaveBeenCalledOnce();
    });
  });

  describe("while a confirm is in flight", () => {
    it("spins the confirm button and locks every close path", async () => {
      // A promise we control, so the pending window stays open for assertions.
      let settle: () => void = () => {};
      const onConfirm = vi.fn(() => new Promise<void>((resolve) => (settle = resolve)));
      const onClose = vi.fn();

      render(<ConfirmModal open onClose={onClose} onConfirm={onConfirm} />);
      await userEvent.click(screen.getByRole("button", { name: "Confirm" }));

      const confirm = screen.getByRole("button", { name: "Confirm" });
      expect(confirm).toHaveAttribute("aria-busy", "true");
      expect(confirm).toBeDisabled();
      expect(screen.getByRole("button", { name: "Cancel" })).toBeDisabled();
      // The X and the backdrop form are pulled while busy.
      expect(screen.queryByRole("button", { name: "Close" })).not.toBeInTheDocument();

      await userEvent.keyboard("{Escape}");
      expect(onClose).not.toHaveBeenCalled();

      settle();
    });

    it("releases the lock once the promise settles", async () => {
      let settle: () => void = () => {};
      const onConfirm = vi.fn(() => new Promise<void>((resolve) => (settle = resolve)));

      render(<ConfirmModal open onClose={noop} onConfirm={onConfirm} />);
      await userEvent.click(screen.getByRole("button", { name: "Confirm" }));
      expect(screen.queryByRole("button", { name: "Close" })).not.toBeInTheDocument();

      await act(async () => {
        settle();
      });

      await waitFor(() => {
        expect(screen.getByRole("button", { name: "Cancel" })).not.toBeDisabled();
      });
      // Both close affordances come back: the X and the backdrop's own button.
      expect(screen.getAllByRole("button", { name: "Close" })).toHaveLength(2);
    });

    it("honours an externally-controlled loading flag", () => {
      render(<ConfirmModal open onClose={noop} onConfirm={noop} loading />);

      expect(screen.getByRole("button", { name: "Confirm" })).toHaveAttribute("aria-busy", "true");
      expect(screen.getByRole("button", { name: "Cancel" })).toBeDisabled();
    });
  });
});
