/** @vitest-environment jsdom */

import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ThemeToggle } from "@/components/theme-toggle";

function createMatchMedia(matches: boolean) {
  const listeners = new Set<(event: MediaQueryListEvent) => void>();

  const mediaQuery = {
    matches,
    media: "(prefers-color-scheme: dark)",
    onchange: null,
    addEventListener: (_: "change", listener: (event: MediaQueryListEvent) => void) => {
      listeners.add(listener);
    },
    removeEventListener: (_: "change", listener: (event: MediaQueryListEvent) => void) => {
      listeners.delete(listener);
    },
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  } as unknown as MediaQueryList;

  return { mediaQuery, listeners };
}

describe("ThemeToggle", () => {
  afterEach(() => {
    cleanup();
  });

  beforeEach(() => {
    document.documentElement.dataset.theme = "light";
    const storage = new Map<string, string>();
    vi.stubGlobal("localStorage", {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => {
        storage.set(key, value);
      },
      removeItem: (key: string) => {
        storage.delete(key);
      },
      clear: () => {
        storage.clear();
      },
    });

    const { mediaQuery } = createMatchMedia(false);
    vi.stubGlobal("matchMedia", vi.fn(() => mediaQuery));
  });

  it("renders theme options", async () => {
    render(<ThemeToggle />);

    await waitFor(() => {
      expect(screen.getByRole("radio", { name: "Light" })).toBeInTheDocument();
      expect(screen.getByRole("radio", { name: "Dark" })).toBeInTheDocument();
      expect(screen.getByRole("radio", { name: "System" })).toBeInTheDocument();
    });
  });

  it("updates theme and localStorage when selecting dark", async () => {
    render(<ThemeToggle />);

    const darkButton = await screen.findByRole("radio", { name: "Dark" });
    fireEvent.click(darkButton);

    expect(localStorage.getItem("theme")).toBe("dark");
    expect(document.documentElement.dataset.theme).toBe("dark");
  });
});
