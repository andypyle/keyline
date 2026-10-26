import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, waitFor } from "storybook/test";
import { Modal } from "@/components/Modal/Modal";
import { ModalContent } from "@/components/Modal/parts/ModalContent";
import { ModalDescription } from "@/components/Modal/parts/ModalDescription";
import { ModalTitle } from "@/components/Modal/parts/ModalTitle";
import { ModalTrigger } from "@/components/Modal/parts/ModalTrigger";
import { Tooltip } from "./Tooltip";
import type { TooltipProps } from "./Tooltip.types";
import { TooltipContent } from "./parts/TooltipContent";
import type { TooltipContentProps } from "./parts/TooltipContent.types";
import { TooltipTrigger } from "./parts/TooltipTrigger";

// Stories are excluded from Tailwind's source scan, so layout here uses inline styles. Triggers are
// centered with room above, where tooltips show by default, so a tooltip wider than its trigger
// isn't pushed back inside the viewport.
const row = { display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: 8, paddingTop: 72 } as const;
// Room around each trigger for its tooltip, which is held open.
const column = { display: "flex", flexDirection: "column", alignItems: "center", gap: 72, padding: "48px 0" } as const;

function Icon({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}

const LinkIcon = () => <Icon d="M10 14a4 4 0 0 0 6 0l3-3a4 4 0 0 0-6-6l-1 1M14 10a4 4 0 0 0-6 0l-3 3a4 4 0 0 0 6 6l1-1" />;
const PencilIcon = () => <Icon d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16v4zM13.5 6.5l4 4" />;
const CopyIcon = () => <Icon d="M9 9h11v11H9zM5 15H4V4h11v1" />;
const ArchiveIcon = () => <Icon d="M3 4h18v4H3zM5 8v12h14V8M10 12h4" />;
const InfoIcon = () => <Icon d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 11v5M12 7.5v.5" />;

const COPY_LINK = "Copy a link to this project";

type TooltipStoryArgs = TooltipProps & {
  side?: TooltipContentProps["side"];
  align?: TooltipContentProps["align"];
};

// Called as a function, not rendered as <CopyLinkTooltip>, so a story returns the Tooltip itself
// and the docs' "Show code" snippet shows how it's composed rather than a helper component.
function copyLinkTooltip({ side, align, ...args }: TooltipStoryArgs) {
  return (
    <Tooltip {...args}>
      <TooltipTrigger variant="secondary" size="icon" aria-label="Copy link" startIcon={<LinkIcon />} />
      <TooltipContent side={side} align={align}>
        {COPY_LINK}
      </TooltipContent>
    </Tooltip>
  );
}

const meta = {
  title: "Overlays/Tooltip",
  component: Tooltip,
  tags: ["autodocs"],
  parameters: {
    design: { type: "figma", url: "https://www.figma.com/design/gVJvJJAOtJkcdeBHk61Ivb/Keyline?node-id=181-19" },
  },
  args: { onOpenChange: fn() },
  argTypes: {
    open: { control: false },
    defaultOpen: { control: false },
    delay: { control: { type: "number", min: 0, step: 100 } },
    side: { table: { disable: true } },
    align: { table: { disable: true } },
  },
  render: (args) => <div style={row}>{copyLinkTooltip(args)}</div>,
} satisfies Meta<TooltipStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

const pause = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// A hiding tooltip stays in the DOM while it fades out, so check the trigger's state, which changes
// straight away, then wait for the tooltip to go. It's gone once display switches to none at the
// end of the fade; it reaches opacity 0 a frame earlier, while role queries still find it. Tests
// run with reduced motion, but the Storybook UI doesn't.
async function expectHidden(trigger: HTMLElement) {
  await expect(trigger).toHaveAttribute("data-state", "closed");
  const tooltip = document.getElementById(trigger.getAttribute("aria-describedby")!.split(" ").at(-1)!)!;
  await waitFor(() => expect(getComputedStyle(tooltip).display).toBe("none"));
}

export const Default: Story = {
  play: async ({ args, canvas, step }) => {
    const trigger = canvas.getByRole("button", { name: "Copy link" });

    await step("describes the trigger with its text, even while hidden", async () => {
      await expect(trigger).toHaveAccessibleDescription(COPY_LINK);
      await expect(canvas.queryByRole("tooltip")).not.toBeInTheDocument();
    });

    await step("shows once the pointer has rested on the trigger for the delay", async () => {
      await userEvent.hover(trigger);
      await pause(150);
      await expect(trigger).toHaveAttribute("data-state", "closed");
      await waitFor(() => expect(canvas.getByRole("tooltip")).toHaveTextContent(COPY_LINK));
      await expect(args.onOpenChange).toHaveBeenLastCalledWith(true);
    });

    await step("stays up while the pointer moves onto the tooltip itself", async () => {
      await userEvent.hover(canvas.getByRole("tooltip"));
      await pause(300);
      await expect(canvas.getByRole("tooltip")).toBeInTheDocument();
    });

    await step("hides once the pointer leaves", async () => {
      await userEvent.unhover(canvas.getByRole("tooltip"));
      await waitFor(() => expect(canvas.queryByRole("tooltip")).not.toBeInTheDocument());
      await expect(args.onOpenChange).toHaveBeenLastCalledWith(false);
    });

    await step("hides when the trigger is pressed, and stays hidden while the pointer is still on it", async () => {
      await userEvent.hover(trigger);
      await waitFor(() => expect(canvas.getByRole("tooltip")).toBeInTheDocument());
      await userEvent.click(trigger);
      await expectHidden(trigger);
      await pause(700);
      await expectHidden(trigger);
      await userEvent.unhover(trigger);
    });
  },
};

/** Keyboard focus shows the tooltip straight away; Escape hides it without moving focus. */
export const KeyboardFocus: Story = {
  name: "Keyboard focus",
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole("button", { name: "Copy link" });
    await userEvent.tab();
    await expect(trigger).toHaveFocus();
    await expect(canvas.getByRole("tooltip")).toHaveTextContent(COPY_LINK);

    await userEvent.keyboard("{Escape}");
    await expectHidden(trigger);
    await expect(trigger).toHaveFocus();

    // Shows again on the next focus, and hides when focus moves on.
    await userEvent.tab({ shift: true });
    await userEvent.tab();
    await expect(trigger).toHaveAttribute("data-state", "open");
    await expect(canvas.getByRole("tooltip")).toBeInTheDocument();
    await userEvent.tab();
    await expectHidden(trigger);

    // Focused again, so the screenshot shows a tooltip shown by keyboard focus.
    await userEvent.tab({ shift: true });
    await expect(trigger).toHaveAttribute("data-state", "open");
  },
};

