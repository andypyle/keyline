import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, fn, userEvent } from "storybook/test";
import { Button } from "../Button/Button";
import { Field } from "../Field/Field";
import { FieldDescription } from "../Field/parts/FieldDescription";
import { FieldLabel } from "../Field/parts/FieldLabel";
import { Slider } from "./Slider";

// Stories are excluded from Tailwind's source scan, so layout here uses inline styles.
const stack = { display: "grid", gap: 24, width: 320 } as const;
const row = { display: "flex", gap: 40, alignItems: "flex-end" } as const;

// Where a pointer has to press for a value: the thumb's centre travels the slider's length less
// the thumb's size.
function pointAt(slider: HTMLElement, ratio: number) {
  const rect = slider.getBoundingClientRect();
  const thumb = slider.querySelector<HTMLElement>("[data-slot=slider-thumb]")!.offsetWidth;
  if (slider.getAttribute("aria-orientation") === "vertical") {
    return { clientX: rect.left + rect.width / 2, clientY: rect.bottom - thumb / 2 - (rect.height - thumb) * ratio };
  }
  return { clientX: rect.left + thumb / 2 + (rect.width - thumb) * ratio, clientY: rect.top + rect.height / 2 };
}

// Clears the meta's spies between steps that count calls.
function clearSpies(args: { onValueChange?: unknown; onValueCommit?: unknown }) {
  (args.onValueChange as ReturnType<typeof fn>).mockClear();
  (args.onValueCommit as ReturnType<typeof fn>).mockClear();
}

const meta = {
  title: "Forms/Slider",
  component: Slider,
  tags: ["autodocs"],
  args: { "aria-label": "Volume", defaultValue: 40, onValueChange: fn(), onValueCommit: fn() },
  argTypes: {
    orientation: { control: "inline-radio", options: ["horizontal", "vertical"] },
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    disabled: { control: "boolean" },
  },
  render: (args) => (
    <div style={stack}>
      <Slider {...args} />
    </div>
  ),
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ args, canvas, step }) => {
    const slider = canvas.getByRole("slider", { name: "Volume" });

    await step("announces its range and value", async () => {
      await expect(slider).toHaveAttribute("aria-valuemin", "0");
      await expect(slider).toHaveAttribute("aria-valuemax", "100");
      await expect(slider).toHaveAttribute("aria-valuenow", "40");
      await expect(slider).toHaveAttribute("aria-orientation", "horizontal");
    });

    await step("moves by a step with the arrow keys, and commits each press", async () => {
      await userEvent.tab();
      await expect(slider).toHaveFocus();
      await userEvent.keyboard("{ArrowRight}{ArrowUp}");
      await expect(slider).toHaveAttribute("aria-valuenow", "42");
      await userEvent.keyboard("{ArrowLeft}{ArrowDown}{ArrowDown}");
      await expect(slider).toHaveAttribute("aria-valuenow", "39");
      await expect(args.onValueChange).toHaveBeenLastCalledWith(39);
      await expect(args.onValueCommit).toHaveBeenCalledTimes(5);
    });

    await step("moves by a tenth with Page Up and Page Down, and to the ends with Home and End", async () => {
      await userEvent.keyboard("{PageUp}");
      await expect(slider).toHaveAttribute("aria-valuenow", "49");
      await userEvent.keyboard("{PageDown}{PageDown}");
      await expect(slider).toHaveAttribute("aria-valuenow", "29");
      await userEvent.keyboard("{End}");
      await expect(slider).toHaveAttribute("aria-valuenow", "100");
      await userEvent.keyboard("{Home}");
      await expect(slider).toHaveAttribute("aria-valuenow", "0");
    });

    await step("doesn't call back for a key that can't move it further", async () => {
      clearSpies(args);
      await userEvent.keyboard("{ArrowLeft}{Home}");
      await expect(args.onValueChange).not.toHaveBeenCalled();
      await expect(args.onValueCommit).not.toHaveBeenCalled();
    });

    await step("jumps to a press on the track, follows a drag, and commits once on release", async () => {
      clearSpies(args);
      await userEvent.pointer([
        { keys: "[MouseLeft>]", target: slider, coords: pointAt(slider, 0.75) },
        { target: slider, coords: pointAt(slider, 0.6) },
        { keys: "[/MouseLeft]", target: slider, coords: pointAt(slider, 0.6) },
      ]);
      await expect(args.onValueChange).toHaveBeenNthCalledWith(1, 75);
      await expect(slider).toHaveAttribute("aria-valuenow", "60");
      await expect(args.onValueCommit).toHaveBeenCalledTimes(1);
      await expect(args.onValueCommit).toHaveBeenCalledWith(60);
      await expect(slider).toHaveFocus();
    });
  },
};

