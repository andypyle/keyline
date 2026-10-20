// Reads Keyline's tokens straight from the library's source CSS, so these pages can't drift
// from the theme. Names are unprefixed as written in theme.css; cssVar() gives the emitted
// --kl- name.
import { useEffect, useState } from "react";
import fontsCss from "../../../../packages/ui/src/styles/fonts.css?raw";
import themeCss from "../../../../packages/ui/src/styles/theme.css?raw";

export interface Token {
  name: string;
  value: string;
  comment?: string;
}

// Only the @theme blocks hold tokens; everything after the dark variant is overrides.
const themeBlocks = themeCss.slice(0, themeCss.indexOf("@custom-variant"));

export const tokens: Token[] = [
  ...themeBlocks.matchAll(/--([\w-]+):\s*([^;]+);[ \t]*(?:\/\*\s*(.*?)\s*\*\/)?/g),
].map(([, name, value, comment]) => ({ name: name!, value: value!.trim(), comment }));

/** Dark-mode overrides by unprefixed token name, from the [data-theme="dark"] block. */
export const darkOverrides = Object.fromEntries(
  [...themeCss.slice(themeBlocks.length).matchAll(/--kl-([\w-]+):\s*([^;]+);/g)].map(
    ([, name, value]) => [name!, value!.trim()],
  ),
);

/** The token's declared value in the given theme, e.g. var(--kl-color-slate-100). */
export function declared(token: Token, theme: string) {
  return (theme === "dark" && darkOverrides[token.name]) || token.value;
}

export function tokensIn(namespace: string) {
  return tokens.filter((t) => t.name.startsWith(`${namespace}-`) || t.name === namespace);
}

export const cssVar = (name: string) => `--kl-${name}`;

/** Utility class for a token, e.g. color-surface → kl:bg-surface */
export function utility(name: string, prefix: string) {
  return `kl:${prefix}-${name.slice(name.indexOf("-") + 1)}`;
}

/** Weights (and italics) bundled for each font package, from fonts.css. */
export const fontStyles = [
  ...fontsCss.matchAll(/@fontsource\/([\w-]+)\/(\d+)(-italic)?\.css/g),
].reduce<Record<string, { weight: number; italic: boolean }[]>>((acc, [, pkg, weight, italic]) => {
  (acc[pkg!] ??= []).push({ weight: Number(weight), italic: Boolean(italic) });
  return acc;
}, {});

/** "Fredoka", ui-rounded, … → fredoka; "Geist Mono" → geist-mono */
export function fontPackage(stack: string) {
  return stack.split(",")[0]!.replace(/["']/g, "").trim().toLowerCase().replace(/\s+/g, "-");
}

/** Re-renders when the theme toggle flips data-theme on <html>. */
export function useTheme() {
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme ?? "light");
  useEffect(() => {
    const observer = new MutationObserver(() =>
      setTheme(document.documentElement.dataset.theme ?? "light"),
    );
    observer.observe(document.documentElement, { attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);
  return theme;
}

/** The token's current value with every var() resolved, e.g. #7fa56f. */
export function resolve(name: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(cssVar(name)).trim();
}
