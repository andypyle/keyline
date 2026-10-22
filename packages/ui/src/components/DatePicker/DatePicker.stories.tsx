import type { Meta, StoryObj } from "@storybook/react-vite";
import { useId } from "react";
import { expect, fn, userEvent, waitFor } from "storybook/test";
import { dayOfWeek, formatDate, today } from "../../lib/calendar-date";
import { Button } from "../Button/Button";
import { Field } from "../Field/Field";
import { FieldDescription } from "../Field/parts/FieldDescription";
import { FieldLabel } from "../Field/parts/FieldLabel";
import { Modal } from "../Modal/Modal";
import { ModalContent } from "../Modal/parts/ModalContent";
import { ModalTitle } from "../Modal/parts/ModalTitle";
import { ModalTrigger } from "../Modal/parts/ModalTrigger";
import { DatePicker } from "./DatePicker";
import type { DatePickerProps } from "./DatePicker.types";
import { DatePickerContent } from "./parts/DatePickerContent";
import { DatePickerInput } from "./parts/DatePickerInput";
import type { DatePickerInputProps } from "./parts/DatePickerInput.types";
import { DatePickerTrigger } from "./parts/DatePickerTrigger";
import type { DatePickerTriggerProps } from "./parts/DatePickerTrigger.types";

// Stories are excluded from Tailwind's source scan, so layout here uses inline styles.
const stack = { display: "grid", gap: 20, maxWidth: 360 } as const;
const field = { display: "grid", gap: 6, maxWidth: 360, fontWeight: 600 } as const;
const hint = { fontSize: 14, fontWeight: 400 } as const;

type DatePickerStoryArgs = DatePickerProps & {
  label?: string;
  trigger?: Omit<DatePickerTriggerProps, "ref">;
  input?: Omit<DatePickerInputProps, "ref">;
  onFormSubmit: (data: Record<string, FormDataEntryValue>) => void;
};

function DateField({ label = "Date", trigger, input: _input, onFormSubmit: _, ...args }: Partial<DatePickerStoryArgs>) {
  const id = useId();
  return (
    <div style={field}>
      <label htmlFor={id}>{label}</label>
      <DatePicker {...args}>
        <DatePickerTrigger placeholder="Pick a date" {...trigger} id={id} />
        <DatePickerContent />
      </DatePicker>
    </div>
  );
}

// The same field with a DatePickerInput, for typing the date.
function DateInputField({ label = "Date", input, trigger: _trigger, onFormSubmit: _, ...args }: Partial<DatePickerStoryArgs>) {
  const id = useId();
  return (
    <div style={field}>
      <label htmlFor={id}>{label}</label>
      <DatePicker {...args}>
        <DatePickerInput {...input} id={id} />
        <DatePickerContent />
      </DatePicker>
    </div>
  );
}

