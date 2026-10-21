import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent } from "storybook/test";
import type { ButtonProps } from "../Button/Button.types";
import { DropdownMenu } from "./DropdownMenu";
import type { DropdownMenuProps } from "./DropdownMenu.types";
import { DropdownMenuContent } from "./parts/DropdownMenuContent";
import type { DropdownMenuContentProps } from "./parts/DropdownMenuContent.types";
import { DropdownMenuItem } from "./parts/DropdownMenuItem";
import { DropdownMenuSeparator } from "./parts/DropdownMenuSeparator";
import { DropdownMenuTrigger } from "./parts/DropdownMenuTrigger";

// Stories are excluded from Tailwind's source scan, so layout here uses inline styles.
const row = { display: "flex", flexWrap: "wrap", alignItems: "center", gap: 16 } as const;

function Icon({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}

const PencilIcon = () => <Icon d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16v4zM13.5 6.5l4 4" />;
const CopyIcon = () => <Icon d="M9 9h11v11H9zM5 15H4V4h11v1" />;
const ArchiveIcon = () => <Icon d="M3 4h18v4H3zM5 8v12h14V8M10 12h4" />;
const TrashIcon = () => <Icon d="M4 7h16M10 11v6M14 11v6M5 7l1 13h12l1-13M9 7V4h6v3" />;

type DropdownMenuStoryArgs = DropdownMenuProps & {
  label?: string;
  trigger?: Omit<ButtonProps, "endIcon" | "iconAnimation">;
  align?: DropdownMenuContentProps["align"];
  onAction: (action: string) => void;
};

function ProjectMenu({ label = "Options", trigger, align, onAction, ...args }: DropdownMenuStoryArgs) {
  return (
    <DropdownMenu {...args}>
      <DropdownMenuTrigger {...trigger}>{label}</DropdownMenuTrigger>
      <DropdownMenuContent align={align}>
        <DropdownMenuItem onClick={() => onAction("edit")}>
          <PencilIcon />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onAction("duplicate")}>
          <CopyIcon />
          Duplicate
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onAction("archive")}>
          <ArchiveIcon />
          Archive
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="danger" onClick={() => onAction("delete")}>
          <TrashIcon />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const meta = {
  title: "Components/DropdownMenu",
  component: DropdownMenu,
  tags: ["autodocs"],
  args: { onOpenChange: fn(), onAction: fn() },
  argTypes: {
    open: { control: false },
    defaultOpen: { control: false },
    label: { table: { disable: true } },
    trigger: { table: { disable: true } },
    align: { table: { disable: true } },
    onAction: { table: { disable: true } },
  },
  render: (args) => <ProjectMenu {...args} />,
} satisfies Meta<DropdownMenuStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ args, canvas, canvasElement, step }) => {
    const trigger = canvas.getByRole("button", { name: "Options" });
    const item = (name: string) => canvas.getByRole("menuitem", { name });

    await step("is a menu button that starts closed, and never submits a surrounding form", async () => {
      await expect(trigger).toHaveAttribute("type", "button");
      await expect(trigger).toHaveAttribute("aria-haspopup", "menu");
      await expect(trigger).toHaveAttribute("aria-expanded", "false");
      await expect(canvas.queryByRole("menu")).not.toBeInTheDocument();
    });

    await step("opens on click, labelled by the trigger, with the first item focused", async () => {
      await userEvent.click(trigger);
      await expect(trigger).toHaveAttribute("aria-expanded", "true");
      await expect(canvas.getByRole("menu", { name: "Options" })).toBeInTheDocument();
      await expect(item("Edit")).toHaveFocus();
      await expect(args.onOpenChange).toHaveBeenLastCalledWith(true);
    });

    await step("moves through items with the arrow keys, Home and End, wrapping at the ends", async () => {
      await userEvent.keyboard("{ArrowDown}");
      await expect(item("Duplicate")).toHaveFocus();
      await userEvent.keyboard("{End}");
      await expect(item("Delete")).toHaveFocus();
      await userEvent.keyboard("{ArrowDown}");
      await expect(item("Edit")).toHaveFocus();
      await userEvent.keyboard("{ArrowUp}");
      await expect(item("Delete")).toHaveFocus();
      await userEvent.keyboard("{Home}");
      await expect(item("Edit")).toHaveFocus();
    });

    await step("jumps to the next item starting with a typed letter", async () => {
      await userEvent.keyboard("d");
      await expect(item("Duplicate")).toHaveFocus();
      await userEvent.keyboard("d");
      await expect(item("Delete")).toHaveFocus();
    });

    await step("closes on Escape and returns focus to the trigger", async () => {
      await userEvent.keyboard("{Escape}");
      await expect(trigger).toHaveAttribute("aria-expanded", "false");
      await expect(trigger).toHaveFocus();
      await expect(args.onOpenChange).toHaveBeenLastCalledWith(false);
    });

    await step("opens onto the last item with ArrowUp, and the first with ArrowDown", async () => {
      await userEvent.keyboard("{ArrowUp}");
      await expect(item("Delete")).toHaveFocus();
      await userEvent.keyboard("{Escape}");
      await userEvent.keyboard("{ArrowDown}");
      await expect(item("Edit")).toHaveFocus();
    });

    await step("runs an item with Enter, then closes and returns focus to the trigger", async () => {
      await userEvent.keyboard("{ArrowDown}{Enter}");
      await expect(args.onAction).toHaveBeenCalledTimes(1);
      await expect(args.onAction).toHaveBeenCalledWith("duplicate");
      await expect(trigger).toHaveAttribute("aria-expanded", "false");
      await expect(trigger).toHaveFocus();
    });

    await step("runs an item on click", async () => {
      await userEvent.click(trigger);
      await userEvent.click(item("Archive"));
      await expect(args.onAction).toHaveBeenLastCalledWith("archive");
      await expect(trigger).toHaveAttribute("aria-expanded", "false");
    });

    await step("toggles closed when the trigger is clicked again", async () => {
      await userEvent.click(trigger);
      await userEvent.click(trigger);
      await expect(trigger).toHaveAttribute("aria-expanded", "false");
    });

    await step("closes on a click outside, without running an item", async () => {
      await userEvent.click(trigger);
      await userEvent.click(canvasElement);
      await expect(trigger).toHaveAttribute("aria-expanded", "false");
      await expect(args.onAction).toHaveBeenCalledTimes(2);
    });

    await step("closes when Tab moves focus out", async () => {
      await userEvent.click(trigger);
      await userEvent.tab();
      await expect(trigger).toHaveAttribute("aria-expanded", "false");
    });
  },
};

