import { create } from "storybook/theming";

// Storybook's UI can't read the --kl-* tokens, so these restate the values from
// packages/ui/src/styles/theme.css. Keep them in sync when the palette changes.

const brand = {
  brandTitle: "Keyline",
  brandUrl: "https://github.com/andypyle/keyline",
  brandTarget: "_blank",

  fontBase: '"Figtree", system-ui, -apple-system, "Segoe UI", sans-serif',
  fontCode: '"Geist Mono", ui-monospace, "SF Mono", "Cascadia Mono", Menlo, monospace',

  appBorderRadius: 10, // radius-md
  inputBorderRadius: 6, // radius-sm
} as const;

export const lightTheme = create({
  ...brand,
  base: "light",

  colorPrimary: "#4a6e3d", // sage-700
  colorSecondary: "#4a6e3d", // sage-700: selected sidebar item, active tab, links

  appBg: "#edeff1", // page
  appContentBg: "#f7f8f9", // surface
  appPreviewBg: "#edeff1", // page
  appHoverBg: "#dee5ec", // surface-hover
  appBorderColor: "#c3cad1", // subtle

  textColor: "#1a1f24", // fg-1
  textInverseColor: "#f7f8f9", // fg-inverse
  textMutedColor: "#56616b", // fg-3

  barBg: "#f7f8f9", // surface
  barTextColor: "#56616b", // fg-3
  barHoverColor: "#4a6e3d", // sage-700
  barSelectedColor: "#4a6e3d", // sage-700

  buttonBg: "#f7f8f9",
  buttonBorder: "#c3cad1",
  booleanBg: "#dfe3e7", // sunken
  booleanSelectedBg: "#f7f8f9",

  inputBg: "#ffffff",
  inputBorder: "#c3cad1",
  inputTextColor: "#1a1f24",
});

export const darkTheme = create({
  ...brand,
  base: "dark",

  colorPrimary: "#adc9a1", // sage-300
  colorSecondary: "#4a6e3d", // sage-700: keeps white text readable on the selected sidebar item

  appBg: "#14181c", // page
  appContentBg: "#1d2227", // surface
  appPreviewBg: "#14181c", // page
  appHoverBg: "#222c37", // surface-hover
  appBorderColor: "#353d45", // subtle

  textColor: "#e9edf0", // fg-1
  textInverseColor: "#14181c", // fg-inverse
  textMutedColor: "#8d97a1", // fg-3

  barBg: "#1d2227", // surface
  barTextColor: "#8d97a1", // fg-3
  barHoverColor: "#adc9a1", // sage-300
  barSelectedColor: "#adc9a1", // sage-300

  buttonBg: "#262c32", // sunken
  buttonBorder: "#353d45",
  booleanBg: "#14181c",
  booleanSelectedBg: "#262c32",

  inputBg: "#14181c",
  inputBorder: "#353d45",
  inputTextColor: "#e9edf0",
});