// The names the calendar gives its days and its trigger's text, in the stories' en-US locale.
const dayName = (date: string) =>
  formatDate(date, "en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
const shortDate = (date: string) => formatDate(date, "en-US", { dateStyle: "medium" });
// A day in the current month, for stories that open on today.
const thisMonth = (day: number) => `${today().slice(0, 8)}${String(day).padStart(2, "0")}`;

const meta = {
  title: "Forms/DatePicker",
  component: DatePicker,
  tags: ["autodocs"],
  // A fixed locale keeps the day names the tests look for, and the first day of the week, the same
  // on every machine.
  args: { locale: "en-US", onValueChange: fn(), onOpenChange: fn(), onFormSubmit: fn() },
  argTypes: {
    value: { control: false },
    open: { control: false },
    defaultOpen: { control: false },
    isDateUnavailable: { control: false },
    disabled: { control: "boolean" },
    min: { control: "text" },
    max: { control: "text" },
    label: { table: { disable: true } },
    trigger: { table: { disable: true } },
    input: { table: { disable: true } },
    onFormSubmit: { table: { disable: true } },
  },
  render: (args) => <DateField {...args} />,
} satisfies Meta<DatePickerStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ args, canvas, canvasElement, step }) => {
    const trigger = canvas.getByRole("combobox", { name: "Date" });
    const day = (date: string) => canvas.getByRole("button", { name: dayName(date) });
    const picked = thisMonth(15);

    await step("is a collapsed combobox that pops up a dialog, and never submits a surrounding form", async () => {
      await expect(trigger).toHaveAttribute("type", "button");
      await expect(trigger).toHaveAttribute("aria-haspopup", "dialog");
      await expect(trigger).toHaveAttribute("aria-expanded", "false");
      await expect(trigger).toHaveTextContent("Pick a date");
      await expect(canvas.queryByRole("dialog")).not.toBeInTheDocument();
    });

    await step("opens on click, named by the trigger's label, with focus on today", async () => {
      await userEvent.click(trigger);
      await expect(trigger).toHaveAttribute("aria-expanded", "true");
      await expect(canvas.getByRole("dialog", { name: "Date" })).toBeInTheDocument();
      await expect(day(today())).toHaveFocus();
      await expect(day(today())).toHaveAttribute("aria-current", "date");
      await expect(args.onOpenChange).toHaveBeenLastCalledWith(true);
    });

    await step("names the grid by the month it shows", async () => {
      const month = formatDate(today(), "en-US", { month: "long", year: "numeric" });
      await expect(canvas.getByRole("grid", { name: month })).toBeInTheDocument();
    });

    await step("picks a date on click as YYYY-MM-DD, closes, and returns focus to the trigger", async () => {
      await userEvent.click(day(picked));
      await expect(args.onValueChange).toHaveBeenCalledTimes(1);
      await expect(args.onValueChange).toHaveBeenCalledWith(picked);
      await expect(trigger).toHaveAttribute("aria-expanded", "false");
      await expect(trigger).toHaveTextContent(shortDate(picked));
      await expect(trigger).toHaveFocus();
    });

    await step("reopens on the selected date, marked as selected", async () => {
      await userEvent.click(trigger);
      await expect(day(picked)).toHaveFocus();
      await expect(day(picked).closest("td")).toHaveAttribute("aria-selected", "true");
    });

    await step("closes on Escape without changing the value, returning focus to the trigger", async () => {
      await userEvent.keyboard("{ArrowRight}{Escape}");
      await expect(trigger).toHaveAttribute("aria-expanded", "false");
      await expect(trigger).toHaveFocus();
      await expect(trigger).toHaveTextContent(shortDate(picked));
      await expect(args.onValueChange).toHaveBeenCalledTimes(1);
    });

    await step("toggles closed when the trigger is clicked again", async () => {
      await userEvent.click(trigger);
      await userEvent.click(trigger);
      await expect(trigger).toHaveAttribute("aria-expanded", "false");
    });

    await step("closes on a click outside, without changing the value", async () => {
      await userEvent.click(trigger);
      await userEvent.click(canvasElement);
      await expect(trigger).toHaveAttribute("aria-expanded", "false");
      await expect(args.onValueChange).toHaveBeenCalledTimes(1);
    });

    await step("only focuses when its label is clicked, like a native select", async () => {
      await userEvent.click(canvas.getByText("Date"));
      await expect(trigger).toHaveFocus();
      await expect(trigger).toHaveAttribute("aria-expanded", "false");
    });
  },
};

