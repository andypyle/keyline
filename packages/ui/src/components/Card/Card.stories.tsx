import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent } from "storybook/test";
import { Card } from "./Card";
import type { CardProps } from "./Card.types";
import { CardAction } from "./parts/CardAction";
import { CardBody } from "./parts/CardBody";
import { CardDescription } from "./parts/CardDescription";
import { CardImage } from "./parts/CardImage";
import { CardTag } from "./parts/CardTag";
import { CardTags } from "./parts/CardTags";
import { CardTitle } from "./parts/CardTitle";

// Stories are excluded from Tailwind's source scan, so layout here uses inline styles.
const row = { display: "flex", flexWrap: "wrap", alignItems: "stretch", gap: 24 } as const;
const width = { width: 320 } as const;

const image = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 180">
    <rect width="320" height="180" fill="#c9d6c2"/>
    <circle cx="236" cy="62" r="30" fill="#e8c27a"/>
    <path d="M0 180 L96 84 L168 150 L212 112 L320 180 Z" fill="#6f8f68"/>
  </svg>`,
)}`;

// The play functions click where a user would, so they check what's actually under the pointer:
// userEvent.click(element) dispatches on that element without hit-testing.
function hitAt(element: Element, x: number, y: number) {
  const rect = element.getBoundingClientRect();
  return document.elementFromPoint(rect.left + rect.width * x, rect.top + rect.height * y);
}

type CardStoryArgs = CardProps & { onAction: () => void };

function ProjectCard({ onAction, ...args }: CardStoryArgs) {
  return (
    <Card style={width} {...args}>
      <CardImage src={image} alt="" />
      <CardBody>
        <CardTitle>Keyline design system</CardTitle>
        <CardDescription>Tokens, components and docs for a small team shipping three products.</CardDescription>
        <CardTags aria-label="Topics">
          <CardTag>React</CardTag>
          <CardTag>Tailwind</CardTag>
          <CardTag>Storybook</CardTag>
        </CardTags>
        <CardAction onClick={onAction}>Read the Keyline case study</CardAction>
      </CardBody>
    </Card>
  );
}

function NotesCard({ onAction, ...args }: CardStoryArgs) {
  return (
    <Card {...args} style={width}>
      <CardBody>
        <CardTitle>Release notes</CardTitle>
        <CardDescription>What changed in Keyline 0.4, and how to upgrade.</CardDescription>
        <CardTags aria-label="Topics">
          <CardTag>Changelog</CardTag>
        </CardTags>
        <CardAction variant="secondary" onClick={onAction}>
          Read the 0.4 release notes
        </CardAction>
      </CardBody>
    </Card>
  );
}

const meta = {
  title: "Layout/Card",
  component: Card,
  tags: ["autodocs"],
  parameters: {
    design: { type: "figma", url: "https://www.figma.com/design/gVJvJJAOtJkcdeBHk61Ivb/Keyline?node-id=2-183" },
  },
  args: { flat: false, noBorders: false, orientation: "vertical", reversed: false, onAction: fn() },
  argTypes: {
    onAction: { table: { disable: true } },
  },
  render: (args) => <ProjectCard {...args} />,
} satisfies Meta<CardStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ args, canvas, canvasElement, step }) => {
    const action = canvas.getByRole("button", { name: "Read the Keyline case study" });

    await step("defaults the action to type=button, so it never submits a surrounding form", async () => {
      await expect(action).toHaveAttribute("type", "button");
    });

    await step("is a single tab stop that activates with Enter and Space", async () => {
      await userEvent.tab();
      await expect(action).toHaveFocus();
      await userEvent.keyboard("{Enter}");
      await userEvent.keyboard(" ");
      await expect(args.onAction).toHaveBeenCalledTimes(2);
      await userEvent.tab();
      await expect(action).not.toHaveFocus();
    });

    await step("makes the whole card the click target", async () => {
      const card = action.closest("[data-slot=card]")!;
      const targets = [
        // Decorative (alt=""), so it has no img role to query by.
        hitAt(canvasElement.querySelector("[data-slot=card-image]")!, 0.5, 0.5),
        hitAt(canvas.getByRole("heading"), 0.5, 0.5),
        hitAt(canvas.getByText("React"), 0.5, 0.5),
        // The outline's corners, so the border counts as part of the card.
        hitAt(card, 0.5, 0.002),
        hitAt(card, 0.998, 0.5),
      ];
      for (const target of targets) await expect(target).toBe(action);

      await userEvent.click(targets[1]!);
      await expect(args.onAction).toHaveBeenCalledTimes(3);
    });
  },
};

/** With `href`, the action is a link and the whole card navigates. */
export const Link: Story = {
  // onAction is a story arg, not a Card prop, so it's kept off the Card.
  render: ({ onAction: _, ...args }) => (
    <Card {...args} style={width}>
      <CardImage src={image} alt="" />
      <CardBody>
        <CardTitle>Keyline design system</CardTitle>
        <CardDescription>Tokens, components and docs for a small team shipping three products.</CardDescription>
        <CardAction href="#keyline">Read the Keyline case study</CardAction>
      </CardBody>
    </Card>
  ),
  play: async ({ canvas }) => {
    const link = canvas.getByRole("link", { name: "Read the Keyline case study" });
    await expect(link).toHaveAttribute("href", "#keyline");
    await expect(hitAt(canvas.getByRole("heading"), 0.5, 0.5)).toBe(link);
  },
};

