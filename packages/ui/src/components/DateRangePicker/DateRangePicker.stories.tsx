import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, waitFor } from "storybook/test";
import { dayOfWeek, formatDate, formatDateRange, today } from "@/lib/calendar-date";
import { Button } from "@/components/Button/Button";
import { Field } from "@/components/Field/Field";
import { FieldDescription } from "@/components/Field/parts/FieldDescription";
import { FieldLabel } from "@/components/Field/parts/FieldLabel";
import { Modal } from "@/components/Modal/Modal";
import { ModalContent } from "@/components/Modal/parts/ModalContent";
import { ModalTitle } from "@/components/Modal/parts/ModalTitle";
import { ModalTrigger } from "@/components/Modal/parts/ModalTrigger";
import { DateRangePicker } from "./DateRangePicker";
import type { DateRangePickerProps } from "./DateRangePicker.types";
import { DateRangePickerContent } from "./parts/DateRangePickerContent";
import { DateRangePickerInput } from "./parts/DateRangePickerInput";
import type { DateRangePickerInputProps } from "./parts/DateRangePickerInput.types";
import { DateRangePickerTrigger } from "./parts/DateRangePickerTrigger";
import type { DateRangePickerTriggerProps } from "./parts/DateRangePickerTrigger.types";

// Stories are excluded from Tailwind's source scan, so layout here uses inline styles.
const stack = { display: "grid", gap: 20, maxWidth: 360 } as const;
const field = { display: "grid", gap: 6, maxWidth: 360, fontWeight: 600 } as const;

type DateRangePickerStoryArgs = DateRangePickerProps & {
  label?: string;
  trigger?: Omit<DateRangePickerTriggerProps, "ref">;
  input?: Omit<DateRangePickerInputProps, "ref">;
  onFormSubmit: (data: Record<string, FormDataEntryValue>) => void;
};

// Called as functions, not rendered as <RangeField>, so a story returns the DateRangePicker itself
// and the docs' "Show code" snippet shows how it's composed rather than a helper component. The
// label's id comes from the story's, so it stays unique when the docs page renders every story at once.
function rangeField(
  { label = "Dates", trigger, input: _input, onFormSubmit: _, ...args }: Partial<DateRangePickerStoryArgs>,
  id: string,
) {
  return (
    <div style={field}>
      <label htmlFor={id}>{label}</label>
      <DateRangePicker {...args}>
        <DateRangePickerTrigger placeholder="Pick dates" {...trigger} id={id} />
        <DateRangePickerContent />
      </DateRangePicker>
    </div>
  );
}

// The same field with a DateRangePickerInput, for typing the dates. The visible label names the
// group of fields; the fields are named "Start date" and "End date".
function rangeInputField(
  { label = "Dates", input, trigger: _trigger, onFormSubmit: _, ...args }: Partial<DateRangePickerStoryArgs>,
  labelId: string,
) {
  return (
    <div style={field}>
      <span id={labelId}>{label}</span>
      <DateRangePicker {...args}>
        <DateRangePickerInput aria-labelledby={labelId} {...input} />
        <DateRangePickerContent />
      </DateRangePicker>
    </div>
  );
}