export const Keyboard: Story = {
  args: { defaultValue: "2026-03-14" },
  play: async ({ args, canvas, step }) => {
    const trigger = canvas.getByRole("combobox", { name: "Date" });
    const expectFocus = (date: string) => expect(canvas.getByRole("button", { name: dayName(date) })).toHaveFocus();

    await step("shows the date in the trigger, and opens with Enter on the selected date", async () => {
      await expect(trigger).toHaveTextContent("Mar 14, 2026");
      await userEvent.tab();
      await expect(trigger).toHaveFocus();
      await userEvent.keyboard("{Enter}");
      await expect(trigger).toHaveAttribute("aria-expanded", "true");
      await expectFocus("2026-03-14");
    });

    await step("moves by day with the arrow keys and by week with up and down", async () => {
      await userEvent.keyboard("{ArrowRight}");
      await expectFocus("2026-03-15");
      await userEvent.keyboard("{ArrowLeft}{ArrowDown}");
      await expectFocus("2026-03-21");
      await userEvent.keyboard("{ArrowUp}");
      await expectFocus("2026-03-14");
    });

    await step("moves to the start and end of the week with Home and End", async () => {
      await userEvent.keyboard("{Home}");
      await expectFocus("2026-03-08");
      await userEvent.keyboard("{End}");
      await expectFocus("2026-03-14");
    });

    await step("shows the next month when moving past the end of this one", async () => {
      await userEvent.keyboard("{ArrowDown}{ArrowDown}{ArrowRight}{ArrowRight}{ArrowRight}{ArrowRight}");
      await expectFocus("2026-04-01");
      await expect(canvas.getByRole("grid", { name: "April 2026" })).toBeInTheDocument();
    });

    await step("pages by month with PageUp and PageDown, and by year with Shift", async () => {
      await userEvent.keyboard("{PageUp}");
      await expectFocus("2026-03-01");
      await userEvent.keyboard("{Shift>}{PageDown}{/Shift}");
      await expectFocus("2027-03-01");
      await userEvent.keyboard("{Shift>}{PageUp}{/Shift}{ArrowLeft}");
      await expectFocus("2026-02-28");
    });

    await step("keeps the day of the month when paging, or the month's last day where it's missing", async () => {
      await userEvent.keyboard("{PageDown}");
      await expectFocus("2026-03-28");
      await userEvent.keyboard("{ArrowRight}{ArrowRight}{ArrowRight}");
      await expectFocus("2026-03-31");
      await userEvent.keyboard("{PageDown}");
      await expectFocus("2026-04-30");
    });

    await step("keeps Tab inside the calendar, cycling through the month buttons and the grid", async () => {
      await userEvent.tab();
      await expect(canvas.getByRole("button", { name: "Previous month" })).toHaveFocus();
      await userEvent.tab();
      await expect(canvas.getByRole("button", { name: "Next month" })).toHaveFocus();
      await userEvent.tab();
      await expectFocus("2026-04-30");
      await userEvent.tab({ shift: true });
      await expect(canvas.getByRole("button", { name: "Next month" })).toHaveFocus();
    });

    await step("pages by month with the month buttons, moving the grid's focusable day along", async () => {
      await userEvent.keyboard("{Enter}");
      await expect(canvas.getByRole("grid", { name: "May 2026" })).toBeInTheDocument();
      await expect(canvas.getByRole("button", { name: "Next month" })).toHaveFocus();
      await userEvent.tab();
      await expectFocus("2026-05-30");
    });

    await step("picks the focused date with Enter", async () => {
      await userEvent.keyboard("{Enter}");
      await expect(args.onValueChange).toHaveBeenCalledTimes(1);
      await expect(args.onValueChange).toHaveBeenCalledWith("2026-05-30");
      await expect(trigger).toHaveAttribute("aria-expanded", "false");
      await expect(trigger).toHaveFocus();
    });

    await step("opens with Space without picking the focused date", async () => {
      await userEvent.keyboard(" ");
      await expect(trigger).toHaveAttribute("aria-expanded", "true");
      await expectFocus("2026-05-30");
      await expect(args.onValueChange).toHaveBeenCalledTimes(1);
    });

    await step("picks with Space", async () => {
      await userEvent.keyboard("{ArrowLeft} ");
      await expect(args.onValueChange).toHaveBeenLastCalledWith("2026-05-29");
      await expect(trigger).toHaveAttribute("aria-expanded", "false");
    });
  },
};

