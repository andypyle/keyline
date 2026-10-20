import type { Meta, StoryObj } from "@storybook/react-vite";
import { Page, Section } from "./Page";
import { cssVar, declared, resolve, tokensIn, useTheme, utility, type Token } from "./tokens";

const colors = tokensIn("color");
const isScale = (t: Token) => /^color-[a-z]+-\d{2,}$/.test(t.name);

// Group the scales by hue, in the order theme.css defines them.
const scales = colors.filter(isScale).reduce<Record<string, Token[]>>((acc, t) => {
  const hue = t.name.split("-")[1]!;
  (acc[hue] ??= []).push(t);
  return acc;
}, {});

const status = ["success", "warning", "danger", "info"];
const semantic = colors.filter((t) => !isScale(t) && !["color-white", "color-black"].includes(t.name));
const statusTokens = semantic.filter((t) => status.some((s) => t.name.startsWith(`color-${s}`)));
const baseTokens = semantic.filter((t) => !statusTokens.includes(t));

function Swatch({ token, theme }: { token: Token; theme: string }) {
  const resolved = resolve(token.name);
  const reference = declared(token, theme).match(/var\(--kl-([\w-]+)\)/)?.[1];
  return (
    <div className="fd-card">
      <div className="fd-swatch" style={{ background: `var(${cssVar(token.name)})` }} />
      <div className="fd-meta">
        <strong>{token.name.replace("color-", "")}</strong>
        <span className="fd-code">{utility(token.name, "bg")}</span>
        <span className="fd-code">
          {resolved}
          {reference && ` · ${reference.replace("color-", "")}`}
        </span>
        {token.comment && <span>{token.comment}</span>}
      </div>
    </div>
  );
}

function Grid({ tokens, min }: { tokens: Token[]; min?: number }) {
  const theme = useTheme();
  return (
    <div className="fd-grid" style={{ "--fd-min": `${min ?? 180}px` } as React.CSSProperties}>
      {tokens.map((t) => (
        <Swatch key={t.name} token={t} theme={theme} />
      ))}
    </div>
  );
}

function Colors() {
  // Swatch values are read from the live CSS, so re-render when the theme flips.
  const theme = useTheme();
  return (
    <Page
      key={theme}
      title="Colors"
      lede="Components use the semantic colors, which swap in dark mode. The scales underneath are there for one-off tints; 100-level tints darken in dark mode too."
    >
      <Section title="Semantic" note="Surfaces, text, lines and accents. Prefer these in components.">
        <Grid tokens={baseTokens} />
      </Section>
      <Section title="Status" note="Feedback colors, each with a soft tint for backgrounds.">
        <Grid tokens={statusTokens} />
      </Section>
      {Object.entries(scales).map(([hue, tokens]) => (
        <Section key={hue} title={hue[0]!.toUpperCase() + hue.slice(1)}>
          <Grid tokens={tokens} min={140} />
        </Section>
      ))}
    </Page>
  );
}

const meta = {
  title: "Foundations/Colors",
  component: Colors,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof Colors>;

export default meta;

export const All: StoryObj<typeof meta> = { name: "Colors" };