// The names the calendar gives its days and its trigger's text, in the stories' en-US locale.
const dayName = (date: string) =>
  formatDate(date, "en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
const rangeText = (start: string, end: string) => formatDateRange(start, end, "en-US", { dateStyle: "medium" });
// A day in the current month, for stories that open on today.
const thisMonth = (day: number) => `${today().slice(0, 8)}${String(day).padStart(2, "0")}`;

const meta = {
  title: "Forms/DateRangePicker",
  component: DateRangePicker,
  tags: ["autodocs"],
  parameters: {
    design: { type: "figma", url: "https://www.figma.com/design/gVJvJJAOtJkcdeBHk61Ivb/Keyline?node-id=27-80" },
  },
  // A fixed locale keeps the day names the tests look for, and the first day of the week, the same
  // on every machine.
  args: { locale: "en-US", onValueChange: fn(), onOpenChange: fn(), onFormSubmit: fn() },
  argTypes: {
    value: { control: false },
    defaultValue: { control: false },
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
  render: (args, { id }) => rangeField(args, id),
} satisfies Meta<DateRangePickerStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ args, canvas, canvasElement, step }) => {
    const trigger = canvas.getByRole("combobox", { name: "Dates" });
    const day = (date: string) => canvas.getByRole("button", { name: dayName(date) });
    const cell = (date: string) => day(date).closest("td")!;

    await step("is a collapsed combobox that pops up a dialog, showing its placeholder", async () => {
      await expect(trigger).toHaveAttribute("type", "button");
      await expect(trigger).toHaveAttribute("aria-haspopup", "dialog");
      await expect(trigger).toHaveAttribute("aria-expanded", "false");
      await expect(trigger).toHaveTextContent("Pick dates");
    });

    await step("opens on click, named by the trigger's label, with focus on today", async () => {
      await userEvent.click(trigger);
      await expect(canvas.getByRole("dialog", { name: "Dates" })).toBeInTheDocument();
      await expect(day(today())).toHaveFocus();
    });

    await step("starts the range on the first click, staying open", async () => {
      await userEvent.click(day(thisMonth(10)));
      await expect(trigger).toHaveAttribute("aria-expanded", "true");
      await expect(args.onValueChange).not.toHaveBeenCalled();
      await expect(cell(thisMonth(10))).toHaveAttribute("aria-selected", "true");
    });

    await step("previews the range out to the hovered day, without marking it selected", async () => {
      await userEvent.hover(day(thisMonth(14)));
      await expect(cell(thisMonth(12))).toHaveAttribute("data-in-range");
      await expect(cell(thisMonth(12))).toHaveAttribute("aria-selected", "false");
    });

    await step("ends the range on the second click, closes, and returns focus to the trigger", async () => {
      await userEvent.click(day(thisMonth(14)));
      await expect(args.onValueChange).toHaveBeenCalledTimes(1);
      await expect(args.onValueChange).toHaveBeenCalledWith({ start: thisMonth(10), end: thisMonth(14) });
      await expect(trigger).toHaveAttribute("aria-expanded", "false");
      await expect(trigger).toHaveTextContent(rangeText(thisMonth(10), thisMonth(14)));
      await expect(trigger).toHaveFocus();
    });

    await step("reopens on the range's start, with every day of the range selected", async () => {
      await userEvent.click(trigger);
      await expect(day(thisMonth(10))).toHaveFocus();
      for (const date of [10, 12, 14]) await expect(cell(thisMonth(date))).toHaveAttribute("aria-selected", "true");
      await expect(cell(thisMonth(15))).toHaveAttribute("aria-selected", "false");
    });

    await step("orders the ends when the second is before the first", async () => {
      await userEvent.click(day(thisMonth(20)));
      await userEvent.click(day(thisMonth(5)));
      await expect(args.onValueChange).toHaveBeenLastCalledWith({ start: thisMonth(5), end: thisMonth(20) });
    });

    await step("picks a one-day range with two clicks on the same day", async () => {
      await userEvent.click(trigger);
      await userEvent.click(day(thisMonth(8)));
      await userEvent.click(day(thisMonth(8)));
      await expect(args.onValueChange).toHaveBeenLastCalledWith({ start: thisMonth(8), end: thisMonth(8) });
    });

    await step("drops a half-picked range when closed with a click outside", async () => {
      await userEvent.click(trigger);
      await userEvent.click(day(thisMonth(3)));
      await userEvent.click(canvasElement);
      await expect(trigger).toHaveAttribute("aria-expanded", "false");
      await expect(args.onValueChange).toHaveBeenCalledTimes(3);
      await userEvent.click(trigger);
      await expect(cell(thisMonth(3))).toHaveAttribute("aria-selected", "false");
    });
  },
};