/** Open, so axe checks the tooltip's colors in light mode. */
export const Open: Story = {
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole("button", { name: "Copy link" });
    await userEvent.hover(trigger);
    await waitFor(() => expect(canvas.getByRole("tooltip")).toBeInTheDocument());
    await expectPlaced(trigger, "top", "center");
  },
};

/** Dark mode swaps the semantic tokens, so contrast is checked here too, with the tooltip open. */
export const OpenDark: Story = {
  name: "Open (dark)",
  globals: { theme: "dark" },
  play: async (context) => {
    // Guards the contrast check: if the theme global stops applying, this story would silently test light mode.
    await expect(document.documentElement).toHaveAttribute("data-theme", "dark");
    await Open.play!(context);
  },
};

/**
 * Only one tooltip shows at a time, and once one has shown, the next opens without the delay, so
 * moving along a toolbar reads each in turn.
 */
export const Toolbar: Story = {
  render: (args) => (
    <div style={row} role="toolbar" aria-label="Project">
      <Tooltip {...args}>
        <TooltipTrigger variant="ghost" size="icon" aria-label="Edit" startIcon={<PencilIcon />} />
        <TooltipContent>Rename or describe the project</TooltipContent>
      </Tooltip>
      <Tooltip {...args}>
        <TooltipTrigger variant="ghost" size="icon" aria-label="Duplicate" startIcon={<CopyIcon />} />
        <TooltipContent>Copy it, pages and all</TooltipContent>
      </Tooltip>
      <Tooltip {...args}>
        <TooltipTrigger variant="ghost" size="icon" aria-label="Archive" startIcon={<ArchiveIcon />} />
        <TooltipContent>Hide it from the project list</TooltipContent>
      </Tooltip>
    </div>
  ),
  play: async ({ canvas }) => {
    await userEvent.hover(canvas.getByRole("button", { name: "Edit" }));
    await waitFor(() => expect(canvas.getByRole("tooltip")).toHaveTextContent("Rename or describe the project"));

    const edit = canvas.getByRole("button", { name: "Edit" });
    const duplicate = canvas.getByRole("button", { name: "Duplicate" });
    await userEvent.hover(duplicate);
    // Well inside the 300ms delay: the second tooltip skipped it, and the first closed.
    await pause(50);
    await expect(duplicate).toHaveAttribute("data-state", "open");
    await expectHidden(edit);
    await expect(canvas.getByRole("tooltip")).toHaveTextContent("Copy it, pages and all");
  },
};

