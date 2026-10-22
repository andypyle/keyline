import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent } from "storybook/test";
import { Button } from "../Button/Button";
import { Radio } from "../Radio/Radio";
import { RadioGroup } from "./RadioGroup";
import type { RadioGroupProps } from "./RadioGroup.types";

// Stories are excluded from Tailwind's source scan, so layout here uses inline styles.
const field = { display: "grid", gap: 10, justifyItems: "start" } as const;
const legend = { fontWeight: 700 } as const;
const option = { display: "inline-flex", alignItems: "center", gap: 10, fontWeight: 500 } as const;

const SHIPPING = [
  { value: "standard", label: "Standard (3–5 days)" },
  { value: "express", label: "Express (1–2 days)" },
  { value: "overnight", label: "Overnight", disabled: true },
  { value: "pickup", label: "Pick up in store" },
];

type RadioGroupStoryArgs = RadioGroupProps & { onFormSubmit: (data: Record<string, FormDataEntryValue>) => void };

function Shipping({ onFormSubmit: _, ...args }: Partial<RadioGroupStoryArgs>) {
  return (
    <div style={field}>
      <span id="shipping-label" style={legend}>
        Shipping
      </span>
      <RadioGroup aria-labelledby="shipping-label" {...args}>
        {SHIPPING.map((choice) => (
          <label key={choice.value} style={option}>
            <Radio value={choice.value} disabled={choice.disabled} />
            {choice.label}
          </label>
        ))}
      </RadioGroup>
    </div>
  );
}

const meta = {
  title: "Forms/RadioGroup",
  component: RadioGroup,
  tags: ["autodocs"],
  args: { onValueChange: fn(), onFormSubmit: fn() },
  argTypes: {
    orientation: { control: "inline-radio", options: ["vertical", "horizontal"] },
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    value: { control: false },
    disabled: { control: "boolean" },
    onFormSubmit: { table: { disable: true } },
  },
  render: (args) => <Shipping {...args} />,
} satisfies Meta<RadioGroupStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ args, canvas, step }) => {
    const group = canvas.getByRole("radiogroup", { name: "Shipping" });
    const radio = (name: RegExp) => canvas.getByRole("radio", { name });

    await step("is a radiogroup named by its heading, with nothing chosen", async () => {
      await expect(group).toBeInTheDocument();
      for (const r of canvas.getAllByRole("radio")) await expect(r).not.toBeChecked();
    });

    await step("chooses a Radio on click", async () => {
      await userEvent.click(radio(/Express/));
      await expect(radio(/Express/)).toBeChecked();
      await expect(args.onValueChange).toHaveBeenLastCalledWith("express");
    });

    await step("moves and chooses with the arrow keys, skipping disabled Radios", async () => {
      await userEvent.keyboard("{ArrowDown}");
      await expect(radio(/Pick up/)).toBeChecked();
      await expect(radio(/Pick up/)).toHaveFocus();
      await expect(args.onValueChange).toHaveBeenLastCalledWith("pickup");
      await userEvent.keyboard("{ArrowUp}");
      await expect(radio(/Express/)).toBeChecked();
    });

    await step("is one Tab stop, landing on the chosen Radio", async () => {
      await userEvent.tab({ shift: true });
      await userEvent.tab();
      await expect(radio(/Express/)).toHaveFocus();
      await userEvent.tab();
      await expect(group).not.toContainElement(document.activeElement as HTMLElement);
    });
  },
};

export const DefaultValue: Story = {
  name: "Default value",
  args: { defaultValue: "pickup" },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("radio", { name: /Pick up/ })).toBeChecked();
    await userEvent.tab();
    await expect(canvas.getByRole("radio", { name: /Pick up/ })).toHaveFocus();
  },
};

/** Lays the Radios out in a row, wrapping when they don't fit. ArrowRight and ArrowLeft move between them too. */
export const Horizontal: Story = {
  args: { orientation: "horizontal", defaultValue: "standard" },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("radiogroup", { name: "Shipping" })).toHaveAttribute("aria-orientation", "horizontal");
    await userEvent.tab();
    await userEvent.keyboard("{ArrowRight}");
    await expect(canvas.getByRole("radio", { name: /Express/ })).toBeChecked();
  },
};

