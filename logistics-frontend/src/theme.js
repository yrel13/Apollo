// Simple theme manager: 'light' | 'dark' | 'auto'
const THEME_KEY = "app_theme";

function applyTheme(theme) {
  const root = document.documentElement;
  if (theme === "auto") {
    // follow system
    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    root.setAttribute("data-theme", prefersDark ? "dark" : "light");
  } else {
    root.setAttribute("data-theme", theme);
  }
}

export function getTheme() {
  return localStorage.getItem(THEME_KEY) || "auto";
}

export function setTheme(theme) {
  localStorage.setItem(THEME_KEY, theme);
  applyTheme(theme);
}

// initialize on load
if (typeof window !== "undefined") {
  const t = getTheme();
  applyTheme(t);
  // if auto, listen to changes
  if (t === "auto" && window.matchMedia) {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener?.("change", () => applyTheme("auto"));
  }
}

export default { getTheme, setTheme, applyTheme };
