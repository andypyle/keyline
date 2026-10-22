import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, userEvent } from "storybook/test";
import { Checkbox } from "@/components/Checkbox/Checkbox";
import { Combobox } from "@/components/Combobox/Combobox";
import { ComboboxContent } from "@/components/Combobox/parts/ComboboxContent";
import { ComboboxInput } from "@/components/Combobox/parts/ComboboxInput";
import { ComboboxItem } from "@/components/Combobox/parts/ComboboxItem";
import { Input } from "@/components/Input/Input";
import { Radio } from "@/components/Radio/Radio";
import { RadioGroup } from "@/components/RadioGroup/RadioGroup";
import { SelectContent } from "@/components/Select/parts/SelectContent";
import { SelectItem } from "@/components/Select/parts/SelectItem";
import { SelectTrigger } from "@/components/Select/parts/SelectTrigger";
import { Select } from "@/components/Select/Select";
import { Switch } from "@/components/Switch/Switch";
import { Textarea } from "@/components/Textarea/Textarea";
import { Field } from "./Field";
import { FieldDescription } from "./parts/FieldDescription";
import { FieldError } from "./parts/FieldError";
import { FieldLabel } from "./parts/FieldLabel";

// Stories are excluded from Tailwind's source scan, so layout here uses inline styles.
const stack = { display: "grid", gap: 24, maxWidth: 360 } as const;
const option = { display: "inline-flex", alignItems: "center", gap: 10, fontWeight: 500 } as const;

const meta = {
  title: "Forms/Field",
  component: Field,
  tags: ["autodocs"],
  argTypes: {
    orientation: { control: "inline-radio", options: ["vertical", "horizontal"] },
    invalid: { control: "boolean" },
    disabled: { control: "boolean" },
    required: { control: "boolean" },
  },
  render: (args) => (
    <Field {...args} style={{ maxWidth: 360 }}>
      <FieldLabel>Email</FieldLabel>
      <Input type="email" placeholder="ada@example.com" />
      <FieldDescription>We'll only use it to send receipts.</FieldDescription>
      <FieldError>Enter a full email address, like ada@example.com.</FieldError>
    </Field>
  ),
} satisfies Meta<typeof Field>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas, step }) => {
    const input = canvas.getByRole("textbox", { name: "Email" });

    await step("names the control by its label and describes it by the description", async () => {
      await expect(input).toHaveAccessibleDescription("We'll only use it to send receipts.");
    });

    await step("hides the error, and leaves it out of the description, while valid", async () => {
      await expect(canvas.queryByText(/Enter a full email/)).not.toBeInTheDocument();
      await expect(input).not.toBeInvalid();
    });

    await step("focuses the control when the label is clicked", async () => {
      await userEvent.click(canvas.getByText("Email"));
      await expect(input).toHaveFocus();
    });
  },
};

/** `invalid` marks the control invalid and shows the FieldError, which the control is then described by too. */
export const Invalid: Story = {
  args: { invalid: true },
  play: async ({ canvas }) => {
    const input = canvas.getByRole("textbox", { name: "Email" });
    await expect(input).toBeInvalid();
    await expect(input).toHaveAccessibleDescription(
      "We'll only use it to send receipts. Enter a full email address, like ada@example.com.",
    );
  },
};

/** Dark mode swaps the semantic tokens, so the error's contrast is checked here too. */
export const InvalidDark: Story = {
  name: "Invalid (dark)",
  args: { invalid: true, required: true },
  globals: { theme: "dark" },
  play: async () => {
    // Guards the contrast check: if the theme global stops applying, this story would silently test light mode.
    await expect(document.documentElement).toHaveAttribute("data-theme", "dark");
  },
};

/** `required` makes the control required, and marks the label with an asterisk that's hidden from assistive tech. */
export const Required: Story = {
  args: { required: true },
  play: async ({ canvas }) => {
    const input = canvas.getByRole("textbox", { name: "Email" });
    await expect(input).toBeRequired();
    await expect(canvas.getByText("*")).toHaveAttribute("aria-hidden", "true");
  },
};

export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("textbox", { name: "Email" })).toBeDisabled();
  },
};

function ValidatedEmail() {
  const [value, setValue] = useState("");
  const [touched, setTouched] = useState(false);
  const invalid = touched && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value);
  return (
    <Field invalid={invalid} required style={{ maxWidth: 360 }}>
      <FieldLabel>Email</FieldLabel>
      <Input type="email" value={value} onChange={(event) => setValue(event.target.value)} onBlur={() => setTouched(true)} />
      <FieldError>Enter a full email address, like ada@example.com.</FieldError>
    </Field>
  );
}