/** `min` and `max` bound the dates that can be picked; the calendar doesn't page past their months, and the keyboard stops at them. */
export const MinAndMax: Story = {
  name: "Min and max",
  args: { defaultValue: "2026-03-14", min: "2026-03-10", max: "2026-04-20" },
  play: async ({ args, canvas, step }) => {
    const trigger = canvas.getByRole("combobox", { name: "Date" });
    const day = (date: string) => canvas.getByRole("button", { name: dayName(date) });

    await userEvent.click(trigger);
    const previous = canvas.getByRole("button", { name: "Previous month" });
    const next = canvas.getByRole("button", { name: "Next month" });

    await step("disables the days and the month before min", async () => {
      await expect(day("2026-03-09")).toHaveAttribute("aria-disabled", "true");
      await expect(day("2026-03-10")).not.toHaveAttribute("aria-disabled");
      await expect(previous).toHaveAttribute("aria-disabled", "true");
      await userEvent.click(previous);
      await expect(canvas.getByRole("grid", { name: "March 2026" })).toBeInTheDocument();
    });

    await step("ignores clicks on a day out of range", async () => {
      await userEvent.click(day("2026-03-05"));
      await expect(trigger).toHaveAttribute("aria-expanded", "true");
      await expect(args.onValueChange).not.toHaveBeenCalled();
    });

    await step("stops the keyboard at min", async () => {
      await userEvent.keyboard("{ArrowUp}{Home}");
      await expect(day("2026-03-10")).toHaveFocus();
    });

    await step("stops paging at max's month, and the keyboard at max", async () => {
      await userEvent.click(next);
      await expect(canvas.getByRole("grid", { name: "April 2026" })).toBeInTheDocument();
      await expect(next).toHaveAttribute("aria-disabled", "true");
      await expect(next).toHaveFocus();
      await userEvent.click(next);
      await expect(canvas.getByRole("grid", { name: "April 2026" })).toBeInTheDocument();
      await userEvent.tab();
      await userEvent.keyboard("{PageDown}");
      await expect(day("2026-04-20")).toHaveFocus();
      await expect(day("2026-04-21")).toHaveAttribute("aria-disabled", "true");
    });
  },
};

const isWeekend = (date: string) => dayOfWeek(date) === 0 || dayOfWeek(date) === 6;

/** `isDateUnavailable` marks dates that can't be picked, here weekends. They stay in the grid, and the keyboard moves through them. */
export const UnavailableDates: Story = {
  name: "Unavailable dates",
  args: { defaultValue: "2026-03-13", isDateUnavailable: isWeekend },
  play: async ({ args, canvas, step }) => {
    const trigger = canvas.getByRole("combobox", { name: "Date" });
    const day = (date: string) => canvas.getByRole("button", { name: dayName(date) });

    await step("marks unavailable days, and ignores clicks on them", async () => {
      await userEvent.click(trigger);
      await expect(day("2026-03-14")).toHaveAttribute("aria-disabled", "true");
      await expect(day("2026-03-13")).not.toHaveAttribute("aria-disabled");
      await userEvent.click(day("2026-03-15"));
      await expect(trigger).toHaveAttribute("aria-expanded", "true");
      await expect(args.onValueChange).not.toHaveBeenCalled();
    });

    await step("lets the keyboard move onto them, but not pick them", async () => {
      await userEvent.keyboard("{ArrowRight}");
      await expect(day("2026-03-16")).toHaveFocus();
      await userEvent.keyboard("{ArrowLeft}{Enter}");
      await expect(day("2026-03-15")).toHaveFocus();
      await expect(trigger).toHaveAttribute("aria-expanded", "true");
      await expect(args.onValueChange).not.toHaveBeenCalled();
    });
  },
};

