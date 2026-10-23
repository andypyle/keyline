import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { Badge } from "./Badge";

// Stories are excluded from Tailwind's source scan, so layout here uses inline styles.
const row = { display: "flex", flexWrap: "wrap", alignItems: "center", gap: 12 } as const;
const stack = { display: "flex", flexDirection: "column", gap: 16 } as const;

function Icon({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}

const CheckIcon = () => <Icon d="M5 12l5 5L19 7" />;
const StarIcon = () => <Icon d="M12 4l2.5 5 5.5.8-4 3.9.9 5.5L12 16.6 7.1 19.2l.9-5.5-4-3.9 5.5-.8z" />;
const ArrowRightIcon = () => <Icon d="M5 12h14M13 6l6 6-6 6" />;

const tones = ["neutral", "accent", "success", "warning", "danger", "info"] as const;

const meta = {
  title: "Display/Badge",
  component: Badge,
  tags: ["autodocs"],
  parameters: {
    design: { type: "figma", url: "https://www.figma.com/design/gVJvJJAOtJkcdeBHk61Ivb/Keyline?node-id=2-176" },
  },
  args: { children: "Badge" },
  argTypes: {
    variant: { control: "inline-radio", options: ["filled", "outline"] },
    tone: { control: "inline-radio", options: tones },
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    startIcon: { control: false },
    endIcon: { control: false },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { id: "status" },
  play: async ({ canvas, canvasElement, step }) => {
    await step("renders its label as plain text, not a control", async () => {
      await expect(canvas.getByText("Badge")).toBeVisible();
      await expect(canvas.queryByRole("button")).toBeNull();
    });

    await step("passes native attributes through to the root", async () => {
      await expect(canvasElement.querySelector('[data-slot="badge"]')).toHaveAttribute("id", "status");
    });
  },
};

export const Variants: Story = {
  render: (args) => (
    <div style={row}>
      <Badge {...args} variant="filled">
        Filled
      </Badge>
      <Badge {...args} variant="outline">
        Outline
      </Badge>
    </div>
  ),
};

/** Outline badges draw their border in the tone's text color. */
export const Tones: Story = {
  render: (args) => (
    <div style={stack}>
      {(["filled", "outline"] as const).map((variant) => (
        <div key={variant} style={row}>
          {tones.map((tone) => (
            <Badge {...args} key={tone} variant={variant} tone={tone}>
              {tone[0]!.toUpperCase() + tone.slice(1)}
            </Badge>
          ))}
        </div>
      ))}
    </div>
  ),
};

/** Dark mode swaps the semantic tokens, so contrast is checked here too. */
export const TonesDark: Story = {
  name: "Tones (dark)",
  globals: { theme: "dark" },
  render: Tones.render,
  play: async () => {
    // Guards the contrast check: if the theme global stops applying, this story would silently test light mode.
    await expect(document.documentElement).toHaveAttribute("data-theme", "dark");
  },
};

export const Sizes: Story = {
  render: (args) => (
    <div style={stack}>
      {(["filled", "outline"] as const).map((variant) => (
        <div key={variant} style={row}>
          <Badge {...args} variant={variant} size="sm">
            Small
          </Badge>
          <Badge {...args} variant={variant} size="md">
            Medium
          </Badge>
          <Badge {...args} variant={variant} size="lg">
            Large
          </Badge>
        </div>
      ))}
    </div>
  ),
};

export const WithIcon: Story = {
  render: (args) => (
    <div style={stack}>
      {(["sm", "md", "lg"] as const).map((size) => (
        <div key={size} style={row}>
          <Badge {...args} size={size} startIcon={<CheckIcon />}>
            Shipped
          </Badge>
          <Badge {...args} size={size} variant="outline" startIcon={<StarIcon />}>
            Featured
          </Badge>
          <Badge {...args} size={size} endIcon={<ArrowRightIcon />}>
            Next up
          </Badge>
          <Badge {...args} size={size} variant="outline" endIcon={<ArrowRightIcon />}>
            Next up
          </Badge>
        </div>
      ))}
    </div>
  ),
};

export const IconPlacement: Story = {
  render: (args) => (
    <div style={row}>
      <Badge {...args} startIcon={<CheckIcon />}>
        Start
      </Badge>
      <Badge {...args} endIcon={<ArrowRightIcon />}>
        End
      </Badge>
    </div>
  ),
  play: async ({ canvas, canvasElement, step }) => {
    const start = canvas.getByText("Start");
    const end = canvas.getByText("End");

    await step("places startIcon before the label and endIcon after it", async () => {
      await expect(start.firstElementChild).toHaveAttribute("data-position", "start");
      await expect(end.lastElementChild).toHaveAttribute("data-position", "end");
    });

    await step("hides icons from assistive tech, so the label alone is announced", async () => {
      for (const icon of canvasElement.querySelectorAll('[data-slot="icon"]')) {
        await expect(icon).toHaveAttribute("aria-hidden", "true");
      }
      await expect(start).toHaveTextContent(/^Start$/);
    });
  },
};
