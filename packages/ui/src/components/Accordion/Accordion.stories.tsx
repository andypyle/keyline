import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, fn, userEvent } from "storybook/test";
import { Button } from "@/components/Button/Button";
import { Accordion } from "./Accordion";
import type { AccordionProps } from "./Accordion.types";
import { AccordionContent } from "./parts/AccordionContent";
import { AccordionItem } from "./parts/AccordionItem";
import { AccordionTrigger } from "./parts/AccordionTrigger";

// Stories are excluded from Tailwind's source scan, so layout here uses inline styles.
const column = { display: "flex", flexDirection: "column", gap: 32, maxWidth: 560 } as const;
const width = { maxWidth: 560 } as const;

const faqs = [
  {
    value: "browsers",
    question: "Which browsers does Keyline support?",
    answer: "The last two versions of Chrome, Edge, Firefox and Safari, on desktop and mobile.",
  },
  {
    value: "tailwind",
    question: "Can I use it without Tailwind?",
    answer: "Yes. The package ships a compiled stylesheet, so your app doesn't need Tailwind to use the components.",
  },
  {
    value: "dark-mode",
    question: "Does it support dark mode?",
    answer: 'Set data-theme="dark" on <html>, or on any element to darken just that part of the page.',
  },
  {
    value: "bugs",
    question: "How do I report a bug?",
    answer: "Open an issue on GitHub with the component, the browser, and the steps that show the problem.",
  },
];

// A second set, so stories showing two accordions don't repeat a section's name: each open
// section's content is a region named by its question, and regions need unique names.
const setupFaqs = [
  {
    value: "install",
    question: "How do I install Keyline?",
    answer: "Add @keyline/ui with your package manager, then import its stylesheet once in your app.",
  },
  {
    value: "fonts",
    question: "Do I need to load the fonts myself?",
    answer: "No. The stylesheet includes the typefaces, so the components look right out of the box.",
  },
  {
    value: "react",
    question: "Which React versions work?",
    answer: "React 19 and later, since components take ref as a regular prop.",
  },
  {
    value: "ssr",
    question: "Does it work with server rendering?",
    answer: "Yes. Components render on the server and hydrate on the client.",
  },
];

