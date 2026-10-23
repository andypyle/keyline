import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, waitFor } from "storybook/test";
import { Toast } from "./Toast";
import type { ToastProps } from "./Toast.types";
import { ToastAction } from "./parts/ToastAction";
import { ToastDescription } from "./parts/ToastDescription";
import { ToastTitle } from "./parts/ToastTitle";

// Stories are excluded from Tailwind's source scan, so layout here uses inline styles.
const stack = { display: "flex", flexDirection: "column", gap: 16 } as const;

const tones = ["neutral", "success", "warning", "danger", "info"] as const;

const toneCopy = {
  neutral: { title: "Draft autosaved", description: "Your edits are kept on this device." },
  success: { title: "Changes published", description: "3 pages are live on the docs site." },
  warning: { title: "Storage almost full", description: "You've used 92% of your workspace's space." },
  danger: { title: "Couldn't publish", description: "The docs site didn't respond. Try again in a minute." },
  info: { title: "New version available", description: "Reload to get the latest Keyline docs." },
};

type ToastStoryArgs = ToastProps & { onUndo: () => void };

function TonesStack(args: ToastStoryArgs) {
  const { onUndo: _onUndo, ...props } = args;
  return (
    <div style={stack}>
      {tones.map((tone) => (
        <Toast key={tone} {...props} tone={tone}>
          <ToastTitle>{toneCopy[tone].title}</ToastTitle>
          <ToastDescription>{toneCopy[tone].description}</ToastDescription>
        </Toast>
      ))}
    </div>
  );
}

const meta = {
  title: "Overlays/Toast",
  component: Toast,
  tags: ["autodocs"],
  parameters: {
    design: { type: "figma", url: "https://www.figma.com/design/gVJvJJAOtJkcdeBHk61Ivb/Keyline?node-id=78-18" },
  },
  // Static stories keep their toasts; the timer has its own stories.
  args: { duration: Infinity, onOpenChange: fn(), onExited: fn(), onUndo: fn() },
  argTypes: {
    tone: { control: "inline-radio", options: tones },
    noCloseButton: { control: "boolean" },
    open: { control: false },
    defaultOpen: { control: false },
    icon: { control: false },
    onUndo: { table: { disable: true } },
  },
  render: ({ onUndo: _onUndo, ...args }) => (
    <Toast {...args}>
      <ToastTitle>{toneCopy[args.tone ?? "neutral"].title}</ToastTitle>
      <ToastDescription>{toneCopy[args.tone ?? "neutral"].description}</ToastDescription>
    </Toast>
  ),
} satisfies Meta<ToastStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { id: "autosave" },
  play: async ({ canvas, canvasElement, step }) => {
    await step("is a status live region holding its title and description", async () => {
      const status = canvas.getByRole("status");
      await expect(status).toHaveTextContent("Draft autosaved");
      await expect(status).toHaveTextContent("Your edits are kept on this device.");
      await expect(status).toHaveAttribute("aria-atomic", "true");
    });

    await step("has a named close button that never submits a surrounding form", async () => {
      await expect(canvas.getByRole("button", { name: "Dismiss" })).toHaveAttribute("type", "button");
    });

    await step("passes native attributes through to the root", async () => {
      await expect(canvasElement.querySelector('[data-slot="toast"]')).toHaveAttribute("id", "autosave");
    });
  },
};

export const Tones: Story = {
  render: (args) => <TonesStack {...args} />,
  play: async ({ canvas, step }) => {
    await step("shows one toast per tone, each a status", async () => {
      await expect(canvas.getAllByRole("status")).toHaveLength(tones.length);
    });

    await step("hides the tone icons from assistive tech", async () => {
      for (const icon of canvas.getAllByRole("status").flatMap((s) => [...s.querySelectorAll('[data-slot="toast-icon"]')])) {
        await expect(icon).toHaveAttribute("aria-hidden", "true");
      }
    });
  },
};

export const TonesDark: Story = {
  name: "Tones (dark)",
  globals: { theme: "dark" },
  render: (args) => <TonesStack {...args} />,
};

export const WithAction: Story = {
  args: { tone: "neutral" },
  render: ({ onUndo, ...args }) => (
    <Toast {...args}>
      <ToastTitle>Page moved to trash</ToastTitle>
      <ToastDescription>“Getting started” is in the trash for 30 days.</ToastDescription>
      <ToastAction onClick={onUndo}>Undo</ToastAction>
    </Toast>
  ),
  play: async ({ args, canvas, step }) => {
    await step("the action runs its handler, then closes the toast", async () => {
      const undo = canvas.getByRole("button", { name: "Undo" });
      await expect(undo).toHaveAttribute("type", "button");
      await userEvent.click(undo);
      await expect(args.onUndo).toHaveBeenCalledOnce();
      await expect(args.onOpenChange).toHaveBeenLastCalledWith(false);
      await waitFor(() => expect(canvas.queryByRole("status")).not.toBeInTheDocument());
      await expect(args.onExited).toHaveBeenCalledOnce();
    });
  },
};

export const NoCloseButton: Story = {
  args: { tone: "success", noCloseButton: true },
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole("button", { name: "Dismiss" })).not.toBeInTheDocument();
  },
};

// Ends with no toast on screen: each step closes it.
export const Dismissing: Story = {
  args: { tone: "info" },
  render: ({ onUndo: _onUndo, ...args }) => (
    <div style={stack}>
      <Toast {...args}>
        <ToastTitle>New version available</ToastTitle>
      </Toast>
      <Toast {...args} tone="neutral">
        <ToastTitle>Draft autosaved</ToastTitle>
      </Toast>
    </div>
  ),
  play: async ({ args, canvas, step }) => {
    await step("closes from its close button", async () => {
      const [first] = canvas.getAllByRole("button", { name: "Dismiss" });
      await userEvent.click(first!);
      await expect(args.onOpenChange).toHaveBeenLastCalledWith(false);
      await waitFor(() => expect(canvas.queryByText("New version available")).not.toBeInTheDocument());
    });

    await step("closes on Escape while focus is inside it", async () => {
      canvas.getByRole("button", { name: "Dismiss" }).focus();
      await userEvent.keyboard("{Escape}");
      await waitFor(() => expect(canvas.queryByRole("status")).not.toBeInTheDocument());
      await expect(args.onExited).toHaveBeenCalledTimes(2);
    });
  },
};

// Ends with no toast on screen: the timer closes it.
export const AutoDismiss: Story = {
  args: { tone: "success", duration: 400 },
  play: async ({ args, canvas, step }) => {
    const status = canvas.getByRole("status");

    await step("stays while the pointer is over it, past its duration", async () => {
      await userEvent.hover(status);
      await new Promise((resolve) => setTimeout(resolve, 700));
      await expect(status).toBeInTheDocument();
      await expect(args.onOpenChange).not.toHaveBeenCalled();
    });

    await step("closes itself once the pointer leaves and its time runs out", async () => {
      await userEvent.unhover(status);
      await waitFor(() => expect(canvas.queryByRole("status")).not.toBeInTheDocument());
      await expect(args.onOpenChange).toHaveBeenCalledOnce();
      await expect(args.onOpenChange).toHaveBeenCalledWith(false);
    });
  },
};