/**
 * `delay={0}` shows the tooltip as soon as the pointer reaches the trigger. It suits a trigger that
 * stands alone, which a pointer is unlikely to cross on its way somewhere else.
 */
export const NoDelay: Story = {
  name: "No delay",
  args: { delay: 0 },
  render: (args) => (
    <div style={row}>
      <span>Team plan</span>
      <Tooltip {...args}>
        <TooltipTrigger variant="ghost" size="icon" aria-label="About the Team plan" startIcon={<InfoIcon />} />
        <TooltipContent>Up to 10 editors, $8 for each extra</TooltipContent>
      </Tooltip>
    </div>
  ),
  play: async ({ canvas }) => {
    // Waits out the cool-down from any earlier story, which would also skip the delay.
    await pause(400);
    const trigger = canvas.getByRole("button", { name: "About the Team plan" });
    await userEvent.hover(trigger);
    await pause(50);
    await expect(trigger).toHaveAttribute("data-state", "open");
    await expect(canvas.getByRole("tooltip")).toHaveTextContent("Up to 10 editors");
  },
};

// The tooltip renders in the top layer, away from the trigger in layout terms, so check that it
// actually shows beside the trigger. It's anchored to the Tooltip wrapper, which has the trigger's
// box without its hover lift, so measure that, once the motion has settled: tests run with reduced
// motion, but the Storybook UI doesn't.
async function expectPlaced(trigger: Element, side: "top" | "bottom" | "left" | "right", align: "start" | "center" | "end") {
  await waitFor(async () => {
    const t = trigger.closest("[data-slot=tooltip]")!.getBoundingClientRect();
    const id = trigger.getAttribute("aria-describedby")!.split(" ").at(-1)!;
    const p = document.getElementById(id)!.getBoundingClientRect();
    const gap = { bottom: p.top - t.bottom, top: t.top - p.bottom, left: t.left - p.right, right: p.left - t.right }[side];
    await expect(gap).toBeGreaterThan(0);
    await expect(gap).toBeLessThan(16);
    const offset =
      side === "top" || side === "bottom"
        ? { start: p.left - t.left, center: (p.left + p.right - t.left - t.right) / 2, end: p.right - t.right }
        : { start: p.top - t.top, center: (p.top + p.bottom - t.top - t.bottom) / 2, end: p.bottom - t.bottom };
    await expect(Math.abs(offset[align])).toBeLessThan(1);
  });
}

/**
 * `side` picks which side of the trigger the tooltip shows on: above by default. It flips to the
 * opposite side when there's no room. These are held open with `open`.
 */
