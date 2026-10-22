import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent } from "storybook/test";
import { Textarea } from "./Textarea";

// Stories are excluded from Tailwind's source scan, so layout here uses inline styles.
const stack = { display: "grid", gap: 20, maxWidth: 420 } as const;
const field = { display: "grid", gap: 6, fontWeight: 600 } as const;
const hint = { fontSize: 14, fontWeight: 400 } as const;

const meta = {
  title: "Forms/Textarea",
  component: Textarea,
  tags: ["autodocs"],
  args: { onChange: fn() },
  argTypes: {
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    radius: { control: "inline-radio", options: ["sm", "md", "lg", "xl"] },
    autoResize: { control: "boolean" },
    disabled: { control: "boolean" },
    readOnly: { control: "boolean" },
  },
  render: (args) => (
    <label style={{ ...field, maxWidth: 420 }}>
      Message
      <Textarea {...args} />
    </label>
  ),
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { placeholder: "What's on your mind?" },
  play: async ({ args, canvas, step }) => {
    const textarea = canvas.getByRole("textbox", { name: "Message" });

    await step("is focusable and takes multi-line typing", async () => {
      await userEvent.tab();
      await expect(textarea).toHaveFocus();
      await userEvent.keyboard("Hi{Enter}there");
      await expect(textarea).toHaveValue("Hi\nthere");
      await expect(args.onChange).toHaveBeenCalledTimes(8);
    });
  },
};

export const Sizes: Story = {
  render: (args) => (
    <div style={stack}>
      <label style={field}>
        Small
        <Textarea {...args} size="sm" placeholder="Small" />
      </label>
      <label style={field}>
        Medium
        <Textarea {...args} size="md" placeholder="Medium" />
      </label>
      <label style={field}>
        Large
        <Textarea {...args} size="lg" placeholder="Large" />
      </label>
    </div>
  ),
};

/** Grows as you type instead of scrolling. Cap it with a `max-h-*` class, after which it scrolls. */
export const AutoResize: Story = {
  args: {
    autoResize: true,
    defaultValue: "Keep typing and this field grows to fit.\n\nPress Enter a few times to see it.",
  },
};

/** Pair `aria-invalid` with `aria-describedby` pointing at the message, so the error is announced with the field. */
export const Invalid: Story = {
  render: (args) => (
    <div style={{ ...field, maxWidth: 420 }}>
      <label htmlFor="invalid-bio">Bio</label>
      <Textarea {...args} id="invalid-bio" defaultValue="Hi" aria-invalid aria-describedby="invalid-bio-error" />
      <span id="invalid-bio-error" style={hint}>
        Write at least 20 characters.
      </span>
    </div>
  ),
  play: async ({ canvas }) => {
    const textarea = canvas.getByRole("textbox", { name: "Bio" });
    await expect(textarea).toBeInvalid();
    await expect(textarea).toHaveAccessibleDescription("Write at least 20 characters.");
  },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: "Can't touch this." },
  play: async ({ args, canvas, step }) => {
    const textarea = canvas.getByRole("textbox", { name: "Message" });

    await step("ignores typing", async () => {
      await expect(textarea).toBeDisabled();
      await userEvent.type(textarea, "x");
      await expect(textarea).toHaveValue("Can't touch this.");
      await expect(args.onChange).not.toHaveBeenCalled();
    });

    await step("is skipped by keyboard navigation", async () => {
      await userEvent.tab();
      await expect(textarea).not.toHaveFocus();
    });
  },
};

/** Read-only fields stay focusable and their text can be selected and copied, unlike disabled ones. */
export const ReadOnly: Story = {
  args: { readOnly: true, defaultValue: "This was submitted and can't be changed." },
  play: async ({ args, canvas }) => {
    const textarea = canvas.getByRole("textbox", { name: "Message" });
    await userEvent.tab();
    await expect(textarea).toHaveFocus();
    await userEvent.keyboard("x");
    await expect(textarea).toHaveValue("This was submitted and can't be changed.");
    await expect(args.onChange).not.toHaveBeenCalled();
  },
};

export const States: Story = {
  render: (args) => (
    <div style={stack}>
      <label style={field}>
        Empty
        <Textarea {...args} size="sm" placeholder="Placeholder" />
      </label>
      <label style={field}>
        Filled
        <Textarea {...args} size="sm" defaultValue="Some thoughts, written down." />
      </label>
      <label style={field}>
        Invalid
        <Textarea {...args} size="sm" defaultValue="Hi" aria-invalid />
      </label>
      <label style={field}>
        Read-only
        <Textarea {...args} size="sm" defaultValue="Submitted." readOnly />
      </label>
      <label style={field}>
        Disabled
        <Textarea {...args} size="sm" defaultValue="Can't touch this." disabled />
      </label>
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