export const Keyboard: Story = {
  args: { defaultValue: { start: "2026-03-10", end: "2026-03-14" } },
  play: async ({ args, canvas, step }) => {
    const trigger = canvas.getByRole("combobox", { name: "Dates" });
    const day = (date: string) => canvas.getByRole("button", { name: dayName(date) });

    await step("shows the range in the trigger, and opens with Enter on its start", async () => {
      await expect(trigger).toHaveTextContent("Mar 10 – 14, 2026");
      await userEvent.tab();
      await userEvent.keyboard("{Enter}");
      await expect(day("2026-03-10")).toHaveFocus();
    });

    await step("starts the range with Enter, and previews it out to the focused day", async () => {
      await userEvent.keyboard("{Enter}{ArrowDown}");
      await expect(day("2026-03-17")).toHaveFocus();
      await expect(day("2026-03-13").closest("td")).toHaveAttribute("data-in-range");
    });

    await step("ends the range with Enter, across months", async () => {
      await userEvent.keyboard("{PageDown}{Enter}");
      await expect(args.onValueChange).toHaveBeenCalledWith({ start: "2026-03-10", end: "2026-04-17" });
      await expect(trigger).toHaveTextContent("Mar 10 – Apr 17, 2026");
      await expect(trigger).toHaveFocus();
    });

    await step("drops a half-picked range on Escape", async () => {
      await userEvent.keyboard("{Enter}{ArrowRight}{Enter}{Escape}");
      await expect(trigger).toHaveAttribute("aria-expanded", "false");
      await expect(args.onValueChange).toHaveBeenCalledTimes(1);
    });
  },
};

const isWeekend = (date: string) => dayOfWeek(date) === 0 || dayOfWeek(date) === 6;

/**
 * `isDateUnavailable` rules dates out, here weekends. They can't be either end of a range, and a
 * range can't take them in: once the start is picked, the days past the nearest unavailable ones
 * are disabled. `min` and `max` work as in DatePicker.
 */
export const UnavailableDates: Story = {
  name: "Unavailable dates",
  args: { defaultValue: { start: "2026-03-09", end: "2026-03-13" }, isDateUnavailable: isWeekend },
  play: async ({ args, canvas, step }) => {
    const trigger = canvas.getByRole("combobox", { name: "Dates" });
    const day = (date: string) => canvas.getByRole("button", { name: dayName(date) });
    const cell = (date: string) => day(date).closest("td")!;

    await step("ignores clicks on unavailable days", async () => {
      await userEvent.click(trigger);
      await userEvent.click(day("2026-03-14"));
      await expect(cell("2026-03-14")).toHaveAttribute("aria-selected", "false");
    });

    await step("disables the days past the nearest unavailable ones once the start is picked", async () => {
      await userEvent.click(day("2026-03-12"));
      await expect(day("2026-03-16")).toHaveAttribute("aria-disabled", "true");
      await expect(day("2026-03-06")).toHaveAttribute("aria-disabled", "true");
      await expect(day("2026-03-09")).not.toHaveAttribute("aria-disabled");
      await expect(day("2026-03-13")).not.toHaveAttribute("aria-disabled");
    });

    await step("stops the preview short of the unavailable days", async () => {
      await userEvent.hover(day("2026-03-17"));
      await expect(cell("2026-03-13")).toHaveAttribute("data-range-end");
      await expect(cell("2026-03-16")).not.toHaveAttribute("data-in-range");
    });

    await step("won't end the range past them, but will within them", async () => {
      await userEvent.click(day("2026-03-16"));
      await expect(args.onValueChange).not.toHaveBeenCalled();
      await userEvent.click(day("2026-03-09"));
      await expect(args.onValueChange).toHaveBeenCalledWith({ start: "2026-03-09", end: "2026-03-12" });
    });

    await step("enables every available day again for the next range", async () => {
      await userEvent.click(trigger);
      await expect(day("2026-03-16")).not.toHaveAttribute("aria-disabled");
    });
  },
};