/** `locale` sets the month and day names, the trigger's date format and the first day of the week; `weekStartsOn` overrides the last. */
export const Locale: Story = {
  args: { locale: "de-DE", defaultValue: "2026-03-14", label: "Datum" },
  play: async ({ canvas, step }) => {
    const trigger = canvas.getByRole("combobox", { name: "Datum" });

    await step("writes the date and month in the locale", async () => {
      await expect(trigger).toHaveTextContent("14.03.2026");
      await userEvent.click(trigger);
      await expect(canvas.getByRole("grid", { name: "März 2026" })).toBeInTheDocument();
      await expect(canvas.getByRole("button", { name: "Samstag, 14. März 2026" })).toHaveFocus();
    });

    await step("starts the week on the locale's first day, with full day names on the column headers", async () => {
      const headers = canvas.getAllByRole("columnheader");
      await expect(headers).toHaveLength(7);
      await expect(headers[0]).toHaveAttribute("abbr", "Montag");
    });
  },
};

export const WeekStartsOn: Story = {
  name: "Week starts on",
  args: { weekStartsOn: 1, defaultValue: "2026-03-14" },
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("combobox", { name: "Date" }));
    await expect(canvas.getAllByRole("columnheader")[0]).toHaveAttribute("abbr", "Monday");
    await userEvent.keyboard("{Home}");
    await expect(canvas.getByRole("button", { name: dayName("2026-03-09") })).toHaveFocus();
  },
};

/** `formatOptions` on the trigger sets how it writes the date. */
export const DateFormat: Story = {
  name: "Date format",
  args: { defaultValue: "2026-03-14", trigger: { formatOptions: { weekday: "long", month: "long", day: "numeric" } } },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("combobox", { name: "Date" })).toHaveTextContent("Saturday, March 14");
  },
};

export const Sizes: Story = {
  args: { defaultValue: "2026-03-14" },
  render: (args) => (
    <div style={stack}>
      <DateField {...args} label="Small" trigger={{ size: "sm" }} />
      <DateField {...args} label="Medium" trigger={{ size: "md" }} />
      <DateField {...args} label="Large" trigger={{ size: "lg" }} />
    </div>
  ),
};

/** Pair `aria-invalid` with `aria-describedby` pointing at the message, so the error is announced with the field. */
export const Invalid: Story = {
  render: (args) => (
    <div style={field}>
      <DateField {...args} trigger={{ "aria-invalid": true, "aria-describedby": "date-error" }} />
      <span id="date-error" style={hint}>
        Pick a date to continue.
      </span>
    </div>
  ),
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole("combobox", { name: "Date" });
    await expect(trigger).toBeInvalid();
    await expect(trigger).toHaveAccessibleDescription("Pick a date to continue.");
  },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: "2026-03-14" },
  play: async ({ args, canvas, step }) => {
    const trigger = canvas.getByRole("combobox", { name: "Date" });

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

/** Inside a Field, the FieldLabel names the trigger, the FieldDescription describes it, and the Field's `required` passes down. */
export const InField: Story = {
  name: "In a field",
  render: ({ onFormSubmit: _, label: __, trigger: ___, input: ____, ...args }) => (
    <Field required style={{ maxWidth: 360 }}>
      <FieldLabel>Start date</FieldLabel>
      <DatePicker {...args}>
        <DatePickerTrigger placeholder="Pick a date" />
        <DatePickerContent />
      </DatePicker>
      <FieldDescription>Your first day on the team.</FieldDescription>
    </Field>
  ),
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole("combobox", { name: /Start date/ });
    await expect(trigger).toHaveAccessibleDescription("Your first day on the team.");
    await expect(trigger).toHaveAttribute("aria-required", "true");
    await userEvent.click(trigger);
    await expect(canvas.getByRole("dialog", { name: /Start date/ })).toBeInTheDocument();
  },
};

