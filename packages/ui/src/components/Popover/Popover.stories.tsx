import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, waitFor } from "storybook/test";
import { Button } from "@/components/Button/Button";
import { Field } from "@/components/Field/Field";
import { FieldLabel } from "@/components/Field/parts/FieldLabel";
import { Input } from "@/components/Input/Input";
import { Modal } from "@/components/Modal/Modal";
import { ModalContent } from "@/components/Modal/parts/ModalContent";
import { ModalDescription } from "@/components/Modal/parts/ModalDescription";
import { ModalTitle } from "@/components/Modal/parts/ModalTitle";
import { ModalTrigger } from "@/components/Modal/parts/ModalTrigger";
import { Popover } from "./Popover";
import type { PopoverProps } from "./Popover.types";
import { PopoverClose } from "./parts/PopoverClose";
import { PopoverContent } from "./parts/PopoverContent";
import type { PopoverContentProps } from "./parts/PopoverContent.types";
import { PopoverTrigger } from "./parts/PopoverTrigger";

// Stories are excluded from Tailwind's source scan, so layout here uses inline styles.
const row = { display: "flex", flexWrap: "wrap", alignItems: "center", gap: 16 } as const;
const footer = { display: "flex", justifyContent: "flex-end", gap: 8 } as const;
// Room around each trigger for its popover, which is held open.
const column = { display: "flex", flexDirection: "column", alignItems: "center", gap: 112, padding: "80px 0" } as const;

