import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, userEvent, waitFor } from "storybook/test";
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
    question: "Which browsers does Keyline support?",
    answer: "The last two versions of Chrome, Edge, Firefox and Safari, on desktop and mobile.",
  },
  {
    question: "Can I use it without Tailwind?",
    answer: "Yes. The package ships a compiled stylesheet, so your app doesn't need Tailwind to use the components.",
  },
  {
    question: "Does it support dark mode?",
    answer: 'Set data-theme="dark" on <html>, or on any element to darken just that part of the page.',
  },
  {
    question: "How do I report a bug?",
    answer: "Open an issue on GitHub with the component, the browser, and the steps that show the problem.",
  },
];

// Called as a function, not rendered as <FaqAccordion>, so the story returns the Accordion itself
// and the docs' "Show code" snippet shows how it's composed rather than a helper component.
function faqAccordion(props: AccordionProps, open: string[] = []) {
  return (
    <Accordion style={width} {...props}>
      {faqs.map(({ question, answer }) => (
        <AccordionItem key={question} open={open.includes(question)}>
          <AccordionTrigger>{question}</AccordionTrigger>
          <AccordionContent>{answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

/** The `<details>` an AccordionTrigger with this text belongs to. */
function itemFor(trigger: HTMLElement) {
  return trigger.closest("details")!;
}

const meta = {
  title: "Layout/Accordion",
  component: Accordion,
  tags: ["autodocs"],
  // The component's page in the Figma file, for the toolbar's Figma link. Empty hides the link.
  parameters: {
    design: { type: "figma", url: "" },
  },
  render: (args) => faqAccordion(args),
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas, step }) => {
    const [first, second] = faqs.map(({ question }) => canvas.getByText(question));
    const firstAnswer = canvas.getByText(faqs[0]!.answer);

    await step("starts with every item closed", async () => {
      for (const { answer } of faqs) await expect(canvas.getByText(answer)).not.toBeVisible();
    });

    // Enter and Space toggle a <summary> natively, but only for trusted key presses, which
    // userEvent's synthetic events aren't, so only focus is checked here.
    await step("reaches each trigger with Tab", async () => {
      await userEvent.tab();
      await expect(first!.closest("summary")).toHaveFocus();
      await userEvent.tab();
      await expect(second!.closest("summary")).toHaveFocus();
    });

    await step("opens and closes an item on click", async () => {
      await userEvent.click(first!);
      await expect(itemFor(first!)).toHaveAttribute("open");
      await expect(firstAnswer).toBeVisible();
      await userEvent.click(first!);
      await expect(itemFor(first!)).not.toHaveAttribute("open");
      await expect(firstAnswer).not.toBeVisible();
    });

    await step("keeps several items open at once", async () => {
      await userEvent.click(first!);
      await userEvent.click(second!);
      await expect(itemFor(first!)).toHaveAttribute("open");
      await expect(itemFor(second!)).toHaveAttribute("open");
    });
  },
};

/** `exclusive` keeps at most one item open: opening one closes the one that was open. */
export const Exclusive: Story = {
  args: { exclusive: true },
  play: async ({ canvas, step }) => {
    const [first, second] = faqs.map(({ question }) => canvas.getByText(question));

    await step("closes the open item when another opens", async () => {
      await userEvent.click(first!);
      await expect(itemFor(first!)).toHaveAttribute("open");
      await userEvent.click(second!);
      await expect(itemFor(second!)).toHaveAttribute("open");
      await expect(itemFor(first!)).not.toHaveAttribute("open");
    });

    await step("can still close every item", async () => {
      await userEvent.click(second!);
      for (const { question } of faqs) await expect(itemFor(canvas.getByText(question))).not.toHaveAttribute("open");
    });
  },
};

/** `open` on an AccordionItem starts it open. */
export const OpenItem: Story = {
  render: (args) => faqAccordion(args, [faqs[1]!.question]),
  play: async ({ canvas }) => {
    await expect(canvas.getByText(faqs[1]!.answer)).toBeVisible();
    await expect(canvas.getByText(faqs[0]!.answer)).not.toBeVisible();
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
      <Button variant="secondary" size="sm" onClick={() => setOpen(allOpen ? [] : faqs.map((faq) => faq.question))}>
        {allOpen ? "Collapse all" : "Expand all"}
      </Button>
      <Accordion style={{ ...width, alignSelf: "stretch" }} {...props}>
        {faqs.map(({ question, answer }) => (
          <AccordionItem
            key={question}
            open={open.includes(question)}
            onToggle={(event) => {
              const isOpen = event.currentTarget.open;
              setOpen((current) => (isOpen ? [...new Set([...current, question])] : current.filter((q) => q !== question)));
            }}
          >
            <AccordionTrigger>{question}</AccordionTrigger>
            <AccordionContent>{answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

/**
 * To control which items are open, keep them in state, pass `open` to each AccordionItem, and
 * update the state from `onToggle`, which fires however the item was toggled: by the reader, by
 * find-in-page, or by the `open` prop itself.
 */
export const Controlled: Story = {
  render: (args) => <ControlledAccordion {...args} />,
  play: async ({ canvas, step }) => {
    const items = () => faqs.map(({ question }) => itemFor(canvas.getByText(question)));

    await step("opens every item from outside", async () => {
      await userEvent.click(canvas.getByRole("button", { name: "Expand all" }));
      for (const item of items()) await expect(item).toHaveAttribute("open");
    });

    await step("follows the reader closing one", async () => {
      await userEvent.click(canvas.getByText(faqs[0]!.question));
      await waitFor(() => expect(canvas.getByRole("button", { name: "Expand all" })).toBeInTheDocument());
      await expect(items()[0]).not.toHaveAttribute("open");
    });

    await step("closes every item from outside", async () => {
      await userEvent.click(canvas.getByRole("button", { name: "Expand all" }));
      await userEvent.click(canvas.getByRole("button", { name: "Collapse all" }));
      for (const item of items()) await expect(item).not.toHaveAttribute("open");
    });
  },
};

export const Variants: Story = {
  render: (args) => (
    <div style={column}>
      {faqAccordion(args, [faqs[0]!.question])}
      {faqAccordion({ ...args, flat: true }, [faqs[0]!.question])}
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
