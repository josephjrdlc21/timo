import { renderHook } from "@testing-library/react";
import { LayoutGrid } from "lucide-react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import type { ReactNode } from "react";
import { useBreadcrumb } from "./useBreadcrumb";

const atPath = (path: string) => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <MemoryRouter initialEntries={[path]}>{children}</MemoryRouter>
  );
  return renderHook(() => useBreadcrumb(), { wrapper }).result.current;
};

describe("useBreadcrumb", () => {
  it("returns the trail for a mapped route", () => {
    expect(atPath("/")).toEqual([
      { label: "Overview", icon: LayoutGrid, href: "/" },
      { label: "Dashboard" },
    ]);
  });

  it("returns an empty trail for an unmapped route", () => {
    expect(atPath("/not-a-route")).toEqual([]);
  });
});