function Icon({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}

const PencilIcon = () => <Icon d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16v4zM13.5 6.5l4 4" />;
const InfoIcon = () => <Icon d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 11v5M12 7.5v.5" />;

type PopoverStoryArgs = PopoverProps & {
  side?: PopoverContentProps["side"];
  align?: PopoverContentProps["align"];
  onAction: (action: string) => void;
};

const tones = ["success", "warning", "danger", "info"] as const;
type Tone = (typeof tones)[number];

const toneCopy: Record<Tone, { trigger: string; body: string }> = {
  success: { trigger: "Publish status", body: "Published. Your changes are live on the docs site." },
  warning: { trigger: "Storage", body: "You've used 90% of your storage. Old drafts are removed at 100%." },
  danger: { trigger: "Last build", body: "The last build failed. Check its logs for the error." },
  info: { trigger: "Sharing", body: "Anyone with the link can view this project." },
};

function tonePopover(tone: Tone, { side, align, onAction, ...args }: PopoverStoryArgs) {
  return (
    <Popover key={tone} {...args}>
      <PopoverTrigger variant="secondary">{toneCopy[tone].trigger}</PopoverTrigger>
      <PopoverContent tone={tone} side={side} align={align}>
        {toneCopy[tone].body}
      </PopoverContent>
    </Popover>
  );
}

// Called as a function, not rendered as <RenamePopover>, so a story returns the Popover itself and
// the docs' "Show code" snippet shows how it's composed rather than a helper component.
function renamePopover({ side, align, onAction, ...args }: PopoverStoryArgs) {
  return (
    <Popover {...args}>
      <PopoverTrigger variant="secondary" startIcon={<PencilIcon />}>
        Rename
      </PopoverTrigger>
      <PopoverContent side={side} align={align}>
        <Field>
          <FieldLabel>Project name</FieldLabel>
          <Input defaultValue="Keyline docs" />
        </Field>
        <div style={footer}>
          <PopoverClose size="sm">Cancel</PopoverClose>
          <PopoverClose size="sm" variant="primary" onClick={() => onAction("save")}>
            Save
          </PopoverClose>
        </div>
      </PopoverContent>
    </Popover>
  );
}

const meta = {
  title: "Overlays/Popover",
  component: Popover,
  tags: ["autodocs"],
  // The component's page in the Figma file, for the toolbar's Figma link. Empty hides the link.
  parameters: {
    design: { type: "figma", url: "" },
  },
  args: { onOpenChange: fn(), onAction: fn() },
  argTypes: {
    open: { control: false },
    defaultOpen: { control: false },
    side: { table: { disable: true } },
    align: { table: { disable: true } },
    onAction: { table: { disable: true } },
  },
  render: (args) => renamePopover(args),
} satisfies Meta<PopoverStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ args, canvas, canvasElement, step }) => {
    const trigger = canvas.getByRole("button", { name: "Rename" });
    const name = () => canvas.getByRole("textbox", { name: "Project name" });

    await step("is a dialog button that starts closed, and never submits a surrounding form", async () => {
      await expect(trigger).toHaveAttribute("type", "button");
      await expect(trigger).toHaveAttribute("aria-haspopup", "dialog");
      await expect(trigger).toHaveAttribute("aria-expanded", "false");
      await expect(canvas.queryByRole("dialog")).not.toBeInTheDocument();
    });

    await step("opens on click, named by the trigger, with focus on its first field", async () => {
      await userEvent.click(trigger);
      await expect(trigger).toHaveAttribute("aria-expanded", "true");
      await expect(canvas.getByRole("dialog", { name: "Rename" })).toBeInTheDocument();
      await expect(name()).toHaveFocus();
      await expect(args.onOpenChange).toHaveBeenLastCalledWith(true);
    });

    await step("keeps Tab moving through its content, and Shift+Tab back to the trigger, while open", async () => {
      await userEvent.tab();
      await expect(canvas.getByRole("button", { name: "Cancel" })).toHaveFocus();
      await userEvent.tab({ shift: true });
      await userEvent.tab({ shift: true });
      await expect(trigger).toHaveFocus();
      await expect(trigger).toHaveAttribute("aria-expanded", "true");
    });

    await step("closes on Escape and returns focus to the trigger", async () => {
      await userEvent.click(name());
      await userEvent.keyboard("{Escape}");
      await expect(trigger).toHaveAttribute("aria-expanded", "false");
      await expect(trigger).toHaveFocus();
      await expect(args.onOpenChange).toHaveBeenLastCalledWith(false);
    });

    await step("opens from the keyboard", async () => {
      await userEvent.keyboard("{Enter}");
      await expect(name()).toHaveFocus();
    });

    await step("closes from a PopoverClose, after its onClick, returning focus to the trigger", async () => {
      await userEvent.click(canvas.getByRole("button", { name: "Save" }));
      await expect(args.onAction).toHaveBeenCalledWith("save");
      await expect(trigger).toHaveAttribute("aria-expanded", "false");
      await expect(trigger).toHaveFocus();
    });

    await step("toggles closed when the trigger is clicked again", async () => {
      await userEvent.click(trigger);
      await userEvent.click(trigger);
      await expect(trigger).toHaveAttribute("aria-expanded", "false");
    });

    await step("stays open on a click inside, and closes on a click outside", async () => {
      await userEvent.click(trigger);
      await userEvent.click(canvas.getByRole("dialog"));
      await expect(trigger).toHaveAttribute("aria-expanded", "true");
      await userEvent.click(canvasElement);
      await expect(trigger).toHaveAttribute("aria-expanded", "false");
      await expect(args.onAction).toHaveBeenCalledTimes(1);
    });
  },
};

// The popover renders in the top layer, away from the trigger in layout terms, so check that it
// actually opens beside the trigger. It's anchored to the Popover wrapper, which has the trigger's
// box without its hover lift, so measure that.
//
// Measured once the motion has settled: the popover scales and slides in, and an enclosing Modal
// bounces open, which anchor positioning ignores until it ends. Tests run with reduced motion, but
// the Storybook UI doesn't.
async function expectPlaced(trigger: Element, side: "top" | "bottom" | "left" | "right", align = "start") {
  await waitFor(async () => {
    const t = trigger.closest("[data-slot=popover]")!.getBoundingClientRect();
    const p = document.getElementById(trigger.getAttribute("aria-controls")!)!.getBoundingClientRect();
    const gap = { bottom: p.top - t.bottom, top: t.top - p.bottom, left: t.left - p.right, right: p.left - t.right }[side];
    await expect(gap).toBeGreaterThan(0);
    await expect(gap).toBeLessThan(24);
    if (side === "top" || side === "bottom") {
      const offset = { start: p.left - t.left, center: (p.left + p.right - t.left - t.right) / 2, end: p.right - t.right };
      await expect(Math.abs(offset[align as keyof typeof offset])).toBeLessThan(1);
    }
  });
}