export const WithoutImage: Story = {
  render: (args) => <NotesCard {...args} />,
};

/** `flat` keeps the outline but drops the shadow and the hover lift. */
export const Flat: Story = {
  args: { flat: true },
};

/** `noBorders` drops the outline, and with it the shadow and the hover lift. */
export const NoBorders: Story = {
  args: { noBorders: true },
};

/** Without a CardAction the card is static: it doesn't lift, and nothing in it is focusable. */
export const WithoutAction: Story = {
  // onAction is a story arg, not a Card prop, so it's kept off the Card.
  render: ({ onAction: _, ...args }) => (
    <Card {...args} style={width}>
      <CardImage src={image} alt="" />
      <CardBody>
        <CardTitle>Keyline design system</CardTitle>
        <CardDescription>Tokens, components and docs for a small team shipping three products.</CardDescription>
      </CardBody>
    </Card>
  ),
  play: async () => {
    await userEvent.tab();
    await expect(document.body).toHaveFocus();
  },
};

/**
 * A horizontal card puts the image beside the body once the card is 42rem wide, and stacks them
 * below that. It sizes to its container, so give it a width.
 */
export const Horizontal: Story = {
  args: { orientation: "horizontal" },
  render: (args) => (
    <div style={{ display: "grid", gap: 24 }}>
      <ProjectCard {...args} style={{ maxWidth: 760 }} />
      <ProjectCard {...args} style={width} />
    </div>
  ),
  play: async ({ canvas }) => {
    const [wide] = canvas.getAllByRole("button", { name: "Read the Keyline case study" });
    const card = wide!.closest("[data-slot=card]")!;
    // The layout wrapper must not take over as the overlay's containing block.
    await expect(hitAt(card.querySelector("[data-slot=card-image]")!, 0.5, 0.5)).toBe(wide);
    await expect(hitAt(card, 0.998, 0.5)).toBe(wide);
  },
};

/** `reversed` mirrors a wide horizontal card: the image on the right, the body aligned left. */
export const HorizontalReversed: Story = {
  args: { orientation: "horizontal", reversed: true },
  render: Horizontal.render,
  play: Horizontal.play,
};

export const DisabledAction: Story = {
  render: ({ onAction, ...args }) => (
    <Card {...args} style={width}>
      <CardBody>
        <CardTitle>Keyline 1.0</CardTitle>
        <CardDescription>The stable release, coming soon.</CardDescription>
        <CardAction disabled onClick={onAction}>
          Read the 1.0 release notes
        </CardAction>
      </CardBody>
    </Card>
  ),
  play: async ({ args, canvas, step }) => {
    const action = canvas.getByRole("button", { name: "Read the 1.0 release notes" });

    await step("ignores clicks anywhere on the card", async () => {
      await expect(action).toBeDisabled();
      await userEvent.click(hitAt(canvas.getByRole("heading"), 0.5, 0.5)!);
      await expect(args.onAction).not.toHaveBeenCalled();
    });

    await step("is skipped by keyboard navigation", async () => {
      await userEvent.tab();
      await expect(action).not.toHaveFocus();
    });
  },
};

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12l5 5L19 7" />
    </svg>
  );
}

/** CardTags are Badges, neutral outlines by default. They take Badge's `variant`, `tone`, `size` and icons. */
export const Tags: Story = {
  render: ({ onAction: _, ...args }) => (
    <Card {...args} style={width}>
      <CardBody>
        <CardTitle>Keyline 0.5</CardTitle>
        <CardDescription>Badges, status tokens and a new Display section.</CardDescription>
        <CardTags aria-label="Status">
          <CardTag tone="success" startIcon={<CheckIcon />}>
            Shipped
          </CardTag>
          <CardTag variant="filled" tone="info">
            Minor
          </CardTag>
          <CardTag tone="warning">Needs docs</CardTag>
          <CardTag>Components</CardTag>
        </CardTags>
      </CardBody>
    </Card>
  ),
  play: async ({ canvas, step }) => {
    await step("renders a list item per tag", async () => {
      const list = canvas.getByRole("list", { name: "Status" });
      await expect(list.querySelectorAll(":scope > li")).toHaveLength(4);
    });

    await step("hides tag icons from assistive tech, so the label alone is announced", async () => {
      const shipped = canvas.getByText("Shipped").closest("li")!;
      await expect(shipped.querySelector('[data-slot="icon"]')).toHaveAttribute("aria-hidden", "true");
      await expect(shipped).toHaveTextContent(/^Shipped$/);
    });
  },
};

/** Dark mode swaps the semantic tokens, so contrast is checked here too. */
export const TagsDark: Story = {
  name: "Tags (dark)",
  globals: { theme: "dark" },
  render: Tags.render,
  play: async () => {
    // Guards the contrast check: if the theme global stops applying, this story would silently test light mode.
    await expect(document.documentElement).toHaveAttribute("data-theme", "dark");
  },
};

export const Variants: Story = {
  render: (args) => (
    <div style={row}>
      <ProjectCard {...args} />
      <ProjectCard {...args} flat />
      <ProjectCard {...args} noBorders />
      <NotesCard {...args} />
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
