import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import { installDialogPolyfill } from "./dialog-polyfill";

installDialogPolyfill();

afterEach(() => {
  cleanup();
});
