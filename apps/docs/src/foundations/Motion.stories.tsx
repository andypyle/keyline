import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Label, Page, Section } from "./Page";
import { cssVar, tokens, tokensIn, utility } from "./tokens";

const easings = tokensIn("ease");
const durations = tokens.filter((t) => t.name.startsWith("dur"));
const animations = tokensIn("animate");

function Motion() {
  const [run, setRun] = useState(false);
  // Changing the key remounts the samples, which restarts their animations.
  const [replay, setReplay] = useState(0);
  const play = (
    <button type="button" className="fd-button" onClick={() => setRun((r) => !r)}>
      {run ? "Reset" : "Play"}
    </button>
  );

  return (
    <Page
      title="Motion"
      lede="Two curves: ease-out for most things, ease-bounce for things that pop in or slide into place."
    >
      <Section title="Easing" note={play}>
        <div className="fd-list">
          {easings.map((t) => (
            <div key={t.name} className="fd-row" style={{ alignItems: "center" }}>
              <Label name={t.name.replace("ease-", "")} utility={utility(t.name, "ease")} value={t.value} />
              <div className="fd-track" data-run={run || undefined}>
                <div className="fd-dot" style={{ transition: `left 600ms var(${cssVar(t.name)})` }} />
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Duration"
        note={
          <>
            For hand-written CSS. In markup, use kl:duration-120 / 200 / 320.
            <br />
            <br />
            {play}
          </>
        }
      >
        <div className="fd-list">
          {durations.map((t) => (
            <div key={t.name} className="fd-row" style={{ alignItems: "center" }}>
              <Label name={t.name} value={t.value} />
              <div className="fd-track" data-run={run || undefined}>
                <div className="fd-dot" style={{ transition: `left var(${cssVar(t.name)}) var(--kl-ease-out)` }} />
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Animations"
        note={
          <button type="button" className="fd-button" onClick={() => setReplay((n) => n + 1)}>
            Replay
          </button>
        }
      >
        <div key={replay} className="fd-grid" style={{ "--fd-min": "200px" } as React.CSSProperties}>
          {animations.map((t) => (
            <div key={t.name} className="fd-list" style={{ gap: 10 }}>
              <div className="fd-box" style={{ display: "grid", placeItems: "center", borderRadius: "var(--kl-radius-md)" }}>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    background: "var(--kl-color-accent)",
                    border: "2px solid var(--kl-color-line)",
                    borderRadius: "var(--kl-radius-sm)",
                    boxShadow: "var(--kl-shadow-sm)",
                    animation: `var(${cssVar(t.name)})`,
                  }}
                />
              </div>
              <Label name={t.name.replace("animate-", "")} utility={utility(t.name, "animate")} value={t.value} />
            </div>
          ))}
        </div>
      </Section>
    </Page>
  );
}

const meta = {
  title: "Foundations/Motion",
  component: Motion,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof Motion>;

export default meta;

export const All: StoryObj<typeof meta> = { name: "Motion" };
