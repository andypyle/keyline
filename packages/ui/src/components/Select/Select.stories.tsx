import type { Meta, StoryObj } from "@storybook/react-vite";
import { useId } from "react";
import { expect, fn, userEvent, waitFor } from "storybook/test";
import { Button } from "../Button/Button";
import { Modal } from "../Modal/Modal";
import { ModalContent } from "../Modal/parts/ModalContent";
import { ModalTitle } from "../Modal/parts/ModalTitle";
import { ModalTrigger } from "../Modal/parts/ModalTrigger";
import { SelectContent } from "./parts/SelectContent";
import { SelectGroup } from "./parts/SelectGroup";
import { SelectItem } from "./parts/SelectItem";
import { SelectLabel } from "./parts/SelectLabel";
import { SelectSeparator } from "./parts/SelectSeparator";
import { SelectTrigger } from "./parts/SelectTrigger";
import type { SelectTriggerProps } from "./parts/SelectTrigger.types";
import { Select } from "./Select";
import type { SelectProps } from "./Select.types";

// Stories are excluded from Tailwind's source scan, so layout here uses inline styles.
const stack = { display: "grid", gap: 20, maxWidth: 360 } as const;
const field = { display: "grid", gap: 6, maxWidth: 360, fontWeight: 600 } as const;
const hint = { fontSize: 14, fontWeight: 400 } as const;

const FRUITS = [
  { value: "apple", label: "Apple" },
  { value: "apricot", label: "Apricot" },
  { value: "banana", label: "Banana" },
  { value: "blueberry", label: "Blueberry" },
  { value: "cherry", label: "Cherry" },
  { value: "durian", label: "Durian", disabled: true },
  { value: "grape", label: "Grape" },
  { value: "mango", label: "Mango" },
  { value: "nectarine", label: "Nectarine" },
];

const TIME_ZONES = [
  "Pacific/Honolulu",
  "America/Anchorage",
  "America/Los_Angeles",
  "America/Denver",
  "America/Chicago",
  "America/New_York",
  "America/Halifax",
  "America/Sao_Paulo",
  "Atlantic/Azores",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Europe/Athens",
  "Europe/Istanbul",
  "Asia/Dubai",
  "Asia/Karachi",
  "Asia/Kolkata",
  "Asia/Dhaka",
  "Asia/Bangkok",
  "Asia/Shanghai",
  "Asia/Tokyo",
  "Australia/Sydney",
  "Pacific/Auckland",
];

type SelectStoryArgs = SelectProps & {
  label?: string;
  trigger?: Omit<SelectTriggerProps, "ref">;
  onFormSubmit: (data: Record<string, FormDataEntryValue>) => void;
};