/** The trigger is a Button, so it takes every Button variant. */
export const Variants: Story = {
  render: (args) => (
    <div style={row}>
      {(["primary", "secondary", "neutral", "inverse", "danger", "ghost"] as const).map((variant) => (
        <ProjectMenu key={variant} {...args} label={variant[0]!.toUpperCase() + variant.slice(1)} trigger={{ variant }} />
      ))}
    </div>
  ),
};

/** Dark mode swaps the semantic tokens, so contrast is checked here too, with a menu open. */
export const VariantsDark: Story = {
  name: "Variants (dark)",
  globals: { theme: "dark" },
  render: Variants.render,
  play: async ({ canvas }) => {
    // Guards the contrast check: if the theme global stops applying, this story would silently test light mode.
    await expect(document.documentElement).toHaveAttribute("data-theme", "dark");
    // Opens a menu so axe checks its items too.
    await userEvent.click(canvas.getByRole("button", { name: "Secondary" }));
    await expect(canvas.getByRole("menu", { name: "Secondary" })).toBeInTheDocument();
  },
};

export const Sizes: Story = {
  render: (args) => (
    <div style={row}>
      <ProjectMenu {...args} label="Small" trigger={{ size: "sm" }} />
      <ProjectMenu {...args} label="Medium" trigger={{ size: "md" }} />
      <ProjectMenu {...args} label="Large" trigger={{ size: "lg" }} />
    </div>
  ),
};

