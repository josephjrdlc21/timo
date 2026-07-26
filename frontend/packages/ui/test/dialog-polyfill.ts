/**
 * jsdom 29 ships `HTMLDialogElement` but almost none of its behaviour: no
 * `showModal`, no `close`, no `close` event, no Escape-to-close, and no
 * `form[method="dialog"]` submission. `Modal`, `Drawer`, and `ConfirmModal` are
 * built on exactly those, so without this they throw on first render.
 *
 * This models only the parts those components observe. It deliberately does
 * NOT model focus trapping or background inertness: those come from the
 * browser's top layer, which jsdom has no concept of, and simulating them would
 * mean the tests assert against this file rather than against a real browser.
 * Tests therefore verify that a component opens via `showModal()` — the call
 * that buys trapping and inertness — and leave the trapping itself to the
 * platform.
 */

const NOT_A_DIALOG = "The element is not a dialog";

function markOpen(dialog: HTMLDialogElement, open: boolean) {
  if (open) dialog.setAttribute("open", "");
  else dialog.removeAttribute("open");
}

/** Topmost currently-open modal dialog, which is what a close request targets. */
const openModals: HTMLDialogElement[] = [];

export function installDialogPolyfill() {
  if (typeof HTMLDialogElement === "undefined") return;
  // Real implementation present (a future jsdom, or a browser) — leave it alone.
  if (typeof HTMLDialogElement.prototype.showModal === "function") return;

  HTMLDialogElement.prototype.show = function show(this: HTMLDialogElement) {
    if (this.open) return;
    markOpen(this, true);
  };

  HTMLDialogElement.prototype.showModal = function showModal(this: HTMLDialogElement) {
    if (this.open) {
      throw new DOMException(`${NOT_A_DIALOG} or is already open`, "InvalidStateError");
    }
    markOpen(this, true);
    openModals.push(this);
  };

  HTMLDialogElement.prototype.close = function close(
    this: HTMLDialogElement,
    returnValue?: string,
  ) {
    if (!this.open) return;
    markOpen(this, false);
    const index = openModals.indexOf(this);
    if (index !== -1) openModals.splice(index, 1);
    if (returnValue !== undefined) this.returnValue = returnValue;
    this.dispatchEvent(new Event("close"));
  };

  // A modal dialog closes on Escape in every browser. Components rely on the
  // resulting `close` event, so the close request has to exist here too.
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    const top = openModals[openModals.length - 1];
    top?.close();
  });

  // `<form method="dialog">` closes its dialog on submit instead of navigating.
  // That is how the X and backdrop buttons work.
  document.addEventListener("submit", (event) => {
    const form = event.target as HTMLFormElement;
    if (form.getAttribute("method")?.toLowerCase() !== "dialog") return;
    event.preventDefault();
    form.closest("dialog")?.close();
  });
}