/** Open, so axe checks its content in light mode. */
export const Open: Story = {
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole("button", { name: "Rename" });
    await userEvent.click(trigger);
    await expectPlaced(trigger, "bottom");
  },
};

/** Dark mode swaps the semantic tokens, so contrast is checked here too, with the popover open. */
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
 * `side` picks which side of the trigger the popover opens on. It flips to the opposite side when
 * there's no room. These are held open with `open`.
 */
export const Sides: Story = {
  render: ({ onAction, ...args }) => (
    <div style={column}>
      {(["top", "left", "right", "bottom"] as const).map((side) => (
        <Popover key={side} {...args} open>
          <PopoverTrigger variant="secondary">{side[0]!.toUpperCase() + side.slice(1)}</PopoverTrigger>
          <PopoverContent side={side} align="center">
            Opens {side === "top" ? "above" : side === "bottom" ? "below" : `on the ${side}`}.
          </PopoverContent>
        </Popover>
      ))}
    </div>
  ),
  play: async ({ canvas }) => {
    for (const side of ["top", "left", "right", "bottom"] as const) {
      await expectPlaced(canvas.getByRole("button", { name: side[0]!.toUpperCase() + side.slice(1) }), side, "center");
    }
  },
};

/** `align` lines the popover up with the trigger's start edge, its center, or its end edge. */
export const Alignments: Story = {
  render: ({ onAction, ...args }) => (
    <div style={column}>
      {(["start", "center", "end"] as const).map((align) => (
        <Popover key={align} {...args} open>
          <PopoverTrigger variant="secondary">{align[0]!.toUpperCase() + align.slice(1)}</PopoverTrigger>
          <PopoverContent align={align}>Lines up with the trigger's {align === "center" ? "center" : `${align} edge`}.</PopoverContent>
        </Popover>
      ))}
    </div>
  ),
  play: async ({ canvas }) => {
    for (const align of ["start", "center", "end"] as const) {
      await expectPlaced(canvas.getByRole("button", { name: align[0]!.toUpperCase() + align.slice(1) }), "bottom", align);
    }
  },
};

/**
 * `tone` takes Toast's status tones as a colored outline, staying on the surface, with the tone's
 * icon before the content. Pass `icon` to swap the icon, or `null` to leave it out. These are held
 * open with `open`.
 */
export const Tones: Story = {
  render: (args) => <div style={column}>{tones.map((tone) => tonePopover(tone, { ...args, open: true }))}</div>,
  play: async ({ canvas }) => {
    for (const tone of tones) {
      const dialog = canvas.getByRole("dialog", { name: toneCopy[tone].trigger });
      // The icon is decoration: the text has to carry the tone's meaning.
      await expect(dialog.querySelector("[data-slot=popover-icon]")).toHaveAttribute("aria-hidden", "true");
    }
  },
};

// One story per tone in dark mode, where the outline switches to the tone's lighter text color,
// so axe checks each tone's icon and text against the dark surface.
function toneDark(tone: Tone): Story {
  return {
    name: `${tone[0]!.toUpperCase() + tone.slice(1)} (dark)`,
    globals: { theme: "dark" },
    render: (args) => tonePopover(tone, args),
    play: async ({ canvas }) => {
      // Guards the contrast check: if the theme global stops applying, this story would silently test light mode.
      await expect(document.documentElement).toHaveAttribute("data-theme", "dark");
      await userEvent.click(canvas.getByRole("button", { name: toneCopy[tone].trigger }));
      const dialog = canvas.getByRole("dialog", { name: toneCopy[tone].trigger });
      await expect(dialog).toHaveTextContent(toneCopy[tone].body);
      await expect(dialog.querySelector("[data-slot=popover-icon]")).toBeInTheDocument();
    },
  };
}

export const SuccessDark = toneDark("success");
export const WarningDark = toneDark("warning");
export const DangerDark = toneDark("danger");
export const InfoDark = toneDark("info");