/** `min`, `max` and `step` set the range; values snap to the nearest step from `min`. */
export const Steps: Story = {
  args: { "aria-label": "Opacity", min: 0, max: 1, step: 0.05, defaultValue: 0.5 },
  play: async ({ canvas }) => {
    const slider = canvas.getByRole("slider", { name: "Opacity" });
    await userEvent.tab();
    await userEvent.keyboard("{ArrowRight}{ArrowRight}{ArrowRight}");
    // No floating-point drift: three steps of 0.05 from 0.5 is exactly 0.65.
    await expect(slider).toHaveAttribute("aria-valuenow", "0.65");
    await userEvent.pointer([
      { keys: "[MouseLeft>]", target: slider, coords: pointAt(slider, 0.33) },
      { keys: "[/MouseLeft]", target: slider },
    ]);
    await expect(slider).toHaveAttribute("aria-valuenow", "0.35");
  },
};

const formatPrice = (value: number) => `$${value}`;

/**
 * `getValueText` sets what assistive tech announces, for values a bare number doesn't describe.
 * It isn't shown: to show the value, render it yourself, as the price beside the label is here.
 * That copy is hidden from assistive tech, since the slider already announces it.
 */
export const ValueText: Story = {
  args: { "aria-label": "Maximum price", max: 500, step: 10, getValueText: formatPrice },
  render: function Render(args) {
    const [value, setValue] = useState(120);
    return (
      <div style={{ ...stack, gap: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 600 }}>
          <span aria-hidden>Maximum price</span>
          <output aria-hidden>{formatPrice(value)}</output>
        </div>
        <Slider {...args} value={value} onValueChange={(next) => (setValue(next), args.onValueChange?.(next))} />
      </div>
    );
  },
  play: async ({ canvas, canvasElement }) => {
    const slider = canvas.getByRole("slider", { name: "Maximum price" });
    const shown = canvasElement.querySelector("output")!;
    await expect(slider).toHaveAttribute("aria-valuetext", "$120");
    await expect(shown).toHaveTextContent("$120");
    await userEvent.tab();
    await userEvent.keyboard("{PageUp}");
    await expect(slider).toHaveAttribute("aria-valuetext", "$170");
    await expect(shown).toHaveTextContent("$170");
  },
};

/** Controlled: the value lives in the parent, here shown beside the slider. */
export const Controlled: Story = {
  render: function Render(args) {
    const [value, setValue] = useState(25);
    return (
      <div style={{ ...stack, gridTemplateColumns: "1fr 3ch", alignItems: "center" }}>
        <Slider {...args} value={value} onValueChange={(next) => (setValue(next), args.onValueChange?.(next))} />
        <output aria-label="Current volume">{value}</output>
      </div>
    );
  },
  play: async ({ canvas }) => {
    const slider = canvas.getByRole("slider", { name: "Volume" });
    await userEvent.tab();
    await userEvent.keyboard("{ArrowRight}");
    await expect(slider).toHaveAttribute("aria-valuenow", "26");
    await expect(canvas.getByLabelText("Current volume")).toHaveTextContent("26");
  },
};