// Called as a function, not rendered as <FaqAccordion>, so the story returns the Accordion itself
// and the docs' "Show code" snippet shows how it's composed rather than a helper component.
function faqAccordion(props: AccordionProps, disabled: string[] = [], items = faqs) {
  return (
    <Accordion style={width} {...props}>
      {items.map(({ value, question, answer }) => (
        <AccordionItem key={value} value={value} disabled={disabled.includes(value)}>
          <AccordionTrigger>{question}</AccordionTrigger>
          <AccordionContent>{answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

const meta = {
  title: "Layout/Accordion",
  component: Accordion,
  tags: ["autodocs"],
  // The component's page in the Figma file, for the toolbar's Figma link. Empty hides the link.
  parameters: {
    design: { type: "figma", url: "https://www.figma.com/design/gVJvJJAOtJkcdeBHk61Ivb/Keyline?node-id=144-18" },
  },
  args: { onValueChange: fn() },
  render: (args) => faqAccordion(args),
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ args, canvas, step }) => {
    const triggers = faqs.map(({ question }) => canvas.getByRole("button", { name: question }));
    const [first, second, , last] = triggers;

    await step("labels each section with a heading holding its trigger", async () => {
      const headings = canvas.getAllByRole("heading", { level: 3 });
      await expect(headings.map((heading) => heading.textContent)).toEqual(faqs.map((faq) => faq.question));
      for (const [index, trigger] of triggers.entries()) await expect(headings[index]).toContainElement(trigger);
    });

    await step("starts with every item closed and its content hidden", async () => {
      for (const trigger of triggers) await expect(trigger).toHaveAttribute("aria-expanded", "false");
      for (const { answer } of faqs) await expect(canvas.queryByText(answer)).not.toBeVisible();
    });

    await step("opens and closes an item on click", async () => {
      await userEvent.click(first!);
      await expect(first).toHaveAttribute("aria-expanded", "true");
      const region = canvas.getByRole("region", { name: faqs[0]!.question });
      await expect(first).toHaveAttribute("aria-controls", region.id);
      await expect(region).toHaveTextContent(faqs[0]!.answer);
      await expect(region).toBeVisible();
      await expect(args.onValueChange).toHaveBeenLastCalledWith(["browsers"]);
      await userEvent.click(first!);
      await expect(first).toHaveAttribute("aria-expanded", "false");
      await expect(canvas.queryByText(faqs[0]!.answer)).not.toBeVisible();
      await expect(args.onValueChange).toHaveBeenLastCalledWith([]);
    });

    await step("toggles with Enter and Space", async () => {
      first!.focus();
      await userEvent.keyboard("{Enter}");
      await expect(first).toHaveAttribute("aria-expanded", "true");
      await userEvent.keyboard(" ");
      await expect(first).toHaveAttribute("aria-expanded", "false");
    });

    await step("moves between triggers with the arrow keys, Home and End, wrapping at the ends", async () => {
      first!.focus();
      await userEvent.keyboard("{ArrowDown}");
      await expect(second).toHaveFocus();
      await userEvent.keyboard("{End}");
      await expect(last).toHaveFocus();
      await userEvent.keyboard("{ArrowDown}");
      await expect(first).toHaveFocus();
      await userEvent.keyboard("{ArrowUp}");
      await expect(last).toHaveFocus();
      await userEvent.keyboard("{Home}");
      await expect(first).toHaveFocus();
    });

    await step("keeps several items open at once", async () => {
      await userEvent.click(first!);
      await userEvent.click(second!);
      await expect(first).toHaveAttribute("aria-expanded", "true");
      await expect(second).toHaveAttribute("aria-expanded", "true");
      await expect(args.onValueChange).toHaveBeenLastCalledWith(["browsers", "tailwind"]);
    });

    await step("keeps closed content out of the Tab order", async () => {
      await userEvent.click(second!);
      await userEvent.click(first!);
      first!.focus();
      await userEvent.tab();
      await expect(second).toHaveFocus();
    });
  },
};

/** `exclusive` keeps at most one item open: opening one closes the one that was open. */
export const Exclusive: Story = {
  args: { exclusive: true },
  play: async ({ args, canvas, step }) => {
    const [first, second] = faqs.map(({ question }) => canvas.getByRole("button", { name: question }));

    await step("closes the open item when another opens", async () => {
      await userEvent.click(first!);
      await userEvent.click(second!);
      await expect(second).toHaveAttribute("aria-expanded", "true");
      await expect(first).toHaveAttribute("aria-expanded", "false");
      await expect(args.onValueChange).toHaveBeenLastCalledWith(["tailwind"]);
    });

    await step("can still close every item", async () => {
      await userEvent.click(second!);
      await expect(second).toHaveAttribute("aria-expanded", "false");
      await expect(args.onValueChange).toHaveBeenLastCalledWith([]);
    });
  },
};

/** `defaultValue` lists the items open at first, by their `value`. */
export const DefaultValue: Story = {
  args: { defaultValue: ["tailwind"] },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("button", { name: faqs[1]!.question })).toHaveAttribute("aria-expanded", "true");
    await expect(canvas.getByText(faqs[1]!.answer)).toBeVisible();
    await expect(canvas.queryByText(faqs[0]!.answer)).not.toBeVisible();
  },
};

/** A `disabled` item stays as it is, and the keyboard skips its trigger. */
export const DisabledItem: Story = {
  render: (args) => faqAccordion(args, ["tailwind"]),
  play: async ({ args, canvas }) => {
    const [first, disabled, third] = faqs.map(({ question }) => canvas.getByRole("button", { name: question }));
    await expect(disabled).toBeDisabled();
    await userEvent.click(disabled!);
    await expect(disabled).toHaveAttribute("aria-expanded", "false");
    await expect(args.onValueChange).not.toHaveBeenCalled();
    first!.focus();
    await userEvent.keyboard("{ArrowDown}");
    await expect(third).toHaveFocus();
  },
};

/** `headingLevel` sets the heading around each trigger; pick the level below the accordion's own heading. */
export const HeadingLevel: Story = {
  args: { headingLevel: 2 },
  play: async ({ canvas }) => {
    await expect(canvas.getAllByRole("heading", { level: 2 })).toHaveLength(faqs.length);
  },
};

/** `flat` keeps the outline but drops the shadow. */
export const Flat: Story = {
  args: { flat: true },
};

function ControlledAccordion(props: AccordionProps) {
  const [open, setOpen] = useState<string[]>([]);
  const allOpen = open.length === faqs.length;
  return (
    <div style={{ ...column, gap: 16, alignItems: "flex-start" }}>
      <Button variant="secondary" size="sm" onClick={() => setOpen(allOpen ? [] : faqs.map((faq) => faq.value))}>
        {allOpen ? "Collapse all" : "Expand all"}
      </Button>
      <Accordion
        style={{ ...width, alignSelf: "stretch" }}
        {...props}
        value={open}
        onValueChange={(next) => {
          props.onValueChange?.(next);
          setOpen(next);
        }}
      >
        {faqs.map(({ value, question, answer }) => (
          <AccordionItem key={value} value={value}>
            <AccordionTrigger>{question}</AccordionTrigger>
            <AccordionContent>{answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

/**
 * To control which items are open, pass `value` and update it from `onValueChange`. The items
 * only change through `value`: here, Expand all opens every item from outside the accordion.
 */
export const Controlled: Story = {
  render: (args) => <ControlledAccordion {...args} />,
  play: async ({ canvas, step }) => {
    const triggers = () => faqs.map(({ question }) => canvas.getByRole("button", { name: question }));

    await step("opens every item from outside", async () => {
      await userEvent.click(canvas.getByRole("button", { name: "Expand all" }));
      for (const trigger of triggers()) await expect(trigger).toHaveAttribute("aria-expanded", "true");
    });

    await step("follows the reader closing one", async () => {
      await userEvent.click(triggers()[0]!);
      await expect(triggers()[0]).toHaveAttribute("aria-expanded", "false");
      await expect(canvas.getByRole("button", { name: "Expand all" })).toBeInTheDocument();
    });

    await step("closes every item from outside", async () => {
      await userEvent.click(canvas.getByRole("button", { name: "Expand all" }));
      await userEvent.click(canvas.getByRole("button", { name: "Collapse all" }));
      for (const trigger of triggers()) await expect(trigger).toHaveAttribute("aria-expanded", "false");
    });
  },
};

export const Variants: Story = {
  render: (args) => (
    <div style={column}>
      {faqAccordion({ ...args, defaultValue: ["browsers"] }, ["bugs"])}
      {faqAccordion({ ...args, defaultValue: ["install"], flat: true }, [], setupFaqs)}
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