/** `size` sets every Radio's size. */
export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: "grid", gap: 28 }}>
      <Shipping {...args} size="sm" defaultValue="standard" />
      <Shipping {...args} size="lg" defaultValue="standard" />
    </div>
  ),
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: "standard" },
  play: async ({ args, canvas, step }) => {
    await step("ignores clicks", async () => {
      await userEvent.click(canvas.getByRole("radio", { name: /Express/ }));
      await expect(canvas.getByRole("radio", { name: /Standard/ })).toBeChecked();
      await expect(args.onValueChange).not.toHaveBeenCalled();
    });

    await step("is skipped by keyboard navigation", async () => {
      await userEvent.tab();
      for (const radio of canvas.getAllByRole("radio")) await expect(radio).not.toHaveFocus();
    });
  },
};

/** `name` submits the chosen value with a form, and `required` blocks submission until one is chosen. */
export const InForm: Story = {
  name: "In a form",
  args: { name: "shipping", required: true },
  render: ({ onFormSubmit, ...args }) => (
    <form
      style={field}
      onSubmit={(event) => {
        event.preventDefault();
        onFormSubmit(Object.fromEntries(new FormData(event.currentTarget)));
      }}
    >
      <Shipping {...args} />
      <Button type="submit">Submit</Button>
    </form>
  ),
  play: async ({ args, canvas, step }) => {
    const submit = canvas.getByRole("button", { name: "Submit" });

    await step("blocks submission while nothing is chosen, focusing the first Radio", async () => {
      await userEvent.click(submit);
      await expect(args.onFormSubmit).not.toHaveBeenCalled();
      await expect(canvas.getByRole("radio", { name: /Standard/ })).toHaveFocus();
    });

    await step("submits the chosen value under its name", async () => {
      await userEvent.click(canvas.getByRole("radio", { name: /Express/ }));
      await userEvent.click(submit);
      await expect(args.onFormSubmit).toHaveBeenCalledTimes(1);
      await expect(args.onFormSubmit).toHaveBeenCalledWith({ shipping: "express" });
    });
  },
};

/** Like native radios, an uncontrolled group goes back to its `defaultValue` when its form resets. */
export const FormReset: Story = {
  name: "Form reset",
  args: { name: "shipping", defaultValue: "standard" },
  render: ({ onFormSubmit, ...args }) => (
    <form
      style={field}
      onSubmit={(event) => {
        event.preventDefault();
        onFormSubmit(Object.fromEntries(new FormData(event.currentTarget)));
      }}
    >
      <Shipping {...args} />
      <div style={{ display: "flex", gap: 12 }}>
        <Button type="reset" variant="secondary">
          Reset
        </Button>
        <Button type="submit">Submit</Button>
      </div>
    </form>
  ),
  play: async ({ args, canvas, step }) => {
    const reset = canvas.getByRole("button", { name: "Reset" });

    await step("goes back to the default", async () => {
      await userEvent.click(canvas.getByRole("radio", { name: /Express/ }));
      await userEvent.click(reset);
      await expect(canvas.getByRole("radio", { name: /Standard/ })).toBeChecked();
      await expect(canvas.getByRole("radio", { name: /Express/ })).not.toBeChecked();
      // The browser puts the checked radio back on its own; this catches the group's state
      // staying on Express, which would swallow choosing it again.
      await userEvent.click(canvas.getByRole("radio", { name: /Express/ }));
      await expect(args.onValueChange).toHaveBeenCalledTimes(2);
      await expect(args.onValueChange).toHaveBeenLastCalledWith("express");
      await userEvent.click(reset);
    });

    await step("stays on the default when it was already chosen again", async () => {
      await userEvent.click(canvas.getByRole("radio", { name: /Pick up/ }));
      await userEvent.click(canvas.getByRole("radio", { name: /Standard/ }));
      await userEvent.click(reset);
      await expect(canvas.getByRole("radio", { name: /Standard/ })).toBeChecked();
    });

    await step("submits the default", async () => {
      await userEvent.click(canvas.getByRole("button", { name: "Submit" }));
      await expect(args.onFormSubmit).toHaveBeenCalledWith({ shipping: "standard" });
    });
  },
};
