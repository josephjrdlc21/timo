import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { MobileDrawer } from "./MobileDrawer";

const noop = () => {};

/**
 * The focus trap filters candidates on `offsetParent !== null` to skip
 * anything CSS has hidden. jsdom does no layout, so `offsetParent` is always
 * null there and every candidate would be filtered out — the trap would look
 * like it does nothing. Neutralising the check is what lets the trap's actual
 * logic run; the visibility filter itself is a browser concern.
 */
const offsetParent = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "offsetParent");

beforeAll(() => {
  Object.defineProperty(HTMLElement.prototype, "offsetParent", {
    configurable: true,
    get() {
      return this.ownerDocument.body;
    },
  });
});

afterAll(() => {
  if (offsetParent) Object.defineProperty(HTMLElement.prototype, "offsetParent", offsetParent);
});

describe("MobileDrawer", () => {
  describe("rendering", () => {
    it("exposes a labelled modal dialog", () => {
      render(
        <MobileDrawer open onClose={noop} label="Navigation">
          <a href="/one">One</a>
        </MobileDrawer>,
      );

      const dialog = screen.getByRole("dialog", { name: "Navigation" });
      expect(dialog).toHaveAttribute("aria-modal", "true");
    });

    it("stays mounted but inert when closed", () => {
      const { container } = render(
        <MobileDrawer open={false} onClose={noop} label="Navigation">
          <a href="/one">One</a>
        </MobileDrawer>,
      );

      const root = container.firstChild as HTMLElement;
      expect(root).toHaveAttribute("aria-hidden", "true");
      expect(root).toHaveClass("pointer-events-none");
      // Kept in the DOM so the panel can transition rather than pop.
      expect(root.querySelector("aside")).toHaveClass("-translate-x-full");
    });

    it("slides the panel in when open", () => {
      const { container } = render(
        <MobileDrawer open onClose={noop} label="Navigation">
          <a href="/one">One</a>
        </MobileDrawer>,
      );
      expect(container.querySelector("aside")).toHaveClass("translate-x-0");
    });

    it("takes its close button out of the tab order while closed", () => {
      const { container } = render(
        <MobileDrawer open={false} onClose={noop} label="Navigation">
          <a href="/one">One</a>
        </MobileDrawer>,
      );
      // Queried by selector, not role: the closed root is aria-hidden, so the
      // button is (correctly) absent from the accessibility tree.
      expect(container.querySelector('button[aria-label="Close navigation menu"]')).toHaveAttribute(
        "tabindex",
        "-1",
      );
    });
  });

  describe("close paths", () => {
    it("closes on the close button", async () => {
      const onClose = vi.fn();
      render(
        <MobileDrawer open onClose={onClose} label="Navigation">
          <a href="/one">One</a>
        </MobileDrawer>,
      );

      await userEvent.click(screen.getByRole("button", { name: "Close navigation menu" }));

      expect(onClose).toHaveBeenCalledOnce();
    });

    it("closes on Escape", async () => {
      const onClose = vi.fn();
      render(
        <MobileDrawer open onClose={onClose} label="Navigation">
          <a href="/one">One</a>
        </MobileDrawer>,
      );

      await userEvent.keyboard("{Escape}");

      expect(onClose).toHaveBeenCalledOnce();
    });

    it("closes on a backdrop click", async () => {
      const onClose = vi.fn();
      const { container } = render(
        <MobileDrawer open onClose={onClose} label="Navigation">
          <a href="/one">One</a>
        </MobileDrawer>,
      );

      await userEvent.click(container.querySelector(".bg-black\\/40") as HTMLElement);

      expect(onClose).toHaveBeenCalledOnce();
    });

    it("ignores Escape while closed", async () => {
      const onClose = vi.fn();
      render(
        <MobileDrawer open={false} onClose={onClose} label="Navigation">
          <a href="/one">One</a>
        </MobileDrawer>,
      );

      await userEvent.keyboard("{Escape}");

      expect(onClose).not.toHaveBeenCalled();
    });
  });

  describe("focus management", () => {
    it("moves focus into the drawer when it opens", async () => {
      const { rerender } = render(
        <MobileDrawer open={false} onClose={noop} label="Navigation">
          <a href="/one">One</a>
        </MobileDrawer>,
      );

      rerender(
        <MobileDrawer open onClose={noop} label="Navigation">
          <a href="/one">One</a>
        </MobileDrawer>,
      );

      // The close button is the first focusable in DOM order.
      expect(await screen.findByRole("button", { name: "Close navigation menu" })).toHaveFocus();
    });

    it("wraps Tab from the last focusable back to the first", async () => {
      render(
        <MobileDrawer open onClose={noop} label="Navigation">
          <a href="/one">One</a>
        </MobileDrawer>,
      );

      const close = screen.getByRole("button", { name: "Close navigation menu" });
      const link = screen.getByRole("link", { name: "One" });

      link.focus();
      await userEvent.tab();

      expect(close).toHaveFocus();
    });

    it("wraps Shift+Tab from the first focusable back to the last", async () => {
      render(
        <MobileDrawer open onClose={noop} label="Navigation">
          <a href="/one">One</a>
        </MobileDrawer>,
      );

      const close = screen.getByRole("button", { name: "Close navigation menu" });
      close.focus();

      await userEvent.tab({ shift: true });

      expect(screen.getByRole("link", { name: "One" })).toHaveFocus();
    });

    it("restores focus to the opener on close", async () => {
      const opener = document.createElement("button");
      document.body.appendChild(opener);
      opener.focus();

      const { rerender } = render(
        <MobileDrawer open onClose={noop} label="Navigation">
          <a href="/one">One</a>
        </MobileDrawer>,
      );

      rerender(
        <MobileDrawer open={false} onClose={noop} label="Navigation">
          <a href="/one">One</a>
        </MobileDrawer>,
      );

      expect(opener).toHaveFocus();
      opener.remove();
    });
  });

  it("locks body scroll while open and restores it on close", () => {
    const { rerender } = render(
      <MobileDrawer open onClose={noop} label="Navigation">
        <a href="/one">One</a>
      </MobileDrawer>,
    );
    expect(document.body.style.overflow).toBe("hidden");

    rerender(
      <MobileDrawer open={false} onClose={noop} label="Navigation">
        <a href="/one">One</a>
      </MobileDrawer>,
    );
    expect(document.body.style.overflow).not.toBe("hidden");
  });
});
