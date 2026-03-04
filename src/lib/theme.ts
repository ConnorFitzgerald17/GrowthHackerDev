export type ThemeMode = "light" | "dark" | "system";

export const THEME_STORAGE_KEY = "theme";

export const validThemeModes: ThemeMode[] = ["light", "dark", "system"];

export function isThemeMode(value: unknown): value is ThemeMode {
  return typeof value === "string" && validThemeModes.includes(value as ThemeMode);
}

export const themeInitScript = `
(() => {
  const key = "${THEME_STORAGE_KEY}";
  const root = document.documentElement;
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const stored = localStorage.getItem(key);
  const mode = stored === "light" || stored === "dark" || stored === "system" ? stored : "system";
  const resolved = mode === "system" ? (media.matches ? "dark" : "light") : mode;
  root.dataset.theme = resolved;
})();
`;
