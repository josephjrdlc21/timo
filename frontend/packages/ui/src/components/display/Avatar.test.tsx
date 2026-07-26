import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Avatar } from "./Avatar";

describe("Avatar", () => {
  describe("fallback chain", () => {
    it("renders the image when src is given, using alt as the accessible name", () => {
      const { container } = render(<Avatar src="/me.png" alt="Jane Doe" />);

      const img = screen.getByRole("img", { name: "Jane Doe" });
      expect(img).toHaveAttribute("src", "/me.png");
      // An image avatar is not a placeholder.
      expect(container.firstChild).not.toHaveClass("avatar-placeholder");
    });

    it("falls back to the name for alt text", () => {
      render(<Avatar src="/me.png" name="Jane Doe" />);
      expect(screen.getByRole("img", { name: "Jane Doe" })).toBeInTheDocument();
    });

    it("falls back to initials when there is no src", () => {
      const { container } = render(<Avatar name="Jane Doe" />);
      expect(screen.getByText("JD")).toBeInTheDocument();
      expect(container.firstChild).toHaveClass("avatar-placeholder");
    });

    it("falls back to an icon when there is neither src nor name", () => {
      const { container } = render(<Avatar />);
      expect(container.querySelector("svg")).toBeInTheDocument();
    });

    it("uses a custom icon over the default glyph", () => {
      render(<Avatar icon={<span data-testid="custom" />} />);
      expect(screen.getByTestId("custom")).toBeInTheDocument();
    });
  });

  describe("initials", () => {
    it.each([
      ["Jane Doe", "JD"],
      ["Jane", "J"],
      ["jane van der berg", "JB"],
      ["  Jane   Doe  ", "JD"],
    ])("derives %s → %s", (name, expected) => {
      render(<Avatar name={name} />);
      expect(screen.getByText(expected)).toBeInTheDocument();
    });
  });

  describe("variants", () => {
    it.each([
      ["xs", "h-8"],
      ["md", "h-12"],
      ["xl", "h-24"],
    ] as const)("applies the %s size class", (size, expected) => {
      const { container } = render(<Avatar name="J" size={size} />);
      expect(container.querySelector(".avatar > div")).toHaveClass(expected);
    });

    it.each([
      ["circle", "rounded-full"],
      ["rounded", "rounded-xl"],
      ["square", "rounded-none"],
    ] as const)("applies the %s shape class", (shape, expected) => {
      const { container } = render(<Avatar name="J" shape={shape} />);
      expect(container.querySelector(".avatar > div")).toHaveClass(expected);
    });

    it.each([
      ["online", "avatar-online"],
      ["offline", "avatar-offline"],
    ] as const)("applies the %s presence class", (status, expected) => {
      const { container } = render(<Avatar name="J" status={status} />);
      expect(container.firstChild).toHaveClass(expected);
    });

    it("merges className and forwards extra props to the root", () => {
      render(<Avatar name="J" className="ring" data-testid="avatar" />);
      expect(screen.getByTestId("avatar")).toHaveClass("avatar", "ring");
    });
  });
});