/** `name` submits the date as `YYYY-MM-DD` with a form, and `required` blocks submission until one is picked. */
export const InForm: Story = {
  name: "In a form",
  args: { name: "date", required: true },
  render: (args) => (
    <form
      style={stack}
      onSubmit={(event) => {
        event.preventDefault();
        args.onFormSubmit(Object.fromEntries(new FormData(event.currentTarget)));
      }}
    >
      <DateField {...args} />
      <div>
        <Button type="submit">Submit</Button>
      </div>
    </form>
  ),
  play: async ({ args, canvas, step }) => {
    const trigger = canvas.getByRole("combobox", { name: "Date" });
    const submit = canvas.getByRole("button", { name: "Submit" });

    await step("blocks submission while empty, and moves focus to the trigger", async () => {
      await userEvent.click(submit);
      await expect(args.onFormSubmit).not.toHaveBeenCalled();
      await expect(trigger).toHaveFocus();
    });

    await step("submits the picked date under its name", async () => {
      await userEvent.click(trigger);
      await userEvent.click(canvas.getByRole("button", { name: dayName(thisMonth(12)) }));
      await userEvent.click(submit);
      await expect(args.onFormSubmit).toHaveBeenCalledTimes(1);
      await expect(args.onFormSubmit).toHaveBeenCalledWith({ date: thisMonth(12) });
    });
  },
};

/** Like a native date input, an uncontrolled DatePicker goes back to its `defaultValue` when its form resets. */
export const FormReset: Story = {
  name: "Form reset",
  args: { name: "date", defaultValue: "2026-03-14" },
  render: (args) => (
    <form
      style={stack}
      onSubmit={(event) => {
        event.preventDefault();
        args.onFormSubmit(Object.fromEntries(new FormData(event.currentTarget)));
      }}
    >
      <DateField {...args} />
      <div style={{ display: "flex", gap: 12 }}>
        <Button type="reset" variant="secondary">
          Reset
        </Button>
        <Button type="submit">Submit</Button>
      </div>
    </form>
  ),
  play: async ({ args, canvas }) => {
    const trigger = canvas.getByRole("combobox", { name: "Date" });
    await userEvent.click(trigger);
    await userEvent.click(canvas.getByRole("button", { name: dayName("2026-03-20") }));
    await expect(trigger).toHaveTextContent("Mar 20, 2026");

    await userEvent.click(canvas.getByRole("button", { name: "Reset" }));
    await expect(trigger).toHaveTextContent("Mar 14, 2026");
    await expect(args.onValueChange).toHaveBeenCalledTimes(1);

    await userEvent.click(canvas.getByRole("button", { name: "Submit" }));
    await expect(args.onFormSubmit).toHaveBeenCalledWith({ date: "2026-03-14" });
  },
};

/** Inside a Modal, Escape closes the open calendar first and leaves the Modal open. */
export const InModal: Story = {
  name: "In a modal",
  render: (args) => (
    <Modal>
      <ModalTrigger>Book a visit</ModalTrigger>
      <ModalContent>
        <ModalTitle>Book a visit</ModalTitle>
        <DateField {...args} />
      </ModalContent>
    </Modal>
  ),
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Book a visit" }));
    const dialog = canvas.getByRole("dialog", { name: "Book a visit" }) as HTMLDialogElement;
    const trigger = canvas.getByRole("combobox", { name: "Date" });

    await userEvent.click(trigger);
    await userEvent.keyboard("{Escape}");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await expect(trigger).toHaveFocus();
    await expect(dialog.open).toBe(true);

    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(dialog.open).toBe(false));
  },
};

/** Open on a selected date with an unavailable day, so axe checks the calendar in light mode. */
export const Open: Story = {
  args: { defaultValue: "2026-03-14", isDateUnavailable: (date) => date === "2026-03-20" },
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("combobox", { name: "Date" }));
    await expect(canvas.getByRole("dialog", { name: "Date" })).toBeInTheDocument();
  },
};

/** Dark mode swaps the semantic tokens, so contrast is checked here too, with the calendar open. */
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

