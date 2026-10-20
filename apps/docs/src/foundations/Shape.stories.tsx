import type { Meta, StoryObj } from "@storybook/react-vite";
import { Label, Page, Section } from "./Page";
import { cssVar, tokensIn, utility } from "./tokens";

const radii = tokensIn("radius");
const shadows = tokensIn("shadow");
const containers = tokensIn("container");
const breakpoints = tokensIn("breakpoint");
const spacing = [1, 2, 3, 4, 6, 8, 12, 16, 24];

function Shape() {
  return (
    <Page
      title="Shape & Layout"
      lede="Every outline is 2px in the line color, and shadows are hard offsets — no blur, ever. Spacing keeps Tailwind's 4px scale."
    >
      <Section title="Radius" note="kl:rounded-full is the pill.">
        <div className="fd-grid" style={{ "--fd-min": "160px" } as React.CSSProperties}>
          {radii.map((t) => (
            <div key={t.name} className="fd-list" style={{ gap: 10 }}>
              <div className="fd-box" style={{ borderRadius: `var(${cssVar(t.name)})` }} />
              <Label name={t.name.replace("radius-", "")} utility={utility(t.name, "rounded")} value={t.value} />
            </div>
          ))}
        </div>
      </Section>

      <Section title="Shadow">
        <div className="fd-grid" style={{ "--fd-min": "160px" } as React.CSSProperties}>
          {shadows.map((t) => (
            <div key={t.name} className="fd-list" style={{ gap: 14 }}>
              <div
                className="fd-box"
                style={{ borderRadius: "var(--kl-radius-md)", boxShadow: `var(${cssVar(t.name)})` }}
              />
              <Label name={t.name.replace("shadow-", "")} utility={utility(t.name, "shadow")} value={t.value} />
            </div>
          ))}
        </div>
      </Section>

      <Section title="Spacing" note="calc(var(--kl-spacing) * n), where --kl-spacing is 0.25rem.">
        <div className="fd-list" style={{ gap: 10 }}>
          {spacing.map((n) => (
            <div key={n} className="fd-row" style={{ alignItems: "center" }}>
              <Label name={n} utility={`kl:p-${n}`} value={`${n * 4}px`} />
              <div
                style={{
                  width: `calc(var(--kl-spacing) * ${n})`,
                  height: 16,
                  background: "var(--kl-color-accent)",
                  border: "2px solid var(--kl-color-line)",
                  borderRadius: 4,
                }}
              />
            </div>
          ))}
        </div>
      </Section>

      <Section title="Layout" note="One breakpoint: kl:max-md: is phones, kl:md: is everything wider.">
        <div className="fd-list">
          {[...containers, ...breakpoints].map((t) => (
            <Label
              key={t.name}
              name={t.name}
              utility={t.name.startsWith("container") ? utility(t.name, "max-w") : "kl:md:"}
              value={t.value}
            />
          ))}
        </div>
      </Section>
    </Page>
  );
}

const meta = {
  title: "Foundations/Shape & Layout",
  component: Shape,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof Shape>;

export default meta;

export const All: StoryObj<typeof meta> = { name: "Shape & Layout" };