/** `icon={null}` leaves out the tone's icon, keeping the colored outline. */
export const ToneWithoutIcon: Story = {
  name: "Tone without icon",
  render: ({ onAction, ...args }) => (
    <Popover {...args}>
      <PopoverTrigger variant="secondary">Last build</PopoverTrigger>
      <PopoverContent tone="danger" icon={null}>
        {toneCopy.danger.body}
      </PopoverContent>
    </Popover>
  ),
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Last build" }));
    const dialog = canvas.getByRole("dialog", { name: "Last build" });
    await expect(dialog.querySelector("[data-slot=popover-icon]")).not.toBeInTheDocument();
  },
};

/**
 * With nothing focusable inside, opening focuses the popover itself, so screen readers still move
 * into it and Escape still closes it. An icon-only trigger's `aria-label` names the popover too.
 */
export const Informational: Story = {
  render: ({ onAction, ...args }) => (
    <div style={row}>
      <span>Team plan</span>
      <Popover {...args}>
        <PopoverTrigger variant="ghost" size="icon" aria-label="About the Team plan" startIcon={<InfoIcon />} />
        <PopoverContent>
          Includes up to 10 editors, unlimited viewers, and a shared component library. Extra editors are $8 a month each.
        </PopoverContent>
      </Popover>
    </div>
  ),
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole("button", { name: "About the Team plan" });
    await userEvent.click(trigger);
    await expect(canvas.getByRole("dialog", { name: "About the Team plan" })).toHaveFocus();
    await userEvent.keyboard("{Escape}");
    await expect(trigger).toHaveFocus();
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    // Reopened, so axe and the screenshot cover a text-only popover.
    await userEvent.click(trigger);
  },
};

/** Tabbing past the end of the popover moves on to the rest of the page, and closes it. */
export const FocusLeaving: Story = {
  name: "Focus leaving",
  render: (args) => (
    <div style={row}>
      {renamePopover(args)}
      <Button variant="ghost">Next</Button>
    </div>
  ),
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole("button", { name: "Rename" });
    await userEvent.click(trigger);
    await userEvent.tab();
    await userEvent.tab();
    await expect(canvas.getByRole("button", { name: "Save" })).toHaveFocus();
    await userEvent.tab();
    await expect(canvas.getByRole("button", { name: "Next" })).toHaveFocus();
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
  },
};

/** Escape in a popover inside a Modal closes only the popover; the next Escape closes the modal. */
export const InModal: Story = {
  name: "In a modal",
  render: (args) => (
    <Modal>
      <ModalTrigger>Project settings</ModalTrigger>
      <ModalContent>
        <ModalTitle>Project settings</ModalTitle>
        <ModalDescription>Rename the project, or change who can see it.</ModalDescription>
        <div>{renamePopover(args)}</div>
      </ModalContent>
    </Modal>
  ),
  play: async ({ canvas, canvasElement }) => {
    const modalTrigger = canvas.getByRole("button", { name: "Project settings" });
    const dialog = canvasElement.querySelector("dialog")!;
    await userEvent.click(modalTrigger);
    const trigger = canvas.getByRole("button", { name: "Rename" });
    await userEvent.click(trigger);
    await expect(canvas.getByRole("textbox", { name: "Project name" })).toHaveFocus();

    await userEvent.keyboard("{Escape}");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await expect(trigger).toHaveFocus();
    await expect(dialog).toHaveAttribute("open");

    await userEvent.keyboard("{Escape}");
    await expect(dialog).not.toHaveAttribute("open");

    // Reopened, so the screenshot shows the popover over the modal.
    await userEvent.click(modalTrigger);
    await userEvent.click(trigger);
    await expectPlaced(trigger, "bottom");
  },
};

export const DisabledTrigger: Story = {
  render: ({ onAction, ...args }) => (
    <Popover {...args}>
      <PopoverTrigger disabled>Rename</PopoverTrigger>
      <PopoverContent>Never shown.</PopoverContent>
    </Popover>
  ),
  play: async ({ args, canvas }) => {
    const trigger = canvas.getByRole("button", { name: "Rename" });
    await expect(trigger).toBeDisabled();
    await userEvent.click(trigger);
    await expect(args.onOpenChange).not.toHaveBeenCalled();
  },
};
