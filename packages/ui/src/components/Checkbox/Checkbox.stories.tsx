import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, fn, userEvent } from "storybook/test";
import { Button } from "../Button/Button";
import { Checkbox } from "./Checkbox";
import type { CheckboxProps } from "./Checkbox.types";

// Stories are excluded from Tailwind's source scan, so layout here uses inline styles.
const stack = { display: "grid", gap: 14, justifyItems: "start" } as const;
const option = { display: "inline-flex", alignItems: "center", gap: 10, fontWeight: 500 } as const;
const hint = { fontSize: 14, fontWeight: 400 } as const;

type CheckboxStoryArgs = CheckboxProps & { onFormSubmit: (data: Record<string, FormDataEntryValue>) => void };

const meta = {
  title: "Forms/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  args: { onChange: fn(), onFormSubmit: fn() },
  argTypes: {
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    indeterminate: { control: "boolean" },
    disabled: { control: "boolean" },
    onFormSubmit: { table: { disable: true } },
  },
  render: ({ onFormSubmit: _, ...args }) => (
    <label style={option}>
      <Checkbox {...args} />
      Email me about new releases
    </label>
  ),
} satisfies Meta<CheckboxStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ args, canvas, step }) => {
    const checkbox = canvas.getByRole("checkbox", { name: "Email me about new releases" });

    await step("starts unchecked, named by its label", async () => {
      await expect(checkbox).not.toBeChecked();
    });

    await step("toggles on click", async () => {
      await userEvent.click(checkbox);
      await expect(checkbox).toBeChecked();
      await expect(args.onChange).toHaveBeenCalledTimes(1);
    });

    await step("toggles with Space once focused", async () => {
      await expect(checkbox).toHaveFocus();
      await userEvent.keyboard(" ");
      await expect(checkbox).not.toBeChecked();
      await expect(args.onChange).toHaveBeenCalledTimes(2);
    });

    await step("toggles when its label is clicked", async () => {
      await userEvent.click(canvas.getByText("Email me about new releases"));
      await expect(checkbox).toBeChecked();
    });
  },
};

const TOPPINGS = ["Mushrooms", "Olives", "Peppers"];

function SelectAll(args: CheckboxProps) {
  const [checked, setChecked] = useState<string[]>(["Olives"]);
  const all = checked.length === TOPPINGS.length;
  return (
    <div style={stack}>
      <label style={option}>
        <Checkbox
          {...args}
          checked={all}
          indeterminate={checked.length > 0 && !all}
          onChange={() => setChecked(all ? [] : TOPPINGS)}
        />
        All toppings
      </label>
      <div style={{ ...stack, paddingLeft: 30 }}>
        {TOPPINGS.map((topping) => (
          <label key={topping} style={option}>
            <Checkbox
              {...args}
              checked={checked.includes(topping)}
              onChange={(event) =>
                setChecked((prev) => (event.target.checked ? [...prev, topping] : prev.filter((t) => t !== topping)))
              }
            />
            {topping}
          </label>
        ))}
      </div>
    </div>
  );
}

/** `indeterminate` shows a dash and is announced as "mixed", for a checkbox that stands for a set where only some are checked. */
export const Indeterminate: Story = {
  render: ({ onFormSubmit: _, ...args }) => <SelectAll {...args} />,
  play: async ({ canvas, step }) => {
    const all = canvas.getByRole("checkbox", { name: "All toppings" });
    const olives = canvas.getByRole("checkbox", { name: "Olives" });

    await step("is mixed while some of the set is checked", async () => {
      await expect(all).toBePartiallyChecked();
    });

    await step("checks the whole set when clicked", async () => {
      await userEvent.click(all);
      await expect(all).toBeChecked();
      await expect(all).not.toBePartiallyChecked();
      for (const topping of TOPPINGS) await expect(canvas.getByRole("checkbox", { name: topping })).toBeChecked();
    });

    await step("goes back to mixed when one is unchecked", async () => {
      await userEvent.click(olives);
      await expect(all).toBePartiallyChecked();
    });
  },
};

export const Sizes: Story = {
  render: ({ onFormSubmit: _, ...args }) => (
    <div style={stack}>
      {(["sm", "md", "lg"] as const).map((size) => (
        <label key={size} style={option}>
          <Checkbox {...args} size={size} defaultChecked />
          {size === "sm" ? "Small" : size === "md" ? "Medium" : "Large"}
        </label>
      ))}
    </div>
  ),
};

