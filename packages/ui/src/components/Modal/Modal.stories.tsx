import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, fn, userEvent, waitFor } from "storybook/test";
import { Button } from "@/components/Button/Button";
import { Modal } from "./Modal";
import type { ModalProps } from "./Modal.types";
import { ModalClose } from "./parts/ModalClose";
import { ModalContent } from "./parts/ModalContent";
import type { ModalContentProps } from "./parts/ModalContent.types";
import { ModalDescription } from "./parts/ModalDescription";
import { ModalFooter } from "./parts/ModalFooter";
import { ModalTitle } from "./parts/ModalTitle";
import { ModalTrigger } from "./parts/ModalTrigger";

// Stories are excluded from Tailwind's source scan, so layout here uses inline styles.
const field = { display: "flex", flexDirection: "column", gap: 6, fontWeight: 600 } as const;
const input = {
  font: "inherit",
  fontWeight: 400,
  padding: "8px 12px",
  border: "2px solid var(--kl-color-line)",
  borderRadius: "var(--kl-radius-md)",
  background: "var(--kl-color-surface)",
  color: "var(--kl-color-fg-1)",
} as const;

type ModalStoryArgs = ModalProps & {
  size?: ModalContentProps["size"];
  noCloseButton?: ModalContentProps["noCloseButton"];
  onAction: (action: string) => void;
};

// Called as functions, not rendered as <PublishModal>, so a story returns the Modal itself and the
// docs' "Show code" snippet shows how it's composed rather than a helper component.
function publishModal({ size, noCloseButton, onAction, ...args }: ModalStoryArgs) {
  return (
    <Modal {...args}>
      <ModalTrigger>Publish changes</ModalTrigger>
      <ModalContent size={size} noCloseButton={noCloseButton}>
        <ModalTitle>Publish changes?</ModalTitle>
        <ModalDescription>
          Your edits to 3 pages go live on the Keyline docs site for everyone. You can unpublish them later.
        </ModalDescription>
        <ModalFooter>
          <ModalClose>Cancel</ModalClose>
          <ModalClose variant="primary" onClick={() => onAction("publish")}>
            Publish
          </ModalClose>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

function discardDraftModal({ size, onAction, ...args }: ModalStoryArgs) {
  return (
    <Modal {...args}>
      <ModalTrigger variant="secondary">Discard draft</ModalTrigger>
      <ModalContent size={size}>
        <ModalTitle>Discard draft?</ModalTitle>
        <ModalDescription>Your unpublished edits to 3 pages will be lost. You can't undo this.</ModalDescription>
        <ModalFooter>
          <ModalClose>Keep editing</ModalClose>
          <ModalClose variant="danger" onClick={() => onAction("discard")}>
            Discard
          </ModalClose>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

// Every story renders inside the canvas, so the dialog is found there even while it sits in the
// top layer. A closing dialog stays visible while it fades, so check `open` rather than visibility.
function getDialog(canvasElement: HTMLElement) {
  return canvasElement.querySelector("dialog")!;
}

const meta = {
  title: "Overlays/Modal",
  component: Modal,
  tags: ["autodocs"],
  parameters: {
    design: { type: "figma", url: "https://www.figma.com/design/gVJvJJAOtJkcdeBHk61Ivb/Keyline?node-id=20-30" },
  },
  args: { onOpenChange: fn(), onAction: fn() },
  argTypes: {
    open: { control: false },
    defaultOpen: { control: false },
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    noCloseButton: { control: "boolean" },
    onAction: { table: { disable: true } },
  },
  render: (args) => publishModal(args),
} satisfies Meta<ModalStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ args, canvas, canvasElement, step }) => {
    const trigger = canvas.getByRole("button", { name: "Publish changes" });
    const dialog = getDialog(canvasElement);
    const html = document.documentElement;

    await step("starts closed, and the trigger never submits a surrounding form", async () => {
      await expect(trigger).toHaveAttribute("type", "button");
      await expect(trigger).toHaveAttribute("aria-haspopup", "dialog");
      await expect(trigger).toHaveAttribute("aria-controls", dialog.id);
      await expect(dialog.open).toBe(false);
      await expect(canvas.queryByRole("dialog")).not.toBeInTheDocument();
    });

    await step("opens as a modal dialog, named and described by its title and description", async () => {
      await userEvent.click(trigger);
      await expect(dialog.open).toBe(true);
      await expect(dialog.matches(":modal")).toBe(true);
      const shown = canvas.getByRole("dialog", { name: "Publish changes?" });
      await expect(shown).toHaveAccessibleDescription(/You can unpublish them later/);
      await expect(args.onOpenChange).toHaveBeenLastCalledWith(true);
    });

    await step("focuses the first control, Cancel, rather than the main action or the close button", async () => {
      await expect(canvas.getByRole("button", { name: "Cancel" })).toHaveFocus();
    });

    await step("stops the page scrolling behind it", async () => {
      await expect(html.style.overflow).toBe("hidden");
    });

    await step("tabs through its actions to the close button", async () => {
      await userEvent.tab();
      await expect(canvas.getByRole("button", { name: "Publish" })).toHaveFocus();
      await userEvent.tab();
      await expect(canvas.getByRole("button", { name: "Close" })).toHaveFocus();
    });

    await step("closes on Escape, returns focus to the trigger, and lets the page scroll again", async () => {
      await userEvent.keyboard("{Escape}");
      await expect(dialog.open).toBe(false);
      await expect(args.onOpenChange).toHaveBeenLastCalledWith(false);
      await waitFor(() => expect(trigger).toHaveFocus());
      await expect(html.style.overflow).toBe("");
    });

    await step("closes from the corner close button", async () => {
      await userEvent.click(trigger);
      await userEvent.click(canvas.getByRole("button", { name: "Close" }));
      await expect(dialog.open).toBe(false);
    });

    await step("closes from a ModalClose without running the action", async () => {
      await userEvent.click(trigger);
      await userEvent.click(canvas.getByRole("button", { name: "Cancel" }));
      await expect(dialog.open).toBe(false);
      await expect(args.onAction).not.toHaveBeenCalled();
    });

    await step("runs an action from a ModalClose, then closes", async () => {
      await userEvent.click(trigger);
      await userEvent.click(canvas.getByRole("button", { name: "Publish" }));
      await expect(args.onAction).toHaveBeenCalledWith("publish");
      await expect(dialog.open).toBe(false);
    });

    await step("stays open on a click inside the panel, even on its padding", async () => {
      await userEvent.click(trigger);
      const box = dialog.getBoundingClientRect();
      await userEvent.pointer({ keys: "[MouseLeft]", target: dialog, coords: { clientX: box.left + 4, clientY: box.top + 4 } });
      await expect(dialog.open).toBe(true);
    });

    await step("closes on a click on the backdrop", async () => {
      await userEvent.pointer({ keys: "[MouseLeft]", target: dialog, coords: { clientX: 1, clientY: 1 } });
      await expect(dialog.open).toBe(false);
      await expect(args.onOpenChange).toHaveBeenLastCalledWith(false);
    });
  },
};

/** Open, so axe checks the dialog in light mode. */
export const Open: Story = {
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Publish changes" }));
    await expect(canvas.getByRole("dialog", { name: "Publish changes?" })).toBeInTheDocument();
  },
};

