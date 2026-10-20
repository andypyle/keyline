import type { Meta, StoryObj } from "@storybook/react-vite";
import { Label, Page, Section } from "./Page";
import { cssVar, fontPackage, fontStyles, tokensIn, utility } from "./tokens";

const sample = "Sphinx of black quartz, judge my vow";
const fonts = tokensIn("font");
const sizes = tokensIn("text");
const leading = tokensIn("leading");
const tracking = tokensIn("tracking");

// Headings and display sizes are set in the display face; the rest in body.
const isHeading = (name: string) => /^text-(h\d|display)$/.test(name);

function Typography() {
  return (
    <Page
      title="Typography"
      lede="Fredoka for display and headings, Figtree for body copy, Geist Mono for code. Font sizes never set line height, so text-* can't change leading."
    >
      <Section title="Families" note="Every weight shown here ships in @keyline/ui/styles.css.">
        <div className="fd-list">
          {fonts.map((font) => (
            <div key={font.name} className="fd-list" style={{ gap: 8 }}>
              <Label name={font.name.replace("font-", "")} utility={utility(font.name, "font")} value={font.value} />
              {fontStyles[fontPackage(font.value)]?.map(({ weight, italic }) => (
                <div
                  key={`${weight}${italic}`}
                  className="fd-row"
                  style={{ fontFamily: `var(${cssVar(font.name)})` }}
                >
                  <span className="fd-label fd-code">
                    {weight}
                    {italic && " italic"}
                  </span>
                  <span style={{ fontSize: "var(--kl-text-2xl)", fontWeight: weight, fontStyle: italic ? "italic" : undefined }}>
                    {sample}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </Section>

      <Section title="Sizes">
        <div className="fd-list">
          {sizes.map((size) => (
            <div key={size.name} className="fd-row">
              <Label name={size.name.replace("text-", "")} utility={utility(size.name, "text")} value={size.value} />
              <span
                style={{
                  fontSize: `var(${cssVar(size.name)})`,
                  fontFamily: isHeading(size.name) ? "var(--kl-font-display)" : undefined,
                  fontWeight: isHeading(size.name) ? 500 : undefined,
                  letterSpacing: isHeading(size.name) ? "var(--kl-tracking-display)" : undefined,
                  lineHeight: "var(--kl-leading-snug)",
                }}
              >
                {sample}
              </span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Line height">
        <div className="fd-list">
          {leading.map((t) => (
            <div key={t.name} className="fd-row">
              <Label name={t.name.replace("leading-", "")} utility={utility(t.name, "leading")} value={t.value} />
              <p style={{ margin: 0, maxWidth: 480, lineHeight: `var(${cssVar(t.name)})` }}>
                {sample}. {sample}. {sample}.
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Letter spacing">
        <div className="fd-list">
          {tracking.map((t) => (
            <div key={t.name} className="fd-row">
              <Label name={t.name.replace("tracking-", "")} utility={utility(t.name, "tracking")} value={t.value} />
              <span
                style={
                  t.name === "tracking-caps"
                    ? { letterSpacing: `var(${cssVar(t.name)})`, textTransform: "uppercase", fontWeight: 600, fontSize: "var(--kl-text-sm)" }
                    : { letterSpacing: `var(${cssVar(t.name)})`, fontFamily: "var(--kl-font-display)", fontWeight: 500, fontSize: "var(--kl-text-h2)" }
                }
              >
                {t.name === "tracking-caps" ? "Section label" : "Display heading"}
              </span>
            </div>
          ))}
        </div>
      </Section>
    </Page>
  );
}

const meta = {
  title: "Foundations/Typography",
  component: Typography,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof Typography>;

export default meta;

export const All: StoryObj<typeof meta> = { name: "Typography" };