/**
 * DatePickerInput takes the place of the trigger, so the date can be typed as well as picked. It
 * shows the date in the locale's numeric form and reads it back with any separators, or as an ISO
 * date. What's typed takes effect when the field loses focus, or on Enter.
 */
export const Typing: Story = {
  render: (args) => <DateInputField {...args} />,
  play: async ({ args, canvas, step }) => {
    const input = canvas.getByRole("textbox", { name: "Date" });
    const toggle = canvas.getByRole("button", { name: "Choose date" });

    await step("is a text field showing the locale's date format, with a button that pops up the calendar", async () => {
      await expect(input).toHaveAttribute("placeholder", "mm/dd/yyyy");
      await expect(toggle).toHaveAttribute("aria-haspopup", "dialog");
      await expect(toggle).toHaveAttribute("aria-expanded", "false");
    });

    await step("takes a typed date when the field loses focus, and rewrites it in the locale's form", async () => {
      await userEvent.type(input, "3/14/2026");
      await expect(args.onValueChange).not.toHaveBeenCalled();
      await userEvent.tab();
      await expect(args.onValueChange).toHaveBeenCalledWith("2026-03-14");
      await expect(input).toHaveValue("03/14/2026");
      await expect(toggle).toHaveFocus();
    });

    await step("opens the calendar from the button on the typed date, and fills in a picked one", async () => {
      await userEvent.click(toggle);
      await expect(toggle).toHaveAttribute("aria-expanded", "true");
      await expect(canvas.getByRole("dialog", { name: "Date" })).toBeInTheDocument();
      await expect(canvas.getByRole("button", { name: dayName("2026-03-14") })).toHaveFocus();
      await userEvent.click(canvas.getByRole("button", { name: dayName("2026-03-20") }));
      await expect(args.onValueChange).toHaveBeenLastCalledWith("2026-03-20");
      await expect(input).toHaveValue("03/20/2026");
      await expect(input).toHaveFocus();
    });

    await step("clears the value for text that isn't a date, keeping the text and marking it invalid", async () => {
      await userEvent.clear(input);
      await userEvent.type(input, "13/45/2026");
      await userEvent.tab();
      await expect(args.onValueChange).toHaveBeenLastCalledWith(null);
      await expect(input).toHaveValue("13/45/2026");
      await expect(input).toBeInvalid();
      await expect((input as HTMLInputElement).validationMessage).toBe("Enter a valid date.");
    });

    await step("reads an ISO date, and takes it on Enter", async () => {
      await userEvent.clear(input);
      await userEvent.type(input, "2026-04-02{Enter}");
      await expect(args.onValueChange).toHaveBeenLastCalledWith("2026-04-02");
      await expect(input).toHaveValue("04/02/2026");
      await expect(input).toBeValid();
    });

    await step("opens the calendar with Alt+ArrowDown, and returns focus to the field on Escape", async () => {
      await userEvent.keyboard("{Alt>}{ArrowDown}{/Alt}");
      await expect(canvas.getByRole("button", { name: dayName("2026-04-02") })).toHaveFocus();
      await userEvent.keyboard("{Escape}");
      await expect(toggle).toHaveAttribute("aria-expanded", "false");
      await expect(input).toHaveFocus();
    });

    await step("clears the value when the field is emptied, without marking it invalid", async () => {
      await userEvent.clear(input);
      await userEvent.tab();
      await expect(args.onValueChange).toHaveBeenLastCalledWith(null);
      await expect(input).toBeValid();
    });
  },
};

/** A typed date outside `min` and `max`, or one `isDateUnavailable` rules out, is marked invalid like text that isn't a date. */
export const TypingOutOfRange: Story = {
  name: "Typing, out of range",
  args: { min: "2026-03-10", max: "2026-03-31" },
  render: (args) => <DateInputField {...args} />,
  play: async ({ args, canvas }) => {
    const input = canvas.getByRole("textbox", { name: "Date" });
    await userEvent.type(input, "03/05/2026");
    await userEvent.tab();
    await expect(input).toBeInvalid();
    await expect(args.onValueChange).not.toHaveBeenCalled();

    await userEvent.clear(input);
    await userEvent.type(input, "03/12/2026");
    await userEvent.tab();
    await expect(input).toBeValid();
    await expect(args.onValueChange).toHaveBeenCalledWith("2026-03-12");
  },
};

