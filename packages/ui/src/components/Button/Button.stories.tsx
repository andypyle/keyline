import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent } from "storybook/test";
import { Button } from "./Button";

// Stories are excluded from Tailwind's source scan, so layout here uses inline styles.
const row = { display: "flex", flexWrap: "wrap", alignItems: "center", gap: 16 } as const;

function Icon({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}

const PlusIcon = () => <Icon d="M12 5v14M5 12h14" />;
const CloseIcon = () => <Icon d="M6 6l12 12M18 6L6 18" />;
const ArrowRightIcon = () => <Icon d="M5 12h14M13 6l6 6-6 6" />;
const ArrowLeftIcon = () => <Icon d="M19 12H5M11 6l-6 6 6 6" />;
const RefreshIcon = () => <Icon d="M20 11a8 8 0 1 0-2.3 5.7M20 4v7h-7" />;
const PencilIcon = () => <Icon d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16v4zM13.5 6.5l4 4" />;
const HeartIcon = () => <Icon d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />;

const meta = {
  title: "Buttons/Button",
  component: Button,
  tags: ["autodocs"],
  args: { children: "Button", onClick: fn() },
  argTypes: {
    variant: { control: "inline-radio", options: ["primary", "secondary", "neutral", "inverse", "danger", "ghost"] },
    size: { control: "inline-radio", options: ["sm", "md", "lg", "icon"] },
    radius: { control: "inline-radio", options: ["full", "sm", "md", "lg", "xl"] },
    iconAnimation: { control: "inline-radio", options: ["none", "dash", "nudge", "hop", "spin", "close"] },
    startIcon: { control: false },
    endIcon: { control: false },
    disabled: { control: "boolean" },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ args, canvas, step }) => {
    const button = canvas.getByRole("button", { name: "Button" });

    await step("defaults to type=button, so it never submits a surrounding form", async () => {
      await expect(button).toHaveAttribute("type", "button");
    });

    await step("is focusable and activates with Enter and Space", async () => {
      await userEvent.tab();
      await expect(button).toHaveFocus();
      await userEvent.keyboard("{Enter}");
      await userEvent.keyboard(" ");
      await expect(args.onClick).toHaveBeenCalledTimes(2);
    });

    await step("calls onClick when clicked", async () => {
      await userEvent.click(button);
      await expect(args.onClick).toHaveBeenCalledTimes(3);
    });
  },
};

export const Variants: Story = {
  render: (args) => (
    <div style={row}>
      <Button {...args} variant="primary">
        Primary
      </Button>
      <Button {...args} variant="secondary">
        Secondary
      </Button>
      <Button {...args} variant="neutral">
        Neutral
      </Button>
      <Button {...args} variant="inverse">
        Inverse
      </Button>
      <Button {...args} variant="danger">
        Danger
      </Button>
      <Button {...args} variant="ghost">
        Ghost
      </Button>
    </div>
  ),
};

/** Dark mode swaps the semantic tokens, so contrast is checked here too. */
export const VariantsDark: Story = {
  name: "Variants (dark)",
  globals: { theme: "dark" },
  render: Variants.render,
  play: async () => {
    // Guards the contrast check: if the theme global stops applying, this story would silently test light mode.
    await expect(document.documentElement).toHaveAttribute("data-theme", "dark");
  },
};

export const Sizes: Story = {
  render: (args) => (
    <div style={row}>
      <Button {...args} size="sm">
        Small
      </Button>
      <Button {...args} size="md">
        Medium
      </Button>
      <Button {...args} size="lg">
        Large
      </Button>
    </div>
  ),
};

export const Radius: Story = {
  render: (args) => (
    <div style={row}>
      <Button {...args} radius="full">
        Full
      </Button>
      <Button {...args} radius="xl">
        XL
      </Button>
      <Button {...args} radius="lg">
        LG
      </Button>
      <Button {...args} radius="md">
        MD
      </Button>
      <Button {...args} radius="sm">
        SM
      </Button>
    </div>
  ),
};

export const WithIcon: Story = {
  render: (args) => (
    <div style={row}>
      <Button {...args} size="sm" startIcon={<PlusIcon />}>
        Add item
      </Button>
      <Button {...args} startIcon={<PlusIcon />}>
        Add item
      </Button>
      <Button {...args} size="lg" startIcon={<PlusIcon />}>
        Add item
      </Button>
    </div>
  ),
};

export const IconOnly: Story = {
  args: { size: "icon", "aria-label": "Add item", startIcon: <PlusIcon />, children: undefined },
  play: async ({ canvas }) => {
    // The accessible name comes from aria-label; the icon itself is hidden from assistive tech.
    const button = canvas.getByRole("button", { name: "Add item" });
    await expect(button.querySelector("[data-slot=icon]")).toHaveAttribute("aria-hidden", "true");
  },
};

/** Hover each button, or tab to it, to see its icon animation. */
export const IconAnimations: Story = {
  render: (args) => (
    <div style={row}>
      <Button {...args} variant="secondary" startIcon={<ArrowLeftIcon />} iconAnimation="dash">
        Back
      </Button>
      <Button {...args} endIcon={<ArrowRightIcon />} iconAnimation="dash">
        Continue
      </Button>
      <Button {...args} variant="secondary" startIcon={<PencilIcon />} iconAnimation="nudge">
        Edit
      </Button>
      <Button {...args} variant="secondary" startIcon={<HeartIcon />} iconAnimation="hop">
        Save
      </Button>
      <Button {...args} variant="neutral" startIcon={<RefreshIcon />} iconAnimation="spin">
        Refresh
      </Button>
      <Button
        {...args}
        size="icon"
        variant="ghost"
        startIcon={<CloseIcon />}
        iconAnimation="close"
        aria-label="Close"
        children={undefined}
      />
    </div>
  ),
};

export const Disabled: Story = {
  args: { disabled: true },
  render: Variants.render,
  play: async ({ args, canvas, step }) => {
    const buttons = canvas.getAllByRole("button");

    await step("ignores clicks on every variant", async () => {
      for (const button of buttons) {
        await expect(button).toBeDisabled();
        await userEvent.click(button);
      }
      await expect(args.onClick).not.toHaveBeenCalled();
    });

    await step("is skipped by keyboard navigation", async () => {
      await userEvent.tab();
      for (const button of buttons) await expect(button).not.toHaveFocus();
    });
  },
};