/** `allowUnavailableInRange` lets a range run across unavailable dates, which then only can't be its ends: weekends in a range of working days. */
export const AcrossUnavailableDates: Story = {
  name: "Across unavailable dates",
  args: { defaultValue: { start: "2026-03-09", end: "2026-03-13" }, isDateUnavailable: isWeekend, allowUnavailableInRange: true },
  play: async ({ args, canvas }) => {
    const day = (date: string) => canvas.getByRole("button", { name: dayName(date) });
    await userEvent.click(canvas.getByRole("combobox", { name: "Dates" }));
    await userEvent.click(day("2026-03-12"));
    await expect(day("2026-03-16")).not.toHaveAttribute("aria-disabled");
    await userEvent.click(day("2026-03-15"));
    await expect(args.onValueChange).not.toHaveBeenCalled();
    await userEvent.click(day("2026-03-17"));
    await expect(args.onValueChange).toHaveBeenCalledWith({ start: "2026-03-12", end: "2026-03-17" });
  },
};

/** A typed range can't take in unavailable dates either: the end is marked invalid. */
export const TypingUnavailableDates: Story = {
  name: "Typing, unavailable dates",
  args: { isDateUnavailable: isWeekend },
  render: (args, { id }) => rangeInputField(args, id),
  play: async ({ args, canvas }) => {
    const start = canvas.getByRole("textbox", { name: "Start date" });
    const end = canvas.getByRole("textbox", { name: "End date" });
    await userEvent.type(start, "3/12/2026");
    await userEvent.type(end, "3/17/2026");
    await userEvent.tab();
    await expect(end).toBeInvalid();
    await expect(start).toBeValid();
    await expect(args.onValueChange).not.toHaveBeenCalled();

    await userEvent.clear(end);
    await userEvent.type(end, "3/13/2026");
    await userEvent.tab();
    await expect(end).toBeValid();
    await expect(args.onValueChange).toHaveBeenCalledWith({ start: "2026-03-12", end: "2026-03-13" });
  },
};

/**
 * DateRangePickerInput takes the place of the trigger, so the dates can be typed as well as
 * picked. Each field reads dates as DatePickerInput does; the range takes effect once both hold
 * dates.
 */
export const Typing: Story = {
  render: (args, { id }) => rangeInputField(args, id),
  play: async ({ args, canvas, step }) => {
    const group = canvas.getByRole("group", { name: "Dates" });
    const start = canvas.getByRole("textbox", { name: "Start date" });
    const end = canvas.getByRole("textbox", { name: "End date" });
    const toggle = canvas.getByRole("button", { name: "Choose dates" });

    await step("is a group of two fields named by the label, with a button that pops up the calendar", async () => {
      await expect(group).toContainElement(start);
      await expect(group).toContainElement(end);
      await expect(start).toHaveAttribute("placeholder", "mm/dd/yyyy");
      await expect(toggle).toHaveAttribute("aria-haspopup", "dialog");
    });

    await step("puts the box's space after the end date in the end field, so a click there focuses it", async () => {
      const box = toggle.getBoundingClientRect();
      const beforeToggle = document.elementFromPoint(box.left - 4, box.top + box.height / 2);
      await expect(beforeToggle).toBe(end);
    });

    await step("keeps a typed start until the end is typed too", async () => {
      await userEvent.type(start, "3/10/2026");
      await userEvent.tab();
      await expect(end).toHaveFocus();
      await expect(start).toHaveValue("03/10/2026");
      await expect(args.onValueChange).not.toHaveBeenCalled();
    });

    await step("takes the range once both fields hold dates", async () => {
      await userEvent.type(end, "3/14/2026");
      await userEvent.tab();
      await expect(args.onValueChange).toHaveBeenCalledWith({ start: "2026-03-10", end: "2026-03-14" });
      await expect(end).toHaveValue("03/14/2026");
    });

    await step("marks an end before the start invalid, and clears the value", async () => {
      await userEvent.clear(end);
      await userEvent.type(end, "3/1/2026");
      await userEvent.tab();
      await expect(end).toBeInvalid();
      await expect(start).toBeValid();
      await expect(args.onValueChange).toHaveBeenLastCalledWith(null);
    });

    await step("opens the calendar on the typed range, named by the group's label", async () => {
      await userEvent.clear(end);
      await userEvent.type(end, "3/16/2026");
      await userEvent.click(toggle);
      await expect(args.onValueChange).toHaveBeenLastCalledWith({ start: "2026-03-10", end: "2026-03-16" });
      await expect(canvas.getByRole("dialog", { name: "Dates" })).toBeInTheDocument();
      await expect(canvas.getByRole("button", { name: dayName("2026-03-10") })).toHaveFocus();
    });

    await step("fills in both fields from a range picked in the calendar", async () => {
      await userEvent.click(canvas.getByRole("button", { name: dayName("2026-03-02") }));
      await userEvent.click(canvas.getByRole("button", { name: dayName("2026-03-06") }));
      await expect(args.onValueChange).toHaveBeenLastCalledWith({ start: "2026-03-02", end: "2026-03-06" });
      await expect(start).toHaveValue("03/02/2026");
      await expect(end).toHaveValue("03/06/2026");
      await expect(start).toHaveFocus();
    });
  },
};