// The menu renders in the top layer, away from the trigger in layout terms, so check that it
// actually opens under the trigger, lined up with the given edge. It's anchored to the
// DropdownMenu wrapper, which has the trigger's box without the open trigger's 2px lift, so
// measure that: the trigger's own box moves while the lift animates.
async function expectAnchored(trigger: Element, menu: Element, edge: "left" | "right") {
  const t = trigger.closest("[data-slot=dropdown-menu]")!.getBoundingClientRect();
  const m = menu.getBoundingClientRect();
  await expect(m.top).toBeGreaterThan(t.bottom);
  await expect(m.top - t.bottom).toBeLessThan(24);
  await expect(Math.abs(m[edge] - t[edge])).toBeLessThan(1);
}

/** Open, so axe checks the menu's items in light mode. */
export const Open: Story = {
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole("button", { name: "Options" });
    await userEvent.click(trigger);
    await expectAnchored(trigger, canvas.getByRole("menu", { name: "Options" }), "left");
  },
};

/**
 * `data-theme="dark"` works on any element, not just `<html>`, so one section of a light page can
 * be dark. Open, so axe checks the highlighted item's colors resolve against the dark theme too.
 */
export const DarkSection: Story = {
  name: "Dark section",
  render: (args) => (
    <div data-theme="dark" style={{ padding: 16, background: "var(--kl-color-page)" }}>
      <ProjectMenu {...args} />
    </div>
  ),
  play: Open.play,
};

/** `align="end"` lines the menu up with the trigger's end edge, for triggers at the end of a row. */
export const AlignEnd: Story = {
  args: { align: "end" },
  render: (args) => (
    <div style={{ display: "flex", justifyContent: "flex-end" }}>
      <ProjectMenu {...args} />
    </div>
  ),
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole("button", { name: "Options" });
    await userEvent.click(trigger);
    await expectAnchored(trigger, canvas.getByRole("menu", { name: "Options" }), "right");
  },
};

/** Disabled items stay focusable, so they can be discovered, but do nothing. */
export const DisabledItem: Story = {
  render: ({ onAction, ...args }) => (
    <DropdownMenu {...args}>
      <DropdownMenuTrigger>Options</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => onAction("edit")}>Edit</DropdownMenuItem>
        <DropdownMenuItem disabled onClick={() => onAction("publish")}>
          Publish
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Options" }));
    const publish = canvas.getByRole("menuitem", { name: "Publish" });
    await expect(publish).toHaveAttribute("aria-disabled", "true");

    await userEvent.keyboard("{ArrowDown}");
    await expect(publish).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    await userEvent.click(publish);
    await expect(args.onAction).not.toHaveBeenCalled();
    await expect(canvas.getByRole("menu")).toBeInTheDocument();
  },
};

/** Calling `preventDefault()` in an item's `onClick` keeps the menu open. */
export const KeepOpen: Story = {
  render: ({ onAction, ...args }) => (
    <DropdownMenu {...args}>
      <DropdownMenuTrigger variant="secondary">View</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          onClick={(event) => {
            event.preventDefault();
            onAction("zoom in");
          }}
        >
          Zoom in
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={(event) => {
            event.preventDefault();
            onAction("zoom out");
          }}
        >
          Zoom out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "View" }));
    await userEvent.keyboard("{Enter}{Enter}");
    await expect(args.onAction).toHaveBeenCalledTimes(2);
    await expect(canvas.getByRole("menuitem", { name: "Zoom in" })).toHaveFocus();
  },
};

export const DisabledTrigger: Story = {
  args: { trigger: { disabled: true } },
  play: async ({ args, canvas }) => {
    const trigger = canvas.getByRole("button", { name: "Options" });
    await expect(trigger).toBeDisabled();
    await userEvent.click(trigger);
    await expect(args.onOpenChange).not.toHaveBeenCalled();
  },
};