/** The error comes and goes with `invalid`, here checked when the input loses focus. */
export const Validation: Story = {
  render: () => <ValidatedEmail />,
  play: async ({ canvas, step }) => {
    const input = canvas.getByRole("textbox", { name: "Email" });

    await step("shows the error once the field is left invalid", async () => {
      await userEvent.click(input);
      await userEvent.keyboard("ada@");
      await userEvent.tab();
      await expect(input).toBeInvalid();
      await expect(input).toHaveAccessibleDescription("Enter a full email address, like ada@example.com.");
    });

    await step("drops it as soon as the value is fixed", async () => {
      await userEvent.click(input);
      await userEvent.keyboard("example.com");
      await expect(input).not.toBeInvalid();
      await expect(input).not.toHaveAccessibleDescription();
      await expect(canvas.queryByText(/Enter a full email/)).not.toBeInTheDocument();
    });
  },
};

/** A control given its own `id` keeps it, and the label follows. */
export const CustomId: Story = {
  name: "Custom id",
  render: () => (
    <Field style={{ maxWidth: 360 }}>
      <FieldLabel>Username</FieldLabel>
      <Input id="signup-username" />
    </Field>
  ),
  play: async ({ canvas }) => {
    const input = canvas.getByRole("textbox", { name: "Username" });
    await expect(input).toHaveAttribute("id", "signup-username");
    await expect(canvas.getByText("Username")).toHaveAttribute("for", "signup-username");
  },
};

/**
 * Every Keyline form control reads its Field. Checkbox and Switch sit in a horizontal Field,
 * control first. A RadioGroup is named by the FieldLabel through `aria-labelledby`.
 */
export const EveryControl: Story = {
  name: "Every control",
  render: () => (
    <div style={stack}>
      <Field>
        <FieldLabel>Bio</FieldLabel>
        <Textarea size="sm" />
        <FieldDescription>A sentence or two.</FieldDescription>
      </Field>
      <Field required>
        <FieldLabel>Fruit</FieldLabel>
        <Select>
          <SelectTrigger placeholder="Pick a fruit" />
          <SelectContent>
            <SelectItem value="apple">Apple</SelectItem>
            <SelectItem value="banana">Banana</SelectItem>
          </SelectContent>
        </Select>
        <FieldDescription>Shown on your profile.</FieldDescription>
      </Field>
      <Field invalid>
        <FieldLabel>Country</FieldLabel>
        <Combobox>
          <ComboboxInput />
          <ComboboxContent>
            <ComboboxItem value="ie">Ireland</ComboboxItem>
            <ComboboxItem value="no">Norway</ComboboxItem>
          </ComboboxContent>
        </Combobox>
        <FieldError>Pick the country you live in.</FieldError>
      </Field>
      <Field>
        <FieldLabel>Shipping</FieldLabel>
        <RadioGroup defaultValue="standard">
          <label style={option}>
            <Radio value="standard" />
            Standard
          </label>
          <label style={option}>
            <Radio value="express" />
            Express
          </label>
        </RadioGroup>
        <FieldDescription>Express arrives in 1–2 days.</FieldDescription>
      </Field>
      <Field orientation="horizontal">
        <Checkbox />
        <FieldLabel>Email me about new releases</FieldLabel>
        <FieldDescription>About once a month.</FieldDescription>
      </Field>
      <Field orientation="horizontal" disabled>
        <Switch />
        <FieldLabel>Beta features</FieldLabel>
        <FieldDescription>Not available on your plan.</FieldDescription>
      </Field>
    </div>
  ),
  play: async ({ canvas, step }) => {
    await step("Textarea", async () => {
      await expect(canvas.getByRole("textbox", { name: "Bio" })).toHaveAccessibleDescription("A sentence or two.");
    });

    await step("Select, required", async () => {
      const trigger = canvas.getByRole("combobox", { name: "Fruit" });
      await expect(trigger).toHaveAccessibleDescription("Shown on your profile.");
      await expect(trigger).toHaveAttribute("aria-required", "true");
    });

    await step("Combobox, invalid", async () => {
      const input = canvas.getByRole("combobox", { name: "Country" });
      await expect(input).toBeInvalid();
      await expect(input).toHaveAccessibleDescription("Pick the country you live in.");
    });

    await step("RadioGroup, named through aria-labelledby", async () => {
      const group = canvas.getByRole("radiogroup", { name: "Shipping" });
      await expect(group).toHaveAccessibleDescription("Express arrives in 1–2 days.");
    });

    await step("Checkbox, toggled by its label", async () => {
      const checkbox = canvas.getByRole("checkbox", { name: "Email me about new releases" });
      await expect(checkbox).toHaveAccessibleDescription("About once a month.");
      await userEvent.click(canvas.getByText("Email me about new releases"));
      await expect(checkbox).toBeChecked();
    });

    await step("Switch, disabled", async () => {
      const toggle = canvas.getByRole("switch", { name: "Beta features" });
      await expect(toggle).toBeDisabled();
      await expect(toggle).toHaveAccessibleDescription("Not available on your plan.");
    });
  },
};