/** Vertical sliders fill from the bottom, and take their height from a container or `className`. */
export const Vertical: Story = {
  args: { orientation: "vertical" },
  render: (args) => (
    <div style={row}>
      <Slider {...args} />
      <Slider {...args} aria-label="Treble" defaultValue={70} size="sm" />
      <Slider {...args} aria-label="Bass" defaultValue={20} size="lg" />
    </div>
  ),
  play: async ({ canvas }) => {
    const slider = canvas.getByRole("slider", { name: "Volume" });
    await expect(slider).toHaveAttribute("aria-orientation", "vertical");
    await userEvent.tab();
    await userEvent.keyboard("{ArrowUp}");
    await expect(slider).toHaveAttribute("aria-valuenow", "41");
    await userEvent.pointer([
      { keys: "[MouseLeft>]", target: slider, coords: pointAt(slider, 0.9) },
      { keys: "[/MouseLeft]", target: slider },
    ]);
    await expect(slider).toHaveAttribute("aria-valuenow", "90");
  },
};

export const Sizes: Story = {
  render: (args) => (
    <div style={stack}>
      <Slider {...args} aria-label="Small" size="sm" />
      <Slider {...args} aria-label="Medium" size="md" />
      <Slider {...args} aria-label="Large" size="lg" />
    </div>
  ),
};

export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ args, canvas, step }) => {
    const slider = canvas.getByRole("slider", { name: "Volume" });

    await step("is announced as disabled and skipped by keyboard navigation", async () => {
      await expect(slider).toHaveAttribute("aria-disabled", "true");
      await userEvent.tab();
      await expect(slider).not.toHaveFocus();
    });

    await step("ignores presses on the track", async () => {
      await userEvent.pointer([
        { keys: "[MouseLeft>]", target: slider, coords: pointAt(slider, 0.9) },
        { keys: "[/MouseLeft]", target: slider },
      ]);
      await expect(slider).toHaveAttribute("aria-valuenow", "40");
      await expect(args.onValueChange).not.toHaveBeenCalled();
    });
  },
};

/** In a Field, the label names the slider and the description describes it. */
export const InField: Story = {
  args: { "aria-label": undefined },
  render: (args) => (
    <div style={stack}>
      <Field>
        <FieldLabel>Brightness</FieldLabel>
        <Slider {...args} />
        <FieldDescription>Applies to every display.</FieldDescription>
      </Field>
    </div>
  ),
  play: async ({ canvas }) => {
    const slider = canvas.getByRole("slider", { name: "Brightness" });
    await expect(slider).toHaveAccessibleDescription("Applies to every display.");
  },
};

/** With `name`, the value submits with its form; resetting the form restores `defaultValue`. */
export const InForm: Story = {
  render: (args) => (
    <form style={stack} onSubmit={(event) => event.preventDefault()}>
      <Slider {...args} name="volume" />
      <Button type="reset" variant="secondary">
        Reset
      </Button>
    </form>
  ),
  play: async ({ canvas, canvasElement }) => {
    const form = canvasElement.querySelector("form")!;
    const slider = canvas.getByRole("slider", { name: "Volume" });
    await expect(new FormData(form).get("volume")).toBe("40");

    await userEvent.tab();
    await userEvent.keyboard("{End}");
    await expect(new FormData(form).get("volume")).toBe("100");

    await userEvent.click(canvas.getByRole("button", { name: "Reset" }));
    await expect(slider).toHaveAttribute("aria-valuenow", "40");
    await expect(new FormData(form).get("volume")).toBe("40");
  },
};

export const States: Story = {
  render: (args) => (
    <div style={stack}>
      <Slider {...args} aria-label="Empty" defaultValue={0} />
      <Slider {...args} aria-label="Partly filled" />
      <Slider {...args} aria-label="Full" defaultValue={100} />
      <Slider {...args} aria-label="Invalid" aria-invalid />
      <Slider {...args} aria-label="Disabled" disabled />
    </div>
  ),
};

/** Dark mode swaps the semantic tokens, so contrast is checked here too. */
export const StatesDark: Story = {
  name: "States (dark)",
  globals: { theme: "dark" },
  render: States.render,
  play: async () => {
    // Guards the contrast check: if the theme global stops applying, this story would silently test light mode.
    await expect(document.documentElement).toHaveAttribute("data-theme", "dark");
  },
};