function FruitSelect({ label = "Fruit", trigger, onFormSubmit: _, ...args }: Partial<SelectStoryArgs>) {
  const id = useId();
  return (
    <div style={field}>
      <label htmlFor={id}>{label}</label>
      <Select {...args}>
        <SelectTrigger placeholder="Pick a fruit" {...trigger} id={id} />
        <SelectContent>
          {FRUITS.map((fruit) => (
            <SelectItem key={fruit.value} value={fruit.value} disabled={fruit.disabled}>
              {fruit.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

// Typeahead builds one search from keys typed close together; wait it out between searches.
const typeaheadReset = () => new Promise((resolve) => setTimeout(resolve, 600));

const meta = {
  title: "Forms/Select",
  component: Select,
  tags: ["autodocs"],
  args: { onValueChange: fn(), onOpenChange: fn(), onFormSubmit: fn() },
  argTypes: {
    value: { control: false },
    open: { control: false },
    defaultOpen: { control: false },
    disabled: { control: "boolean" },
    label: { table: { disable: true } },
    trigger: { table: { disable: true } },
    onFormSubmit: { table: { disable: true } },
  },
  render: (args) => <FruitSelect {...args} />,
} satisfies Meta<SelectStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ args, canvas, canvasElement, step }) => {
    const trigger = canvas.getByRole("combobox", { name: "Fruit" });
    const option = (name: string) => canvas.getByRole("option", { name });

    await step("is a collapsed combobox showing its placeholder, and never submits a surrounding form", async () => {
      await expect(trigger).toHaveAttribute("type", "button");
      await expect(trigger).toHaveAttribute("aria-haspopup", "listbox");
      await expect(trigger).toHaveAttribute("aria-expanded", "false");
      await expect(trigger).toHaveTextContent("Pick a fruit");
      await expect(canvas.queryByRole("listbox")).not.toBeInTheDocument();
    });

    await step("opens on click, named by the trigger's label, with the first option highlighted", async () => {
      await userEvent.click(trigger);
      await expect(trigger).toHaveAttribute("aria-expanded", "true");
      await expect(canvas.getByRole("listbox", { name: "Fruit" })).toBeInTheDocument();
      await expect(trigger).toHaveAttribute("aria-activedescendant", option("Apple").id);
      await expect(args.onOpenChange).toHaveBeenLastCalledWith(true);
    });

    await step("picks an option on click, closes, and keeps focus on the trigger", async () => {
      await userEvent.click(option("Banana"));
      await expect(args.onValueChange).toHaveBeenCalledTimes(1);
      await expect(args.onValueChange).toHaveBeenCalledWith("banana");
      await expect(trigger).toHaveAttribute("aria-expanded", "false");
      await expect(trigger).toHaveTextContent("Banana");
      await expect(trigger).toHaveFocus();
    });

    await step("reopens onto the selected option, marked as selected", async () => {
      await userEvent.click(trigger);
      await expect(option("Banana")).toHaveAttribute("aria-selected", "true");
      await expect(option("Apple")).toHaveAttribute("aria-selected", "false");
      await expect(trigger).toHaveAttribute("aria-activedescendant", option("Banana").id);
    });

    await step("ignores clicks on a disabled option", async () => {
      await userEvent.click(option("Durian"));
      await expect(trigger).toHaveAttribute("aria-expanded", "true");
      await expect(args.onValueChange).toHaveBeenCalledTimes(1);
    });

    await step("toggles closed when the trigger is clicked again", async () => {
      await userEvent.click(trigger);
      await expect(trigger).toHaveAttribute("aria-expanded", "false");
    });

    await step("closes on a click outside, without changing the value", async () => {
      await userEvent.click(trigger);
      await userEvent.click(canvasElement);
      await expect(trigger).toHaveAttribute("aria-expanded", "false");
      await expect(trigger).toHaveTextContent("Banana");
      await expect(args.onValueChange).toHaveBeenCalledTimes(1);
    });

    await step("only focuses when its label is clicked, like a native select", async () => {
      await userEvent.click(canvas.getByText("Fruit"));
      await expect(trigger).toHaveFocus();
      await expect(trigger).toHaveAttribute("aria-expanded", "false");
    });
  },
};

export const Keyboard: Story = {
  args: { defaultValue: "banana" },
  play: async ({ args, canvas, step }) => {
    const trigger = canvas.getByRole("combobox", { name: "Fruit" });
    const option = (name: string) => canvas.getByRole("option", { name });
    const expectActive = (name: string) => expect(trigger).toHaveAttribute("aria-activedescendant", option(name).id);

    await step("opens with ArrowDown onto the selected option, keeping focus on the trigger", async () => {
      await userEvent.tab();
      await expect(trigger).toHaveFocus();
      await userEvent.keyboard("{ArrowDown}");
      await expect(trigger).toHaveAttribute("aria-expanded", "true");
      await expectActive("Banana");
      await expect(trigger).toHaveFocus();
    });

    await step("moves with the arrow keys, Home and End, stopping at the ends", async () => {
      await userEvent.keyboard("{ArrowDown}");
      await expectActive("Blueberry");
      await userEvent.keyboard("{End}");
      await expectActive("Nectarine");
      await userEvent.keyboard("{ArrowDown}");
      await expectActive("Nectarine");
      await userEvent.keyboard("{Home}");
      await expectActive("Apple");
      await userEvent.keyboard("{ArrowUp}");
      await expectActive("Apple");
    });

    await step("skips disabled options", async () => {
      await userEvent.keyboard("{End}{ArrowUp}{ArrowUp}{ArrowUp}");
      await expectActive("Cherry");
      await userEvent.keyboard("{ArrowDown}");
      await expectActive("Grape");
    });

    await step("jumps to typed text, cycling through options with a repeated letter", async () => {
      await typeaheadReset();
      await userEvent.keyboard("b");
      await expectActive("Banana");
      await userEvent.keyboard("b");
      await expectActive("Blueberry");
      await typeaheadReset();
      await userEvent.keyboard("ap");
      await expectActive("Apple");
      await userEvent.keyboard("r");
      await expectActive("Apricot");
    });

    await step("picks the highlighted option with Enter and closes", async () => {
      await userEvent.keyboard("{Enter}");
      await expect(args.onValueChange).toHaveBeenCalledTimes(1);
      await expect(args.onValueChange).toHaveBeenCalledWith("apricot");
      await expect(trigger).toHaveAttribute("aria-expanded", "false");
      await expect(trigger).toHaveTextContent("Apricot");
      await expect(trigger).not.toHaveAttribute("aria-activedescendant");
    });

    await step("closes on Escape without changing the value", async () => {
      await userEvent.keyboard("{ArrowDown}{ArrowDown}{Escape}");
      await expect(trigger).toHaveAttribute("aria-expanded", "false");
      await expect(trigger).toHaveTextContent("Apricot");
      await expect(args.onValueChange).toHaveBeenCalledTimes(1);
    });

    await step("picks with Space, and opens onto the end with End", async () => {
      await userEvent.keyboard("{End}");
      await expectActive("Nectarine");
      await userEvent.keyboard(" ");
      await expect(args.onValueChange).toHaveBeenLastCalledWith("nectarine");
      await expect(trigger).toHaveAttribute("aria-expanded", "false");
    });

    await step("opens onto a match when typing while closed", async () => {
      await typeaheadReset();
      await userEvent.keyboard("m");
      await expect(trigger).toHaveAttribute("aria-expanded", "true");
      await expectActive("Mango");
    });

    await step("closes when Tab moves focus out, without changing the value", async () => {
      await userEvent.tab();
      await expect(trigger).not.toHaveFocus();
      await expect(trigger).toHaveAttribute("aria-expanded", "false");
      await expect(trigger).toHaveTextContent("Nectarine");
    });
  },
};

export const Sizes: Story = {
  render: (args) => (
    <div style={stack}>
      <FruitSelect {...args} label="Small" trigger={{ size: "sm" }} />
      <FruitSelect {...args} label="Medium" trigger={{ size: "md" }} />
      <FruitSelect {...args} label="Large" trigger={{ size: "lg" }} />
    </div>
  ),
};

/** Pair `aria-invalid` with `aria-describedby` pointing at the message, so the error is announced with the field. */
export const Invalid: Story = {
  render: (args) => (
    <div style={field}>
      <FruitSelect {...args} trigger={{ "aria-invalid": true, "aria-describedby": "fruit-error" }} />
      <span id="fruit-error" style={hint}>
        Pick a fruit to continue.
      </span>
    </div>
  ),
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole("combobox", { name: "Fruit" });
    await expect(trigger).toBeInvalid();
    await expect(trigger).toHaveAccessibleDescription("Pick a fruit to continue.");
  },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: "mango" },
  play: async ({ args, canvas, step }) => {
    const trigger = canvas.getByRole("combobox", { name: "Fruit" });

    await step("doesn't open on click", async () => {
      await expect(trigger).toBeDisabled();
      await userEvent.click(trigger);
      await expect(trigger).toHaveAttribute("aria-expanded", "false");
      await expect(args.onOpenChange).not.toHaveBeenCalled();
    });

    await step("is skipped by keyboard navigation", async () => {
      await userEvent.tab();
      await expect(trigger).not.toHaveFocus();
    });
  },
};

/** `name` submits the value with a form, and `required` blocks submission until something is picked. */
export const InForm: Story = {
  name: "In a form",
  args: { name: "fruit", required: true },
  render: (args) => (
    <form
      style={stack}
      onSubmit={(event) => {
        event.preventDefault();
        args.onFormSubmit(Object.fromEntries(new FormData(event.currentTarget)));
      }}
    >
      <FruitSelect {...args} />
      <div>
        <Button type="submit">Submit</Button>
      </div>
    </form>
  ),
  play: async ({ args, canvas, step }) => {
    const trigger = canvas.getByRole("combobox", { name: "Fruit" });
    const submit = canvas.getByRole("button", { name: "Submit" });

    await step("blocks submission while empty, and moves focus to the trigger", async () => {
      await userEvent.click(submit);
      await expect(args.onFormSubmit).not.toHaveBeenCalled();
      await expect(trigger).toHaveFocus();
    });

    await step("submits the picked value under its name", async () => {
      await userEvent.click(trigger);
      await userEvent.click(canvas.getByRole("option", { name: "Cherry" }));
      await userEvent.click(submit);
      await expect(args.onFormSubmit).toHaveBeenCalledTimes(1);
      await expect(args.onFormSubmit).toHaveBeenCalledWith({ fruit: "cherry" });
    });
  },
};

/** Like a native select, an uncontrolled Select goes back to its `defaultValue` when its form resets. */
export const FormReset: Story = {
  name: "Form reset",
  args: { name: "fruit", defaultValue: "banana" },
  render: (args) => (
    <form
      style={stack}
      onSubmit={(event) => {
        event.preventDefault();
        args.onFormSubmit(Object.fromEntries(new FormData(event.currentTarget)));
      }}
    >
      <FruitSelect {...args} />
      <div style={{ display: "flex", gap: 12 }}>
        <Button type="reset" variant="secondary">
          Reset
        </Button>
        <Button type="submit">Submit</Button>
      </div>
    </form>
  ),
  play: async ({ args, canvas }) => {
    const trigger = canvas.getByRole("combobox", { name: "Fruit" });
    await userEvent.click(trigger);
    await userEvent.click(canvas.getByRole("option", { name: "Cherry" }));
    await expect(trigger).toHaveTextContent("Cherry");

    await userEvent.click(canvas.getByRole("button", { name: "Reset" }));
    await expect(trigger).toHaveTextContent("Banana");
    await expect(args.onValueChange).toHaveBeenCalledTimes(1);

    await userEvent.click(canvas.getByRole("button", { name: "Submit" }));
    await expect(args.onFormSubmit).toHaveBeenCalledWith({ fruit: "banana" });
  },
};

/** Long lists cap their height and scroll, keeping the highlighted option in view. */
export const LongList: Story = {
  name: "Long list",
  render: ({ onFormSubmit: _, ...args }) => {
    const id = "time-zone";
    return (
      <div style={field}>
        <label htmlFor={id}>Time zone</label>
        <Select {...args}>
          <SelectTrigger id={id} placeholder="Pick a time zone" />
          <SelectContent>
            {TIME_ZONES.map((zone) => (
              <SelectItem key={zone} value={zone}>
                {zone.replace(/_/g, " ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  },
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole("combobox", { name: "Time zone" });
    trigger.focus();
    await userEvent.keyboard("{End}");
    const listbox = canvas.getByRole("listbox", { name: "Time zone" });
    const last = canvas.getByRole("option", { name: "Pacific/Auckland" });
    await expect(listbox.scrollHeight).toBeGreaterThan(listbox.clientHeight);
    await waitFor(() => {
      const list = listbox.getBoundingClientRect();
      const item = last.getBoundingClientRect();
      expect(item.bottom).toBeLessThanOrEqual(list.bottom);
      expect(item.top).toBeGreaterThanOrEqual(list.top);
    });
  },
};

function Icon({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}

const STATUSES = [
  { value: "backlog", label: "Backlog", icon: <Icon d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z" /> },
  { value: "in-progress", label: "In progress", icon: <Icon d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7v5l3 2" /> },
  { value: "in-review", label: "In review", icon: <Icon d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" /> },
  { value: "done", label: "Done", icon: <Icon d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM8 12.5l2.5 2.5L16 9.5" /> },
  { value: "cancelled", label: "Cancelled", icon: <Icon d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM9 9l6 6M15 9l-6 6" /> },
];

/** `icon` goes before an option's text, and shows in the trigger while that option is selected. */
export const WithIcons: Story = {
  name: "With icons",
  args: { defaultValue: "in-progress" },
  render: ({ onFormSubmit: _, ...args }) => {
    const id = "status";
    return (
      <div style={field}>
        <label htmlFor={id}>Status</label>
        <Select {...args}>
          <SelectTrigger id={id} />
          <SelectContent>
            {STATUSES.map((status) => (
              <SelectItem key={status.value} value={status.value} icon={status.icon}>
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  },
  play: async ({ canvas, step }) => {
    const trigger = canvas.getByRole("combobox", { name: "Status" });
    const triggerIcon = () => trigger.querySelector("[data-slot=icon]");

    await step("shows the selected option's icon in the trigger, hidden from assistive tech", async () => {
      await expect(trigger).toHaveTextContent("In progress");
      await expect(triggerIcon()).toHaveAttribute("aria-hidden", "true");
    });

    await step("names options by their text alone", async () => {
      await userEvent.click(trigger);
      const done = canvas.getByRole("option", { name: "Done" });
      await expect(done.querySelector("[data-slot=icon]")).toHaveAttribute("aria-hidden", "true");
    });

    await step("swaps the trigger's icon when another option is picked", async () => {
      const before = triggerIcon()!.innerHTML;
      await userEvent.click(canvas.getByRole("option", { name: "Done" }));
      await expect(trigger).toHaveTextContent("Done");
      await expect(triggerIcon()!.innerHTML).not.toBe(before);
    });

    await step("keeps typeahead on the text", async () => {
      await userEvent.keyboard("c");
      await expect(trigger).toHaveAttribute(
        "aria-activedescendant",
        canvas.getByRole("option", { name: "Cancelled" }).id,
      );
    });
  },
};

const PRODUCE = [
  { label: "Fruit", items: ["Apple", "Banana", "Cherry"] },
  { label: "Vegetables", items: ["Broccoli", "Carrot", "Leek"] },
  { label: "Herbs", items: ["Basil", "Chives", "Mint"] },
];

/**
 * SelectGroup gathers related options under a SelectLabel, which names the group for screen
 * readers. SelectSeparator draws a line between groups; arrow keys and typeahead pass over both.
 */
export const Groups: Story = {
  render: ({ onFormSubmit: _, ...args }) => {
    const id = "produce";
    return (
      <div style={field}>
        <label htmlFor={id}>Produce</label>
        <Select {...args}>
          <SelectTrigger id={id} placeholder="Pick something" />
          <SelectContent>
            {PRODUCE.map((group, index) => (
              <SelectGroup key={group.label}>
                {index > 0 && <SelectSeparator />}
                <SelectLabel>{group.label}</SelectLabel>
                {group.items.map((item) => (
                  <SelectItem key={item} value={item.toLowerCase()}>
                    {item}
                  </SelectItem>
                ))}
              </SelectGroup>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  },
  play: async ({ canvas, step }) => {
    const trigger = canvas.getByRole("combobox", { name: "Produce" });
    const option = (name: string) => canvas.getByRole("option", { name });
    const expectActive = (name: string) => expect(trigger).toHaveAttribute("aria-activedescendant", option(name).id);

    await step("names each group by its label", async () => {
      await userEvent.click(trigger);
      const vegetables = canvas.getByRole("group", { name: "Vegetables" });
      await expect(vegetables).toContainElement(option("Carrot"));
      await expect(canvas.getAllByRole("group")).toHaveLength(3);
    });

    await step("moves across groups with the arrow keys, passing over labels and separators", async () => {
      await expectActive("Apple");
      await userEvent.keyboard("{ArrowDown}{ArrowDown}{ArrowDown}");
      await expectActive("Broccoli");
      await userEvent.keyboard("{ArrowUp}");
      await expectActive("Cherry");
    });

    await step("matches typeahead against options, not labels", async () => {
      // "H" would match the Herbs label; there's no option starting with it, so nothing moves.
      await userEvent.keyboard("h");
      await expectActive("Cherry");
      await typeaheadReset();
      await userEvent.keyboard("m");
      await expectActive("Mint");
    });

    await step("ignores clicks on a label, staying open", async () => {
      await userEvent.click(canvas.getByText("Herbs"));
      await expect(trigger).toHaveAttribute("aria-expanded", "true");
    });
  },
};

/** Open with groups in dark mode, so axe checks the labels' contrast there too. */
export const GroupsDark: Story = {
  name: "Groups (dark)",
  globals: { theme: "dark" },
  render: Groups.render,
  play: async ({ canvas }) => {
    // Guards the contrast check: if the theme global stops applying, this story would silently test light mode.
    await expect(document.documentElement).toHaveAttribute("data-theme", "dark");
    await userEvent.click(canvas.getByRole("combobox", { name: "Produce" }));
    await expect(canvas.getByRole("group", { name: "Herbs" })).toBeInTheDocument();
  },
};

/** Inside a Modal, Escape closes the open list first and leaves the Modal open. */
export const InModal: Story = {
  name: "In a modal",
  render: (args) => (
    <Modal>
      <ModalTrigger>Edit order</ModalTrigger>
      <ModalContent>
        <ModalTitle>Edit order</ModalTitle>
        <FruitSelect {...args} />
      </ModalContent>
    </Modal>
  ),
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Edit order" }));
    const dialog = canvas.getByRole("dialog", { name: "Edit order" }) as HTMLDialogElement;
    const trigger = canvas.getByRole("combobox", { name: "Fruit" });

    await userEvent.click(trigger);
    await userEvent.keyboard("{Escape}");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await expect(dialog.open).toBe(true);

    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(dialog.open).toBe(false));
  },
};

/** Open, so axe checks the options in light mode. */
export const Open: Story = {
  args: { defaultValue: "cherry" },
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole("combobox", { name: "Fruit" });
    trigger.focus();
    await userEvent.keyboard("{ArrowDown}");
    await expect(canvas.getByRole("listbox", { name: "Fruit" })).toBeInTheDocument();
  },
};

/** Dark mode swaps the semantic tokens, so contrast is checked here too, with the list open. */
export const OpenDark: Story = {
  name: "Open (dark)",
  args: Open.args,
  globals: { theme: "dark" },
  play: async (context) => {
    // Guards the contrast check: if the theme global stops applying, this story would silently test light mode.
    await expect(document.documentElement).toHaveAttribute("data-theme", "dark");
    await Open.play!(context);
  },
};