/** Enter in the field submits a surrounding form with the typed date. Text that isn't a date blocks submission, as `required` does while empty. */
export const TypingInForm: Story = {
  name: "Typing, in a form",
  args: { name: "date", required: true },
  render: (args) => (
    <form
      style={stack}
      onSubmit={(event) => {
        event.preventDefault();
        args.onFormSubmit(Object.fromEntries(new FormData(event.currentTarget)));
      }}
    >
      <DateInputField {...args} />
      <div>
        <Button type="submit">Submit</Button>
      </div>
    </form>
  ),
  play: async ({ args, canvas, step }) => {
    const input = canvas.getByRole("textbox", { name: "Date" });

    await step("blocks submission while empty, and moves focus to the field", async () => {
      await userEvent.click(canvas.getByRole("button", { name: "Submit" }));
      await expect(args.onFormSubmit).not.toHaveBeenCalled();
      await expect(input).toHaveFocus();
    });

    await step("blocks submission while the text isn't a date", async () => {
      await userEvent.type(input, "soon{Enter}");
      await expect(args.onFormSubmit).not.toHaveBeenCalled();
      await expect(input).toBeInvalid();
    });

    await step("submits the typed date as YYYY-MM-DD on Enter", async () => {
      await userEvent.clear(input);
      await userEvent.type(input, "3/14/26{Enter}");
      await expect(args.onFormSubmit).toHaveBeenCalledTimes(1);
      await expect(args.onFormSubmit).toHaveBeenCalledWith({ date: "2026-03-14" });
    });
  },
};

/** A form reset puts the field's text back to the `defaultValue`, clearing what was typed. */
export const TypingFormReset: Story = {
  name: "Typing, form reset",
  args: { defaultValue: "2026-03-14" },
  render: (args) => (
    <form style={stack}>
      <DateInputField {...args} />
      <div>
        <Button type="reset" variant="secondary">
          Reset
        </Button>
      </div>
    </form>
  ),
  play: async ({ canvas }) => {
    const input = canvas.getByRole("textbox", { name: "Date" });
    await expect(input).toHaveValue("03/14/2026");
    await userEvent.clear(input);
    await userEvent.type(input, "nope");
    await userEvent.tab();
    await expect(input).toBeInvalid();

    await userEvent.click(canvas.getByRole("button", { name: "Reset" }));
    await expect(input).toHaveValue("03/14/2026");
    await expect(input).toBeValid();
  },
};

/** The field follows the locale's numeric date format. */
export const TypingLocale: Story = {
  name: "Typing, locale",
  args: { locale: "de-DE", label: "Datum" },
  render: (args) => <DateInputField {...args} />,
  play: async ({ args, canvas }) => {
    const input = canvas.getByRole("textbox", { name: "Datum" });
    await expect(input).toHaveAttribute("placeholder", "dd.mm.yyyy");
    await userEvent.type(input, "14.3.2026");
    await userEvent.tab();
    await expect(args.onValueChange).toHaveBeenCalledWith("2026-03-14");
    await expect(input).toHaveValue("14.03.2026");
  },
};

export const TypingSizes: Story = {
  name: "Typing, sizes",
  args: { defaultValue: "2026-03-14" },
  render: (args) => (
    <div style={stack}>
      <DateInputField {...args} label="Small" input={{ size: "sm" }} />
      <DateInputField {...args} label="Medium" input={{ size: "md" }} />
      <DateInputField {...args} label="Large" input={{ size: "lg" }} />
    </div>
  ),
};