export const Sides: Story = {
  render: (args) => (
    <div style={column}>
      {(["top", "left", "right", "bottom"] as const).map((side) => (
        <Tooltip key={side} {...args} open>
          <TooltipTrigger variant="secondary">{side[0]!.toUpperCase() + side.slice(1)}</TooltipTrigger>
          <TooltipContent side={side}>Shows {side === "top" ? "above" : side === "bottom" ? "below" : `on the ${side}`}</TooltipContent>
        </Tooltip>
      ))}
    </div>
  ),
  play: async ({ canvas }) => {
    for (const side of ["top", "left", "right", "bottom"] as const) {
      await expectPlaced(canvas.getByRole("button", { name: side[0]!.toUpperCase() + side.slice(1) }), side, "center");
    }
  },
};

/** `align` lines the tooltip up with the trigger's start edge, its center (the default), or its end edge. */
export const Alignments: Story = {
  render: (args) => (
    <div style={column}>
      {(["start", "center", "end"] as const).map((align) => (
        <Tooltip key={align} {...args} open>
          <TooltipTrigger variant="secondary">{align[0]!.toUpperCase() + align.slice(1)}</TooltipTrigger>
          <TooltipContent align={align}>Lines up with the {align === "center" ? "center" : `${align} edge`}</TooltipContent>
        </Tooltip>
      ))}
    </div>
  ),
  play: async ({ canvas }) => {
    for (const align of ["start", "center", "end"] as const) {
      await expectPlaced(canvas.getByRole("button", { name: align[0]!.toUpperCase() + align.slice(1) }), "top", align);
    }
  },
};

/**
 * With `asChild`, the trigger's one child becomes the trigger, like a link in a sentence. It must
 * be focusable, so keyboard users can reach the tooltip too.
 */
export const AsChild: Story = {
  name: "As child",
  render: (args) => (
    <p style={{ paddingTop: 72, margin: 0 }}>
      Exports follow the{" "}
      <Tooltip {...args}>
        <TooltipTrigger asChild>
          <a href="#retention">retention policy</a>
        </TooltipTrigger>
        <TooltipContent>Kept for 30 days, then deleted</TooltipContent>
      </Tooltip>{" "}
      set by your workspace.
    </p>
  ),
  play: async ({ canvas }) => {
    const link = canvas.getByRole("link", { name: "retention policy" });
    await expect(link).toHaveAccessibleDescription("Kept for 30 days, then deleted");
    await userEvent.hover(link);
    await waitFor(() => expect(canvas.getByRole("tooltip")).toBeInTheDocument());
    await expectPlaced(link, "top", "center");
  },
};

/** Escape hides a tooltip inside a Modal without closing the modal; the next Escape closes it. */
export const InModal: Story = {
  name: "In a modal",
  render: (args) => (
    <Modal>
      <ModalTrigger>Share project</ModalTrigger>
      <ModalContent>
        <ModalTitle>Share project</ModalTitle>
        <ModalDescription>Anyone with the link can view the project.</ModalDescription>
        <div>{copyLinkTooltip(args)}</div>
      </ModalContent>
    </Modal>
  ),
  play: async ({ canvas, canvasElement }) => {
    const modalTrigger = canvas.getByRole("button", { name: "Share project" });
    const dialog = canvasElement.querySelector("dialog")!;
    await userEvent.click(modalTrigger);
    const trigger = canvas.getByRole("button", { name: "Copy link" });
    await userEvent.hover(trigger);
    await waitFor(() => expect(canvas.getByRole("tooltip")).toBeInTheDocument());

    await userEvent.keyboard("{Escape}");
    await expectHidden(trigger);
    await expect(dialog).toHaveAttribute("open");

    await userEvent.keyboard("{Escape}");
    await expect(dialog).not.toHaveAttribute("open");

    // Reopened, so the screenshot shows the tooltip over the modal.
    await userEvent.unhover(trigger);
    await userEvent.click(modalTrigger);
    await userEvent.hover(trigger);
    await waitFor(() => expect(canvas.getByRole("tooltip")).toBeInTheDocument());
    await expectPlaced(trigger, "top", "center");
  },
};
