// Bundles the fonts listed in src/styles/fonts.css into the published package: copies each
// .woff2 file (plus the font's license) into dist/fonts and appends the @font-face rules to
// dist/styles.css with their urls pointing there. Only woff2 ships; every browser Tailwind 4
// supports reads it, so the .woff fallbacks are dropped.
import { createRequire } from "node:module";
import { appendFile, copyFile, mkdir, readFile, rm } from "node:fs/promises";
import { basename, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(join(root, "package.json"));
const outDir = join(root, "dist/fonts");

const list = await readFile(join(root, "src/styles/fonts.css"), "utf8");
const imports = [...list.matchAll(/@import\s+"([^"]+)"/g)].map((m) => m[1]);

await rm(outDir, { recursive: true, force: true });
await mkdir(outDir, { recursive: true });

const licenses = new Set();
let fontFaces = "";

for (const specifier of imports) {
  const cssPath = require.resolve(specifier);
  const css = await readFile(cssPath, "utf8");

  const rewritten = css.replace(
    /src:\s*([^;]+);/g,
    (_, sources) => {
      const woff2 = sources.match(/url\(\.\/files\/([^)]+\.woff2)\)/);
      if (!woff2) throw new Error(`No woff2 source in ${specifier}`);
      return `src: url(./fonts/${woff2[1]}) format("woff2");`;
    },
  );

  for (const [, file] of rewritten.matchAll(/url\(\.\/fonts\/([^)]+)\)/g)) {
    await copyFile(join(dirname(cssPath), "files", file), join(outDir, file));
  }

  const pkg = specifier.split("/").slice(0, 2).join("/");
  if (!licenses.has(pkg)) {
    licenses.add(pkg);
    await copyFile(
      require.resolve(`${pkg}/LICENSE`),
      join(outDir, `${basename(pkg)}-LICENSE`),
    );
  }

  fontFaces += rewritten.trim() + "\n";
}

await appendFile(join(root, "dist/styles.css"), "\n" + fontFaces);
console.log(`Bundled ${imports.length} font styles from ${licenses.size} families`);
