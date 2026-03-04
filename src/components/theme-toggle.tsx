"use client";

import {
  useEffect,
  useMemo,
  useState,
  useRef,
  useSyncExternalStore,
  type ReactElement,
} from "react";

import {
  THEME_STORAGE_KEY,
  type ThemeMode,
  isThemeMode,
  validThemeModes,
} from "@/lib/theme";

const OPTIONS: Array<{ value: ThemeMode; label: string; icon: ReactElement }> = [
  {
    value: "light",
    label: "Light",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4" aria-hidden="true">
        <circle cx="12" cy="12" r="4.2" />
        <path d="M12 2.5v2.5M12 19v2.5M4.9 4.9l1.7 1.7M17.4 17.4l1.7 1.7M2.5 12H5M19 12h2.5M4.9 19.1l1.7-1.7M17.4 6.6l1.7-1.7" />
      </svg>
    ),
  },
  {
    value: "dark",
    label: "Dark",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4" aria-hidden="true">
        <path d="M20.5 14.4A8.5 8.5 0 119.6 3.5a7 7 0 0010.9 10.9z" />
      </svg>
    ),
  },
  {
    value: "system",
    label: "System",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4" aria-hidden="true">
        <rect x="3" y="4" width="18" height="12" rx="1.8" />
        <path d="M8 20h8M12 16v4" />
      </svg>
    ),
  },
];

const THEME_MODE_EVENT = "theme-mode-change";

function getSystemTheme() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function getStoredMode(): ThemeMode {
  if (typeof window === "undefined") {
    return "system";
  }

  const rawStored = localStorage.getItem(THEME_STORAGE_KEY);
  return isThemeMode(rawStored) ? rawStored : "system";
}

function applyTheme(mode: ThemeMode) {
  const resolved = mode === "system" ? getSystemTheme() : mode;
  document.documentElement.dataset.theme = resolved;
}

function subscribe(onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => { };
  }

  const handleStorage = (event: StorageEvent) => {
    if (event.key === THEME_STORAGE_KEY || event.key === null) {
      onStoreChange();
    }
  };

  const handleThemeModeChange = () => {
    onStoreChange();
  };

  window.addEventListener("storage", handleStorage);
  window.addEventListener(THEME_MODE_EVENT, handleThemeModeChange);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(THEME_MODE_EVENT, handleThemeModeChange);
  };
}

export function ThemeToggle() {
  const mode = useSyncExternalStore(subscribe, getStoredMode, () => "system") as ThemeMode;

  useEffect(() => {
    applyTheme(mode);

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const listener = () => {
      if ((localStorage.getItem(THEME_STORAGE_KEY) ?? "system") === "system") {
        applyTheme("system");
      }
    };

    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [mode]);

  const value = useMemo(() => (validThemeModes.includes(mode) ? mode : "system"), [mode]);

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const activeOption = OPTIONS.find((o) => o.value === value) || OPTIONS[2];

  return (
    <>
      <div
        role="radiogroup"
        aria-label="Theme mode"
        className="hidden sm:inline-flex items-center gap-1 rounded-full border border-line/80 bg-surface p-1"
      >
        {OPTIONS.map((option) => {
          const active = option.value === value;

          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => {
                localStorage.setItem(THEME_STORAGE_KEY, option.value);
                window.dispatchEvent(new Event(THEME_MODE_EVENT));
                applyTheme(option.value);
              }}
              className={`inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-full px-3 text-xs font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background ${active
                  ? "bg-accent text-accent-foreground shadow-sm"
                  : "text-muted hover:bg-surface-alt hover:text-foreground"
                }`}
            >
              {option.icon}
              <span>{option.label}</span>
            </button>
          );
        })}
      </div>

      <div className="relative sm:hidden" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line/80 bg-surface text-foreground transition-colors hover:bg-surface-alt focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          aria-label="Toggle theme"
        >
          {activeOption.icon}
        </button>

        {isOpen && (
          <div className="absolute right-0 top-[calc(100%+0.5rem)] z-50 flex w-36 flex-col overflow-hidden rounded-xl border border-line bg-surface p-1 shadow-lg motion-enter">
            {OPTIONS.map((option) => {
              const active = option.value === value;
              return (
                <button
                  key={option.value}
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    localStorage.setItem(THEME_STORAGE_KEY, option.value);
                    window.dispatchEvent(new Event(THEME_MODE_EVENT));
                    applyTheme(option.value);
                    setIsOpen(false);
                  }}
                  className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none ${active
                      ? "bg-accent/10 text-accent font-semibold"
                      : "text-muted hover:bg-surface-alt hover:text-foreground"
                    }`}
                >
                  {option.icon}
                  <span>{option.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