/** Dark mode swaps the semantic tokens, so contrast is checked here too, with the modal open. */
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
 * The dialog renders in the top layer but stays where it is in the DOM, so it still inherits
 * `data-theme="dark"` from a section of an otherwise light page.
 */
export const DarkSection: Story = {
  name: "Dark section",
  render: (args) => (
    <div data-theme="dark" style={{ padding: 16, background: "var(--kl-color-page)" }}>
      {publishModal(args)}
    </div>
  ),
  play: Open.play,
};

/** `size` sets the panel's widest: `sm`, `md` (the default) or `lg`. It narrows to fit small screens. */
export const Small: Story = {
  args: { size: "sm" },
  play: Open.play,
};

export const Large: Story = {
  args: { size: "lg" },
  play: Open.play,
};

/**
 * `noCloseButton` leaves out the corner close button, for modals whose footer already offers a way
 * out. Escape and a click on the backdrop still close it.
 */
export const NoCloseButton: Story = {
  name: "No close button",
  args: { noCloseButton: true },
  play: async ({ canvas, canvasElement, step }) => {
    const dialog = getDialog(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Publish changes" }));

    await step("has no close button, but keeps its footer actions", async () => {
      await expect(canvas.queryByRole("button", { name: "Close" })).not.toBeInTheDocument();
      await expect(canvas.getByRole("button", { name: "Cancel" })).toHaveFocus();
    });

    await step("still closes on Escape and on the backdrop", async () => {
      await userEvent.keyboard("{Escape}");
      await expect(dialog.open).toBe(false);
      await userEvent.click(canvas.getByRole("button", { name: "Publish changes" }));
      await userEvent.pointer({ keys: "[MouseLeft]", target: dialog, coords: { clientX: 1, clientY: 1 } });
      await expect(dialog.open).toBe(false);
    });
  },
};

/**
 * Each Modal keeps its own state and ids, so several can sit side by side, each with its own
 * trigger. The trigger is a Button, so it takes any variant.
 */
export const MultipleModals: Story = {
  name: "Multiple modals",
  render: (args) => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
      {publishModal(args)}
      {discardDraftModal(args)}
    </div>
  ),
  play: async ({ args, canvas, canvasElement, step }) => {
    const publish = canvas.getByRole("button", { name: "Publish changes" });
    const discard = canvas.getByRole("button", { name: "Discard draft" });
    const [publishDialog, discardDialog] = Array.from(canvasElement.querySelectorAll("dialog"));

    await step("each trigger controls its own dialog", async () => {
      await expect(publish).toHaveAttribute("aria-controls", publishDialog!.id);
      await expect(discard).toHaveAttribute("aria-controls", discardDialog!.id);
      await expect(publishDialog!.id).not.toBe(discardDialog!.id);
    });

    await step("opens only its own modal, and returns focus to its own trigger", async () => {
      await userEvent.click(discard);
      await expect(discardDialog!.open).toBe(true);
      await expect(publishDialog!.open).toBe(false);
      await expect(canvas.getByRole("dialog", { name: "Discard draft?" })).toBeInTheDocument();
      await expect(canvas.getByRole("button", { name: "Keep editing" })).toHaveFocus();

      await userEvent.keyboard("{Escape}");
      await expect(discardDialog!.open).toBe(false);
      await waitFor(() => expect(discard).toHaveFocus());
    });

    await step("runs the other modal's action without touching the first", async () => {
      await userEvent.click(publish);
      await expect(publishDialog!.open).toBe(true);
      await expect(discardDialog!.open).toBe(false);
      await userEvent.click(canvas.getByRole("button", { name: "Publish" }));
      await expect(args.onAction).toHaveBeenCalledTimes(1);
      await expect(args.onAction).toHaveBeenCalledWith("publish");
      await expect(publishDialog!.open).toBe(false);
    });
  },
};

