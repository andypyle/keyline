import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, waitFor } from "storybook/test";
import { useToast } from "@/lib/toaster-context";
import { Button } from "@/components/Button/Button";
import { Toaster } from "./Toaster";
import type { ToasterProps } from "./Toaster.types";

// Stories are excluded from Tailwind's source scan, so layout here uses inline styles.
const row = { display: "flex", flexWrap: "wrap", gap: 12 } as const;

type ToasterStoryArgs = ToasterProps & { onUndo: () => void };

// Buttons that raise the kinds of toast an app would.
function Demo({ onUndo }: { onUndo: () => void }) {
  const { toast, dismiss } = useToast();

  return (
    <div style={row}>
      <Button onClick={() => toast({ title: "Changes published", description: "3 pages are live on the docs site.", tone: "success" })}>
        Publish
      </Button>
      <Button
        variant="secondary"
        onClick={() =>
          toast({
            title: "Page moved to trash",
            description: "“Getting started” is in the trash for 30 days.",
            action: { label: "Undo", onClick: onUndo },
          })
        }
      >
        Delete page
      </Button>
      <Button
        variant="secondary"
        onClick={() => toast({ title: "Couldn't publish", description: "The docs site didn't respond. Try again in a minute.", tone: "danger" })}
      >
        Fail
      </Button>
      <Button variant="ghost" onClick={() => dismiss()}>
        Dismiss all
      </Button>
    </div>
  );
}

// Demo has to be a component, since useToast reads the Toaster above it, so the docs' "Show code"
// snippet would only show <Demo />. Show the pattern instead, with the story's Toaster props.
function usage(props: Partial<ToasterStoryArgs>) {
  const attributes = Object.entries(props)
    .filter(([name, value]) => value !== undefined && name !== "onUndo" && name !== "children")
    .map(([name, value]) => (typeof value === "string" ? ` ${name}="${value}"` : ` ${name}={${value}}`))
    .join("");
  return `function PublishButton() {
  const { toast } = useToast();
  return (
    <Button
      onClick={() =>
        toast({ title: "Changes published", description: "3 pages are live on the docs site.", tone: "success" })
      }
    >
      Publish
    </Button>
  );
}

<Toaster${attributes}>
  <PublishButton />
</Toaster>`;
}

const meta = {
  title: "Overlays/Toaster",
  component: Toaster,
  tags: ["autodocs"],
  parameters: {
    design: { type: "figma", url: "https://www.figma.com/design/gVJvJJAOtJkcdeBHk61Ivb/Keyline?node-id=78-18" },
    docs: { source: { transform: (_code: string, { args }: { args: Partial<ToasterStoryArgs> }) => usage(args) } },
  },
  args: { onUndo: fn() },
  argTypes: {
    position: {
      control: "select",
      options: ["top-start", "top-center", "top-end", "bottom-start", "bottom-center", "bottom-end"],
    },
    duration: { control: "number" },
    limit: { control: "number" },
    children: { control: false },
    onUndo: { table: { disable: true } },
  },
  render: ({ onUndo, ...args }) => (
    <Toaster {...args}>
      <Demo onUndo={onUndo} />
    </Toaster>
  ),
} satisfies Meta<ToasterStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

// Ends with no toasts on screen.
export const Default: Story = {
  args: { duration: Infinity },
  play: async ({ canvas, step }) => {
    const publish = canvas.getByRole("button", { name: "Publish" });

    await step("shows no region until there's a toast", async () => {
      await expect(canvas.queryByRole("region", { name: "Notifications" })).not.toBeInTheDocument();
    });

    await step("shows a toast in the Notifications region", async () => {
      await userEvent.click(publish);
      const region = canvas.getByRole("region", { name: "Notifications" });
      await expect(region).toBeVisible();
      await expect(region.matches(":popover-open")).toBe(true);
      await expect(canvas.getByRole("status")).toHaveTextContent("Changes published");
    });

    await step("closing the toast returns focus to where it was, and hides the empty region", async () => {
      await userEvent.click(canvas.getByRole("button", { name: "Dismiss" }));
      await waitFor(() => expect(canvas.queryByRole("status")).not.toBeInTheDocument());
      await expect(publish).toHaveFocus();
      await expect(canvas.queryByRole("region", { name: "Notifications" })).not.toBeInTheDocument();
    });

    await step("dismiss() with no id closes every toast", async () => {
      await userEvent.click(publish);
      await userEvent.click(canvas.getByRole("button", { name: "Fail" }));
      await expect(canvas.getAllByRole("status")).toHaveLength(2);
      await userEvent.click(canvas.getByRole("button", { name: "Dismiss all" }));
      await waitFor(() => expect(canvas.queryByRole("status")).not.toBeInTheDocument());
    });
  },
};