/** Inside a Field, the FieldLabel names the group of fields and the FieldDescription describes them. */
export const TypingInField: Story = {
  name: "Typing, in a field",
  render: ({ onFormSubmit: _, label: __, trigger: ___, input: ____, ...args }) => (
    <Field style={{ maxWidth: 360 }}>
      <FieldLabel>Trip dates</FieldLabel>
      <DateRangePicker {...args}>
        <DateRangePickerInput />
        <DateRangePickerContent />
      </DateRangePicker>
      <FieldDescription>Check-in and check-out.</FieldDescription>
    </Field>
  ),
  play: async ({ canvas }) => {
    const start = canvas.getByRole("textbox", { name: "Start date" });
    await expect(canvas.getByRole("group", { name: "Trip dates" })).toContainElement(start);
    await expect(start).toHaveAccessibleDescription("Check-in and check-out.");
    await userEvent.click(canvas.getByText("Trip dates"));
    await expect(start).toHaveFocus();
  },
};

/** `startName` and `endName` submit the ends as `YYYY-MM-DD` with a form, and `required` blocks submission until a range is picked. */
export const InForm: Story = {
  name: "In a form",
  args: { startName: "checkIn", endName: "checkOut", required: true },
  render: (args, { id }) => (
    <form
      style={stack}
      onSubmit={(event) => {
        event.preventDefault();
        args.onFormSubmit(Object.fromEntries(new FormData(event.currentTarget)));
      }}
    >
      {rangeField(args, id)}
      <div>
        <Button type="submit">Submit</Button>
      </div>
    </form>
  ),
  play: async ({ args, canvas, step }) => {
    const trigger = canvas.getByRole("combobox", { name: "Dates" });
    const submit = canvas.getByRole("button", { name: "Submit" });

    await step("blocks submission while empty, and moves focus to the trigger", async () => {
      await userEvent.click(submit);
      await expect(args.onFormSubmit).not.toHaveBeenCalled();
      await expect(trigger).toHaveFocus();
    });

    await step("submits both ends under their names", async () => {
      await userEvent.click(trigger);
      await userEvent.click(canvas.getByRole("button", { name: dayName(thisMonth(4)) }));
      await userEvent.click(canvas.getByRole("button", { name: dayName(thisMonth(9)) }));
      await userEvent.click(submit);
      await expect(args.onFormSubmit).toHaveBeenCalledWith({ checkIn: thisMonth(4), checkOut: thisMonth(9) });
    });
  },
};