/**
 * Put `autoFocus` on the control to start in. A `<form method="dialog">` closes the modal when it
 * submits, so it needs no close handling of its own.
 */
export const WithForm: Story = {
  name: "With form",
  render: ({ onAction, ...args }) => (
    <Modal {...args}>
      <ModalTrigger variant="secondary">Rename</ModalTrigger>
      <ModalContent size="sm">
        <ModalTitle>Rename project</ModalTitle>
        <form method="dialog" onSubmit={(event) => onAction(new FormData(event.currentTarget).get("name") as string)}>
          <label style={field}>
            Name
            <input name="name" defaultValue="Keyline Docs" autoFocus style={input} />
          </label>
          <ModalFooter>
            <ModalClose>Cancel</ModalClose>
            <Button type="submit">Save</Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  ),
  play: async ({ args, canvas, canvasElement }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Rename" }));
    const name = canvas.getByRole("textbox", { name: "Name" });
    await expect(name).toHaveFocus();

    await userEvent.clear(name);
    await userEvent.type(name, "Keyline{Enter}");
    await expect(args.onAction).toHaveBeenCalledWith("Keyline");
    await expect(getDialog(canvasElement).open).toBe(false);
    // The browser closes the dialog on submit but fires its close event, which brings the modal's
    // state along, a task later.
    await waitFor(() => expect(args.onOpenChange).toHaveBeenLastCalledWith(false));
  },
};

/** Pass `open` and `onOpenChange` to open the modal from anywhere, without a ModalTrigger. */
export const Controlled: Story = {
  render: function Render({ onAction, onOpenChange, ...args }) {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button variant="secondary" onClick={() => setOpen(true)}>
          Show shortcuts
        </Button>
        <Modal
          {...args}
          open={open}
          onOpenChange={(next) => {
            onOpenChange?.(next);
            setOpen(next);
          }}
        >
          <ModalContent>
            <ModalTitle>Keyboard shortcuts</ModalTitle>
            <ModalDescription>Press ? anywhere to open this list.</ModalDescription>
            <ModalFooter>
              <ModalClose variant="primary">Got it</ModalClose>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    );
  },
  play: async ({ args, canvas, canvasElement }) => {
    const opener = canvas.getByRole("button", { name: "Show shortcuts" });
    await userEvent.click(opener);
    await expect(getDialog(canvasElement).open).toBe(true);
    await userEvent.keyboard("{Escape}");
    await expect(getDialog(canvasElement).open).toBe(false);
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(false);
    await waitFor(() => expect(opener).toHaveFocus());
  },
};

/** Long content scrolls inside the panel, which keeps clear of the viewport's top and bottom edges. */
export const LongContent: Story = {
  name: "Long content",
  render: ({ onAction, size, ...args }) => (
    <Modal {...args}>
      <ModalTrigger variant="secondary">Read the terms</ModalTrigger>
      <ModalContent size={size}>
        <ModalTitle>Terms of service</ModalTitle>
        {Array.from({ length: 12 }, (_, i) => (
          <p key={i} style={{ margin: 0, lineHeight: 1.6 }}>
            {i + 1}. Keyline is provided as is. You may use, copy and modify it in your own projects, and you agree
            not to hold its authors responsible for anything that happens when you do.
          </p>
        ))}
        <ModalFooter>
          <ModalClose>Decline</ModalClose>
          <ModalClose variant="primary">Accept</ModalClose>
        </ModalFooter>
      </ModalContent>
    </Modal>
  ),
  play: async ({ canvas, canvasElement }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Read the terms" }));
    const dialog = getDialog(canvasElement);
    await expect(dialog.scrollHeight).toBeGreaterThan(dialog.clientHeight);
    // Measured once the opening bounce has settled, since the panel scales while it plays.
    await waitFor(async () => {
      const box = dialog.getBoundingClientRect();
      await expect(box.top).toBeGreaterThanOrEqual(40);
      await expect(window.innerHeight - box.bottom).toBeGreaterThanOrEqual(40);
      await expect(box.left).toBeGreaterThanOrEqual(15);
      await expect(window.innerWidth - box.right).toBeGreaterThanOrEqual(15);
    });
  },
};
