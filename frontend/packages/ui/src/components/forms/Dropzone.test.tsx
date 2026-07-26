import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Dropzone } from "./Dropzone";

const fileOf = (name: string, size = 4, lastModified = 1) => {
  const file = new File(["x".repeat(size)], name, { type: "text/plain" });
  Object.defineProperty(file, "lastModified", { value: lastModified });
  return file;
};

/** Drop events need a DataTransfer-shaped payload; jsdom has no constructor. */
const dropWith = (zone: HTMLElement, files: File[]) =>
  fireEvent.drop(zone, { dataTransfer: { files, items: [], types: ["Files"] } });

describe("Dropzone", () => {
  describe("rendering", () => {
    it("renders the default prompt", () => {
      render(<Dropzone />);
      expect(screen.getByText("Drag & drop files here")).toBeInTheDocument();
      expect(screen.getByText("or click to browse")).toBeInTheDocument();
    });

    it("takes custom prompt copy and an icon", () => {
      render(
        <Dropzone title="Drop a CSV" description="Max 5 MB" icon={<span data-testid="i" />} />,
      );
      expect(screen.getByText("Drop a CSV")).toBeInTheDocument();
      expect(screen.getByText("Max 5 MB")).toBeInTheDocument();
      expect(screen.getByTestId("i")).toBeInTheDocument();
    });

    it("shows the error, flags aria-invalid, and applies the error border", () => {
      render(<Dropzone error="Wrong type" />);

      const zone = screen.getByRole("button");
      expect(zone).toHaveAttribute("aria-invalid", "true");
      expect(zone).toHaveClass("border-error/50");
      expect(screen.getByText("Wrong type")).toHaveClass("text-error");
    });

    it("shows the hint when there is no error", () => {
      render(<Dropzone hint="CSV only" />);
      expect(screen.getByText("CSV only")).toBeInTheDocument();
    });

    it("passes accept and multiple to the hidden input", () => {
      const { container } = render(<Dropzone accept=".csv" multiple />);
      const input = container.querySelector('input[type="file"]');
      expect(input).toHaveAttribute("accept", ".csv");
      expect(input).toHaveAttribute("multiple");
    });
  });

  describe("selection", () => {
    it("lists a dropped file with its formatted size, and reports it", () => {
      const onFilesChange = vi.fn();
      render(<Dropzone onFilesChange={onFilesChange} />);

      dropWith(screen.getByRole("button"), [fileOf("notes.txt", 1536)]);

      expect(onFilesChange).toHaveBeenCalledWith([expect.objectContaining({ name: "notes.txt" })]);
      expect(screen.getByText("notes.txt")).toBeInTheDocument();
      expect(screen.getByText("1.5 KB")).toBeInTheDocument();
    });

    it("keeps only the last file when not multiple", () => {
      const onFilesChange = vi.fn();
      render(<Dropzone onFilesChange={onFilesChange} />);
      const zone = screen.getByRole("button");

      dropWith(zone, [fileOf("a.txt")]);
      dropWith(zone, [fileOf("b.txt")]);

      expect(screen.queryByText("a.txt")).not.toBeInTheDocument();
      expect(screen.getByText("b.txt")).toBeInTheDocument();
    });

    it("appends when multiple, skipping duplicates", () => {
      render(<Dropzone multiple />);
      const zone = screen.getByRole("button");

      dropWith(zone, [fileOf("a.txt", 4, 1)]);
      dropWith(zone, [fileOf("b.txt", 4, 2)]);
      // Same name, size, and mtime — the same file as far as de-duping goes.
      dropWith(zone, [fileOf("a.txt", 4, 1)]);

      expect(screen.getAllByRole("listitem")).toHaveLength(2);
    });

    it("removes a file from the list", async () => {
      const onFilesChange = vi.fn();
      render(<Dropzone onFilesChange={onFilesChange} />);

      dropWith(screen.getByRole("button"), [fileOf("notes.txt")]);
      await userEvent.click(screen.getByRole("button", { name: "Remove notes.txt" }));

      expect(screen.queryByText("notes.txt")).not.toBeInTheDocument();
      expect(onFilesChange).toHaveBeenLastCalledWith([]);
    });

    it("hides the list when asked", () => {
      render(<Dropzone hideFileList />);
      dropWith(screen.getByRole("button"), [fileOf("notes.txt")]);
      expect(screen.queryByText("notes.txt")).not.toBeInTheDocument();
    });

    it("renders the files it is given when controlled", () => {
      render(<Dropzone files={[fileOf("fixed.txt")]} />);
      expect(screen.getByText("fixed.txt")).toBeInTheDocument();
    });

    it("formats sizes across units", () => {
      render(<Dropzone multiple />);
      dropWith(screen.getByRole("button"), [
        fileOf("zero.txt", 0, 1),
        fileOf("bytes.txt", 512, 2),
        fileOf("mega.txt", 1024 * 1024 * 2, 3),
      ]);

      expect(screen.getByText("0 B")).toBeInTheDocument();
      expect(screen.getByText("512 B")).toBeInTheDocument();
      expect(screen.getByText("2.0 MB")).toBeInTheDocument();
    });
  });

  describe("drag state", () => {
    it("highlights while dragging and clears on leave", () => {
      render(<Dropzone />);
      const zone = screen.getByRole("button");

      fireEvent.dragEnter(zone);
      expect(zone).toHaveClass("border-primary");

      fireEvent.dragLeave(zone);
      expect(zone).not.toHaveClass("border-primary");
    });

    it("stays highlighted while dragging over a nested child", () => {
      render(<Dropzone />);
      const zone = screen.getByRole("button");

      // Two enters, one leave: the depth counter is what stops the highlight
      // flickering as the pointer crosses child elements.
      fireEvent.dragEnter(zone);
      fireEvent.dragEnter(zone);
      fireEvent.dragLeave(zone);

      expect(zone).toHaveClass("border-primary");
    });

    it("clears the highlight after a drop", () => {
      render(<Dropzone />);
      const zone = screen.getByRole("button");

      fireEvent.dragEnter(zone);
      dropWith(zone, [fileOf("a.txt")]);

      expect(zone).not.toHaveClass("border-primary");
    });
  });

  describe("keyboard and disabled state", () => {
    it("opens the file browser on Enter and Space", async () => {
      const { container } = render(<Dropzone />);
      const input = container.querySelector('input[type="file"]') as HTMLInputElement;
      const click = vi.spyOn(input, "click").mockImplementation(() => {});

      screen.getByRole("button").focus();
      await userEvent.keyboard("{Enter}");
      await userEvent.keyboard(" ");

      expect(click).toHaveBeenCalledTimes(2);
    });

    it("is reachable by keyboard when enabled and skipped when disabled", () => {
      const { rerender } = render(<Dropzone />);
      expect(screen.getByRole("button")).toHaveAttribute("tabindex", "0");

      rerender(<Dropzone disabled />);
      const zone = screen.getByRole("button");
      expect(zone).toHaveAttribute("tabindex", "-1");
      expect(zone).toHaveAttribute("aria-disabled", "true");
    });

    it("ignores drops when disabled", () => {
      const onFilesChange = vi.fn();
      render(<Dropzone disabled onFilesChange={onFilesChange} />);

      dropWith(screen.getByRole("button"), [fileOf("a.txt")]);

      expect(onFilesChange).not.toHaveBeenCalled();
    });

    it("hides the remove button when disabled", () => {
      render(<Dropzone disabled files={[fileOf("fixed.txt")]} />);
      expect(screen.queryByRole("button", { name: /remove/i })).not.toBeInTheDocument();
    });
  });
});