/** Enter in either field submits a surrounding form with the typed range. A form reset puts both fields back. */
export const TypingInForm: Story = {
  name: "Typing, in a form",
  args: { startName: "checkIn", endName: "checkOut", defaultValue: { start: "2026-03-10", end: "2026-03-14" } },
  render: (args, { id }) => (
    <form
      style={stack}
      onSubmit={(event) => {
        event.preventDefault();
        args.onFormSubmit(Object.fromEntries(new FormData(event.currentTarget)));
      }}
    >
      {rangeInputField(args, id)}
      <div style={{ display: "flex", gap: 12 }}>
        <Button type="reset" variant="secondary">
          Reset
        </Button>
        <Button type="submit">Submit</Button>
      </div>
    </form>
  ),
  play: async ({ args, canvas, step }) => {
    const start = canvas.getByRole("textbox", { name: "Start date" });
    const end = canvas.getByRole("textbox", { name: "End date" });

    await step("submits the typed range on Enter", async () => {
      await userEvent.clear(end);
      await userEvent.type(end, "3/20/2026{Enter}");
      await expect(args.onFormSubmit).toHaveBeenCalledWith({ checkIn: "2026-03-10", checkOut: "2026-03-20" });
    });

    await step("puts both fields back on reset", async () => {
      await userEvent.clear(start);
      await userEvent.type(start, "nope");
      await userEvent.tab();
      await expect(start).toBeInvalid();
      await userEvent.click(canvas.getByRole("button", { name: "Reset" }));
      await expect(start).toHaveValue("03/10/2026");
      await expect(end).toHaveValue("03/14/2026");
      await expect(start).toBeValid();
    });
  },
};

export const Sizes: Story = {
  args: { defaultValue: { start: "2026-03-10", end: "2026-03-14" } },
  render: (args, { id }) => (
    <div style={stack}>
      {rangeField({ ...args, label: "Small", trigger: { size: "sm" } }, `${id}-small`)}
      {rangeInputField({ ...args, label: "Small, typed", input: { size: "sm" } }, `${id}-small-typed`)}
      {rangeField({ ...args, label: "Medium", trigger: { size: "md" } }, `${id}-medium`)}
      {rangeInputField({ ...args, label: "Medium, typed", input: { size: "md" } }, `${id}-medium-typed`)}
      {rangeField({ ...args, label: "Large", trigger: { size: "lg" } }, `${id}-large`)}
      {rangeInputField({ ...args, label: "Large, typed", input: { size: "lg" } }, `${id}-large-typed`)}
    </div>
  ),
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: { start: "2026-03-10", end: "2026-03-14" } },
  render: (args, { id }) => (
    <div style={stack}>
      {rangeField(args, id)}
      {rangeInputField({ ...args, label: "Typed" }, `${id}-typed`)}
    </div>
  ),
  play: async ({ args, canvas }) => {
    const trigger = canvas.getByRole("combobox", { name: "Dates" });
    await expect(trigger).toBeDisabled();
    await expect(canvas.getByRole("textbox", { name: "Start date" })).toBeDisabled();
    await expect(canvas.getByRole("button", { name: "Choose dates" })).toBeDisabled();
    await userEvent.click(trigger);
    await expect(args.onOpenChange).not.toHaveBeenCalled();
  },
};

/** Inside a Modal, Escape closes the open calendar first and leaves the Modal open. */
export const InModal: Story = {
  name: "In a modal",
  render: (args, { id }) => (
    <Modal>
      <ModalTrigger>Book a stay</ModalTrigger>
      <ModalContent>
        <ModalTitle>Book a stay</ModalTitle>
        {rangeField(args, id)}
      </ModalContent>
    </Modal>
  ),
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Book a stay" }));
    const dialog = canvas.getByRole("dialog", { name: "Book a stay" }) as HTMLDialogElement;
    const trigger = canvas.getByRole("combobox", { name: "Dates" });

    await userEvent.click(trigger);
    await userEvent.keyboard("{Escape}");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await expect(dialog.open).toBe(true);

    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(dialog.open).toBe(false));
  },
};

/** Open on a range, so axe checks the band and its ends in light mode. */
export const Open: Story = {
  args: { defaultValue: { start: "2026-03-10", end: "2026-03-18" } },
  render: (args, { id }) => rangeInputField(args, id),
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Choose dates" }));
    await expect(canvas.getByRole("dialog")).toBeInTheDocument();
  },
};

/** Dark mode swaps the semantic tokens, so contrast is checked here too, with the calendar open. */
export const OpenDark: Story = {
  name: "Open (dark)",
  args: Open.args,
  render: Open.render,
  globals: { theme: "dark" },
  play: async (context) => {
    // Guards the contrast check: if the theme global stops applying, this story would silently test light mode.
    await expect(document.documentElement).toHaveAttribute("data-theme", "dark");
    await Open.play!(context);
  },
};
