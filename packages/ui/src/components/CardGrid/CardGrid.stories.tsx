import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent } from "storybook/test";
import { Card } from "../Card/Card";
import { CardAction } from "../Card/parts/CardAction";
import { CardBody } from "../Card/parts/CardBody";
import { CardDescription } from "../Card/parts/CardDescription";
import { CardImage } from "../Card/parts/CardImage";
import { CardTitle } from "../Card/parts/CardTitle";
import { CardGrid } from "./CardGrid";

const image = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 180">
    <rect width="320" height="180" fill="#c9d6c2"/>
    <circle cx="236" cy="62" r="30" fill="#e8c27a"/>
    <path d="M0 180 L96 84 L168 150 L212 112 L320 180 Z" fill="#6f8f68"/>
  </svg>`,
)}`;

const projects = [
  { title: "Keyline", description: "Tokens, components and docs for a small team shipping three products." },
  { title: "Loam", description: "A warm, earthy theme for a personal site." },
  { title: "Fieldnotes", description: "A notebook app that syncs plain Markdown files." },
  { title: "Tidewater", description: "Live tide charts for the Chesapeake Bay." },
  { title: "Ledger", description: "Shared household budgets without the spreadsheet." },
  { title: "Kiln", description: "A static site generator with zero config." },
  { title: "Trellis", description: "Garden planning by frost date and sun hours." },
  { title: "Signal Path", description: "Patch notes and diagrams for modular synths." },
];

interface ProjectCardProps {
  title: string;
  description: string;
  horizontal?: boolean;
  reversed?: boolean;
}

function ProjectCard({ title, description, horizontal, reversed }: ProjectCardProps) {
  return (
    // Left undefined unless set, so a one-column grid can choose.
    <Card orientation={horizontal ? "horizontal" : undefined} reversed={reversed}>
      <CardImage src={image} alt="" />
      <CardBody>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
        <CardAction href={`#${title.toLowerCase().replaceAll(" ", "-")}`}>Read about {title}</CardAction>
      </CardBody>
    </Card>
  );
}

const meta = {
  title: "Layout/CardGrid",
  component: CardGrid,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: { columns: 4, featured: false },
  argTypes: {
    columns: { control: "inline-radio", options: [1, 2, 3, 4] },
    children: { table: { disable: true } },
  },
  render: (args) => (
    <CardGrid {...args}>
      {projects.map((project) => (
        <ProjectCard key={project.title} {...project} />
      ))}
    </CardGrid>
  ),
} satisfies Meta<typeof CardGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas, step }) => {
    const links = canvas.getAllByRole("link");

    await step("keeps the cards in source order for keyboard users", async () => {
      for (const link of links) {
        await userEvent.tab();
        await expect(link).toHaveFocus();
      }
    });
  },
};

export const ThreeColumns: Story = {
  args: { columns: 3 },
};

export const TwoColumns: Story = {
  args: { columns: 2 },
};

/**
 * With `featured`, the card after each full row gets a row to itself: here, three cards and then
 * one horizontal card, repeating. Make the featured cards `orientation="horizontal"`, and add
 * `reversed` to put the image on the right, as the second one does here.
 */
export const Featured: Story = {
  args: { columns: 3, featured: true },
  render: (args) => (
    <CardGrid {...args}>
      {projects.map((project, index) => (
        <ProjectCard
          key={project.title}
          {...project}
          horizontal={(index + 1) % 4 === 0}
          reversed={(index + 1) % 8 === 0}
        />
      ))}
    </CardGrid>
  ),
};

/**
 * `columns={1}` features every card: each is horizontal, and the image switches sides from card to
 * card. A Card's own `orientation` or `reversed` overrides this.
 */
export const Alternating: Story = {
  args: { columns: 1 },
  render: (args) => (
    <CardGrid {...args}>
      {projects.slice(0, 4).map((project) => (
        <ProjectCard key={project.title} {...project} />
      ))}
    </CardGrid>
  ),
  play: async ({ canvasElement }) => {
    const cards = [...canvasElement.querySelectorAll("[data-slot=card]")];
    for (const [index, card] of cards.entries()) {
      await expect(card).toHaveAttribute("data-orientation", "horizontal");
      await expect(card).toHaveAttribute("data-reversed", String(index % 2 === 1));
    }
  },
};