export const Stacked: Story = {
  args: { duration: Infinity },
  play: async ({ canvas, step }) => {
    await step("lists toasts oldest first, so the newest sits nearest the bottom edge", async () => {
      await userEvent.click(canvas.getByRole("button", { name: "Publish" }));
      await userEvent.click(canvas.getByRole("button", { name: "Delete page" }));
      await userEvent.click(canvas.getByRole("button", { name: "Fail" }));
      const statuses = canvas.getAllByRole("status");
      await expect(statuses.map((s) => s.querySelector('[data-slot="toast-title"]')?.textContent)).toEqual([
        "Changes published",
        "Page moved to trash",
        "Couldn't publish",
      ]);
    });
  },
};

export const StackedDark: Story = {
  ...Stacked,
  name: "Stacked (dark)",
  globals: { theme: "dark" },
};

// At the top the stack reverses, so the newest toast is still nearest the edge. (End rather than
// center, so the toasts don't cover the buttons that raise them.)
export const TopEnd: Story = {
  args: { duration: Infinity, position: "top-end" },
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Publish" }));
    await userEvent.click(canvas.getByRole("button", { name: "Fail" }));
    await expect(canvas.getAllByRole("status")).toHaveLength(2);
  },
};

export const Limit: Story = {
  args: { duration: Infinity, limit: 2 },
  play: async ({ canvas, step }) => {
    await step("showing a toast past the limit closes the oldest", async () => {
      await userEvent.click(canvas.getByRole("button", { name: "Publish" }));
      await userEvent.click(canvas.getByRole("button", { name: "Delete page" }));
      await userEvent.click(canvas.getByRole("button", { name: "Fail" }));
      await waitFor(() => expect(canvas.getAllByRole("status")).toHaveLength(2));
      await expect(canvas.queryByText("Changes published")).not.toBeInTheDocument();
    });
  },
};

// Ends with no toasts on screen.
export const Keyboard: Story = {
  args: { duration: Infinity },
  play: async ({ args, canvas, step }) => {
    const trigger = canvas.getByRole("button", { name: "Delete page" });

    await step("F8 moves focus to the region, and Tab reaches the toast's action", async () => {
      trigger.focus();
      await userEvent.keyboard("{Enter}");
      await userEvent.keyboard("{F8}");
      await expect(canvas.getByRole("region", { name: "Notifications" })).toHaveFocus();
      await userEvent.tab();
      await expect(canvas.getByRole("button", { name: "Undo" })).toHaveFocus();
    });

    await step("the action runs, closes the toast, and focus returns to where it was", async () => {
      await userEvent.keyboard("{Enter}");
      await expect(args.onUndo).toHaveBeenCalledOnce();
      await waitFor(() => expect(canvas.queryByRole("status")).not.toBeInTheDocument());
      await expect(trigger).toHaveFocus();
    });

    await step("Escape closes the focused toast without running its action", async () => {
      await userEvent.keyboard("{Enter}");
      await userEvent.keyboard("{F8}");
      await userEvent.tab();
      await userEvent.keyboard("{Escape}");
      await waitFor(() => expect(canvas.queryByRole("status")).not.toBeInTheDocument());
      await expect(args.onUndo).toHaveBeenCalledOnce();
      await expect(trigger).toHaveFocus();
    });
  },
};

// Ends with no toasts on screen: the timer closes it.
export const AutoDismiss: Story = {
  args: { duration: 3000 },
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Publish" }));
    // Outside the test runner motion isn't reduced, and the toast slides in from transparent.
    await waitFor(() => expect(canvas.getByRole("status")).toBeVisible());
    await waitFor(() => expect(canvas.queryByRole("status")).not.toBeInTheDocument(), { timeout: 4500 });
  },
};