export const Disabled: Story = {
  render: ({ onFormSubmit: _, ...args }) => (
    <div style={stack}>
      <label style={option}>
        <Checkbox {...args} disabled />
        Unavailable
      </label>
      <label style={option}>
        <Checkbox {...args} disabled defaultChecked />
        Always on
      </label>
    </div>
  ),
  play: async ({ args, canvas, step }) => {
    const off = canvas.getByRole("checkbox", { name: "Unavailable" });
    const on = canvas.getByRole("checkbox", { name: "Always on" });

    await step("ignores clicks, on the box and its label", async () => {
      await userEvent.click(off);
      await userEvent.click(canvas.getByText("Always on"));
      await expect(off).not.toBeChecked();
      await expect(on).toBeChecked();
      await expect(args.onChange).not.toHaveBeenCalled();
    });

    await step("is skipped by keyboard navigation", async () => {
      await userEvent.tab();
      await expect(off).not.toHaveFocus();
      await expect(on).not.toHaveFocus();
    });
  },
};

/** Pair `aria-invalid` with `aria-describedby` pointing at the message, so the error is announced with the box. */
export const Invalid: Story = {
  render: ({ onFormSubmit: _, ...args }) => (
    <div style={{ display: "grid", gap: 6 }}>
      <label style={option}>
        <Checkbox {...args} aria-invalid aria-describedby="terms-error" />I accept the terms
      </label>
      <span id="terms-error" style={hint}>
        Accept the terms to continue.
      </span>
    </div>
  ),
  play: async ({ canvas }) => {
    const checkbox = canvas.getByRole("checkbox", { name: "I accept the terms" });
    await expect(checkbox).toBeInvalid();
    await expect(checkbox).toHaveAccessibleDescription("Accept the terms to continue.");
  },
};

/** A native checkbox, so `name`, `value` and `required` work in forms as usual. */
export const InForm: Story = {
  name: "In a form",
  render: ({ onFormSubmit, ...args }) => (
    <form
      style={stack}
      onSubmit={(event) => {
        event.preventDefault();
        onFormSubmit(Object.fromEntries(new FormData(event.currentTarget)));
      }}
    >
      <label style={option}>
        <Checkbox {...args} name="terms" value="accepted" required />I accept the terms
      </label>
      <Button type="submit">Submit</Button>
    </form>
  ),
  play: async ({ args, canvas, step }) => {
    const checkbox = canvas.getByRole("checkbox", { name: "I accept the terms" });
    const submit = canvas.getByRole("button", { name: "Submit" });

    await step("blocks submission while required and unchecked, focusing the box", async () => {
      await userEvent.click(submit);
      await expect(args.onFormSubmit).not.toHaveBeenCalled();
      await expect(checkbox).toHaveFocus();
    });

    await step("submits its value once checked", async () => {
      await userEvent.keyboard(" ");
      await userEvent.click(submit);
      await expect(args.onFormSubmit).toHaveBeenCalledTimes(1);
      await expect(args.onFormSubmit).toHaveBeenCalledWith({ terms: "accepted" });
    });
  },
};

export const States: Story = {
  render: ({ onFormSubmit: _, ...args }) => (
    <div style={stack}>
      <label style={option}>
        <Checkbox {...args} />
        Unchecked
      </label>
      <label style={option}>
        <Checkbox {...args} defaultChecked />
        Checked
      </label>
      <label style={option}>
        <Checkbox {...args} indeterminate />
        Indeterminate
      </label>
      <label style={option}>
        <Checkbox {...args} aria-invalid />
        Invalid
      </label>
      <label style={option}>
        <Checkbox {...args} disabled />
        Disabled
      </label>
      <label style={option}>
        <Checkbox {...args} disabled defaultChecked />
        Disabled, checked
      </label>
    </div>
  ),
};

/** Dark mode swaps the semantic tokens, so contrast is checked here too. */
export const StatesDark: Story = {
  name: "States (dark)",
  globals: { theme: "dark" },
  render: States.render,
  play: async () => {
    // Guards the contrast check: if the theme global stops applying, this story would silently test light mode.
    await expect(document.documentElement).toHaveAttribute("data-theme", "dark");
  },
};
