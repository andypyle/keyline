import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect, useId, useState } from "react";
import { expect, fn, userEvent, waitFor } from "storybook/test";
import { Button } from "../Button/Button";
import { Modal } from "../Modal/Modal";
import { ModalContent } from "../Modal/parts/ModalContent";
import { ModalTitle } from "../Modal/parts/ModalTitle";
import { ModalTrigger } from "../Modal/parts/ModalTrigger";
import { Combobox } from "./Combobox";
import type { ComboboxProps } from "./Combobox.types";
import { ComboboxContent } from "./parts/ComboboxContent";
import { ComboboxGroup } from "./parts/ComboboxGroup";
import { ComboboxInput } from "./parts/ComboboxInput";
import type { ComboboxInputProps } from "./parts/ComboboxInput.types";
import { ComboboxItem } from "./parts/ComboboxItem";
import { ComboboxLabel } from "./parts/ComboboxLabel";
import { ComboboxSeparator } from "./parts/ComboboxSeparator";

// Stories are excluded from Tailwind's source scan, so layout here uses inline styles.
const stack = { display: "grid", gap: 20, maxWidth: 360 } as const;
const field = { display: "grid", gap: 6, maxWidth: 360, fontWeight: 600 } as const;
const hint = { fontSize: 14, fontWeight: 400 } as const;

const COUNTRIES = [
  "Antarctica",
  "Argentina",
  "Australia",
  "Austria",
  "Belgium",
  "Brazil",
  "Canada",
  "Chile",
  "Côte d'Ivoire",
  "Denmark",
  "Finland",
  "France",
  "Germany",
  "Iceland",
  "Ireland",
  "Japan",
  "México",
  "Netherlands",
  "New Zealand",
  "Norway",
  "Poland",
  "Portugal",
  "Spain",
  "Sweden",
  "Switzerland",
  "Thailand",
  "United Kingdom",
];

const fold = (text: string) => text.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
const toValue = (country: string) => fold(country).replace(/[^a-z]+/g, "-");

type ComboboxStoryArgs = ComboboxProps & {
  label?: string;
  input?: Omit<ComboboxInputProps, "ref">;
  onFormSubmit: (data: Record<string, FormDataEntryValue>) => void;
};

function CountryCombobox({ label = "Country", input, onFormSubmit: _, ...args }: Partial<ComboboxStoryArgs>) {
  const id = useId();
  return (
    <div style={field}>
      <label htmlFor={id}>{label}</label>
      <Combobox {...args}>
        <ComboboxInput placeholder="Start typing…" {...input} id={id} />
        <ComboboxContent>
          {COUNTRIES.map((country) => (
            // Antarctica has no country code, so it can't be picked.
            <ComboboxItem key={country} value={toValue(country)} disabled={country === "Antarctica"}>
              {country}
            </ComboboxItem>
          ))}
        </ComboboxContent>
      </Combobox>
    </div>
  );
}

const meta = {
  title: "Components/Combobox",
  component: Combobox,
  tags: ["autodocs"],
  args: { onValueChange: fn(), onOpenChange: fn(), onFormSubmit: fn() },
  argTypes: {
    value: { control: false },
    open: { control: false },
    defaultOpen: { control: false },
    filter: { control: false },
    disabled: { control: "boolean" },
    label: { table: { disable: true } },
    input: { table: { disable: true } },
    onFormSubmit: { table: { disable: true } },
  },
  render: (args) => <CountryCombobox {...args} />,
} satisfies Meta<ComboboxStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ args, canvas, step }) => {
    const input = canvas.getByRole("combobox", { name: "Country" });
    const option = (name: string) => canvas.getByRole("option", { name });
    const options = () => canvas.queryAllByRole("option").map((o) => o.textContent);
    const expectActive = (name: string) => expect(input).toHaveAttribute("aria-activedescendant", option(name).id);

    await step("is a collapsed text combobox with list autocomplete", async () => {
      await expect(input).toHaveAttribute("type", "text");
      await expect(input).toHaveAttribute("aria-autocomplete", "list");
      await expect(input).toHaveAttribute("autocomplete", "off");
      await expect(input).toHaveAttribute("aria-expanded", "false");
      await expect(canvas.queryByRole("listbox")).not.toBeInTheDocument();
    });

    await step("filters the list as you type, highlighting the first match", async () => {
      input.focus();
      await userEvent.keyboard("lan");
      await expect(input).toHaveAttribute("aria-expanded", "true");
      await expect(canvas.getByRole("listbox", { name: "Country" })).toBeInTheDocument();
      await expect(options()).toEqual([
        "Finland",
        "Iceland",
        "Ireland",
        "Netherlands",
        "New Zealand",
        "Poland",
        "Switzerland",
        "Thailand",
      ]);
      await expectActive("Finland");
      await expect(input).toHaveFocus();
    });

    await step("picks the highlighted match with Enter and shows its text", async () => {
      await userEvent.keyboard("{ArrowDown}{Enter}");
      await expect(args.onValueChange).toHaveBeenCalledTimes(1);
      await expect(args.onValueChange).toHaveBeenCalledWith("iceland");
      await expect(input).toHaveValue("Iceland");
      await expect(input).toHaveAttribute("aria-expanded", "false");
    });

    await step("opens the full list on click, with the selected option highlighted", async () => {
      await userEvent.click(input);
      await expect(options()).toHaveLength(COUNTRIES.length);
      await expect(option("Iceland")).toHaveAttribute("aria-selected", "true");
      await expectActive("Iceland");
    });

    await step("ignores case and accents", async () => {
      await userEvent.clear(input);
      await userEvent.keyboard("MEXI");
      await expect(options()).toEqual(["México"]);
      await userEvent.clear(input);
      await userEvent.keyboard("cote");
      await expect(options()).toEqual(["Côte d'Ivoire"]);
    });

    await step("picks an option on click, keeping focus in the input", async () => {
      await userEvent.click(option("Côte d'Ivoire"));
      await expect(args.onValueChange).toHaveBeenLastCalledWith("cote-d-ivoire");
      await expect(input).toHaveValue("Côte d'Ivoire");
      await expect(input).toHaveFocus();
    });

    await step("closes on Escape, putting back the selected option's text", async () => {
      await userEvent.clear(input);
      await userEvent.keyboard("swe{Escape}");
      await expect(input).toHaveAttribute("aria-expanded", "false");
      await expect(input).toHaveValue("Côte d'Ivoire");
      await expect(args.onValueChange).toHaveBeenCalledTimes(2);
    });
  },
};

export const Keyboard: Story = {
  play: async ({ canvas, step }) => {
    const input = canvas.getByRole("combobox", { name: "Country" });
    const option = (name: string) => canvas.getByRole("option", { name });
    const expectActive = (name: string) => expect(input).toHaveAttribute("aria-activedescendant", option(name).id);

    await step("opens the full list with ArrowDown, skipping the disabled first option", async () => {
      await userEvent.tab();
      await expect(input).toHaveFocus();
      await expect(input).toHaveAttribute("aria-expanded", "false");
      await userEvent.keyboard("{ArrowDown}");
      await expect(input).toHaveAttribute("aria-expanded", "true");
      await expectActive("Argentina");
    });

    await step("moves with the arrow keys, stopping at the ends", async () => {
      await userEvent.keyboard("{ArrowDown}{ArrowDown}");
      await expectActive("Austria");
      await userEvent.keyboard("{ArrowUp}{ArrowUp}{ArrowUp}");
      await expectActive("Argentina");
    });

    await step("moves through the filtered options only", async () => {
      await userEvent.keyboard("land");
      await expectActive("Finland");
      await userEvent.keyboard("{ArrowDown}{ArrowDown}{ArrowDown}");
      await expectActive("Netherlands");
    });

    await step("leaves Home and End to move the caret", async () => {
      await userEvent.keyboard("{Home}");
      await expectActive("Netherlands");
      await expect(input).toHaveProperty("selectionStart", 0);
    });

    await step("closes when Tab moves focus out", async () => {
      await userEvent.tab();
      await expect(input).not.toHaveFocus();
      await expect(input).toHaveAttribute("aria-expanded", "false");
    });
  },
};

/**
 * The value is always one of the options. Leaving the field picks an option its text names
 * exactly, clears the value if the text is empty, and otherwise puts back the selected option.
 */
export const LeavingTheField: Story = {
  name: "Leaving the field",
  args: { defaultValue: "japan" },
  play: async ({ args, canvas, step }) => {
    const input = canvas.getByRole("combobox", { name: "Country" });

    await step("shows the default value's text", async () => {
      await expect(input).toHaveValue("Japan");
    });

    await step("picks an option its text names exactly, ignoring case", async () => {
      await userEvent.clear(input);
      await userEvent.keyboard("norway");
      await userEvent.tab();
      await expect(args.onValueChange).toHaveBeenLastCalledWith("norway");
      await expect(input).toHaveValue("Norway");
    });

    await step("puts back the selected option when the text names none", async () => {
      await userEvent.clear(input);
      await userEvent.keyboard("nor");
      await userEvent.tab();
      await expect(input).toHaveValue("Norway");
      await expect(args.onValueChange).toHaveBeenCalledTimes(1);
    });

    await step("doesn't pick a disabled option by name", async () => {
      await userEvent.clear(input);
      await userEvent.keyboard("antarctica");
      await userEvent.tab();
      await expect(input).toHaveValue("Norway");
      await expect(args.onValueChange).toHaveBeenCalledTimes(1);
    });

    await step("clears the value when the text is emptied", async () => {
      await userEvent.clear(input);
      await userEvent.tab();
      await expect(args.onValueChange).toHaveBeenLastCalledWith(null);
      await expect(input).toHaveValue("");
    });
  },
};

export const NoMatches: Story = {
  name: "No matches",
  play: async ({ canvas }) => {
    const input = canvas.getByRole("combobox", { name: "Country" });
    input.focus();
    await userEvent.keyboard("atlantis");
    await expect(canvas.queryAllByRole("option")).toHaveLength(0);
    await expect(canvas.getByRole("status")).toHaveTextContent("No matches");
    await expect(input).not.toHaveAttribute("aria-activedescendant");
    // Enter with nothing highlighted doesn't pick anything, and puts back the (empty) value.
    await userEvent.keyboard("{Enter}");
    await expect(input).toHaveValue("");
    await expect(input).toHaveAttribute("aria-expanded", "false");
  },
};

/** The chevron opens and closes the full list. It's out of the tab order, since the input opens the list from the keyboard. */
export const Toggle: Story = {
  play: async ({ canvas }) => {
    const input = canvas.getByRole("combobox", { name: "Country" });
    const toggle = canvas.getByRole("button", { name: "Show options" });
    await expect(toggle).toHaveAttribute("tabindex", "-1");

    await userEvent.click(toggle);
    await expect(input).toHaveAttribute("aria-expanded", "true");
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
    await expect(input).toHaveFocus();

    await userEvent.click(toggle);
    await expect(input).toHaveAttribute("aria-expanded", "false");
    await expect(input).toHaveFocus();
  },
};

export const Sizes: Story = {
  render: (args) => (
    <div style={stack}>
      <CountryCombobox {...args} label="Small" input={{ size: "sm" }} />
      <CountryCombobox {...args} label="Medium" input={{ size: "md" }} />
      <CountryCombobox {...args} label="Large" input={{ size: "lg" }} />
    </div>
  ),
};

/** Pair `aria-invalid` with `aria-describedby` pointing at the message, so the error is announced with the field. */
export const Invalid: Story = {
  render: (args) => (
    <div style={field}>
      <CountryCombobox {...args} input={{ "aria-invalid": true, "aria-describedby": "country-error" }} />
      <span id="country-error" style={hint}>
        Pick the country you live in.
      </span>
    </div>
  ),
  play: async ({ canvas }) => {
    const input = canvas.getByRole("combobox", { name: "Country" });
    await expect(input).toBeInvalid();
    await expect(input).toHaveAccessibleDescription("Pick the country you live in.");
  },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: "canada" },
  play: async ({ args, canvas }) => {
    const input = canvas.getByRole("combobox", { name: "Country" });
    await expect(input).toBeDisabled();
    await expect(input).toHaveValue("Canada");
    await userEvent.click(canvas.getByRole("button", { name: "Show options" }));
    await expect(input).toHaveAttribute("aria-expanded", "false");
    await expect(args.onOpenChange).not.toHaveBeenCalled();
  },
};

/** `name` submits the value (not the text) with a form, and `required` blocks submission until something is picked. */
export const InForm: Story = {
  name: "In a form",
  args: { name: "country", required: true },
  render: (args) => (
    <form
      style={stack}
      onSubmit={(event) => {
        event.preventDefault();
        args.onFormSubmit(Object.fromEntries(new FormData(event.currentTarget)));
      }}
    >
      <CountryCombobox {...args} />
      <div>
        <Button type="submit">Submit</Button>
      </div>
    </form>
  ),
  play: async ({ args, canvas, step }) => {
    const input = canvas.getByRole("combobox", { name: "Country" });
    const submit = canvas.getByRole("button", { name: "Submit" });

    await step("blocks submission while empty, and moves focus to the input", async () => {
      await userEvent.click(submit);
      await expect(args.onFormSubmit).not.toHaveBeenCalled();
      await expect(input).toHaveFocus();
    });

    await step("doesn't submit while picking with Enter", async () => {
      await userEvent.keyboard("new{Enter}");
      await expect(input).toHaveValue("New Zealand");
      await expect(args.onFormSubmit).not.toHaveBeenCalled();
    });

    await step("submits the picked value under its name", async () => {
      await userEvent.click(submit);
      await expect(args.onFormSubmit).toHaveBeenCalledTimes(1);
      await expect(args.onFormSubmit).toHaveBeenCalledWith({ country: "new-zealand" });
    });
  },
};

const REGIONS = [
  { label: "Europe", countries: ["France", "Germany", "Ireland", "Norway", "Spain"] },
  { label: "Americas", countries: ["Argentina", "Brazil", "Canada", "Chile", "México"] },
  { label: "Asia-Pacific", countries: ["Australia", "Japan", "New Zealand", "Thailand"] },
];

/**
 * ComboboxGroup gathers related options under a ComboboxLabel. While filtering, a group with no
 * matches hides, label and all, and separators hide too.
 */
export const Groups: Story = {
  render: (args) => {
    const id = "region-country";
    return (
      <div style={field}>
        <label htmlFor={id}>Country</label>
        <Combobox {...args}>
          <ComboboxInput id={id} placeholder="Start typing…" />
          <ComboboxContent>
            {REGIONS.map((region, index) => (
              <ComboboxGroup key={region.label}>
                {index > 0 && <ComboboxSeparator />}
                <ComboboxLabel>{region.label}</ComboboxLabel>
                {region.countries.map((country) => (
                  <ComboboxItem key={country} value={toValue(country)}>
                    {country}
                  </ComboboxItem>
                ))}
              </ComboboxGroup>
            ))}
          </ComboboxContent>
        </Combobox>
      </div>
    );
  },
  play: async ({ canvas, canvasElement, step }) => {
    const input = canvas.getByRole("combobox", { name: "Country" });
    const groups = () => canvas.queryAllByRole("group");
    // Checked by the hidden attribute: toBeVisible would also fail while the list fades in.
    const separators = () => Array.from(canvasElement.querySelectorAll("[data-slot=combobox-separator]"));

    await step("shows every group, named by its label, with separators between", async () => {
      await userEvent.click(input);
      await expect(canvas.getByRole("group", { name: "Europe" })).toBeInTheDocument();
      await expect(canvas.getByRole("group", { name: "Americas" })).toBeInTheDocument();
      await expect(canvas.getByRole("group", { name: "Asia-Pacific" })).toBeInTheDocument();
      await expect(separators()).toHaveLength(2);
      for (const separator of separators()) await expect(separator).not.toHaveAttribute("hidden");
    });

    await step("hides groups without matches, and separators, while filtering", async () => {
      await userEvent.keyboard("land");
      await expect(groups()).toHaveLength(2);
      await expect(canvas.getByRole("group", { name: "Europe" })).toContainElement(
        canvas.getByRole("option", { name: "Ireland" }),
      );
      await expect(canvas.queryByRole("group", { name: "Americas" })).not.toBeInTheDocument();
      for (const separator of separators()) await expect(separator).toHaveAttribute("hidden");
    });

    await step("moves across groups with the arrow keys, passing over labels", async () => {
      await expect(input).toHaveAttribute("aria-activedescendant", canvas.getByRole("option", { name: "Ireland" }).id);
      await userEvent.keyboard("{ArrowDown}");
      await expect(input).toHaveAttribute(
        "aria-activedescendant",
        canvas.getByRole("option", { name: "New Zealand" }).id,
      );
    });
  },
};

/**
 * `allowCustomValue` lets the value be any text. Typing doesn't highlight a match, so Enter or
 * leaving the field keeps what was typed; ArrowDown still picks from the list.
 */
export const CustomValue: Story = {
  name: "Custom value",
  args: { allowCustomValue: true },
  render: (args) => {
    const id = "city";
    return (
      <div style={field}>
        <label htmlFor={id}>City</label>
        <Combobox {...args}>
          <ComboboxInput id={id} placeholder="Pick or type a city" />
          <ComboboxContent empty="No suggestions; press Enter to use what you typed">
            {["Amsterdam", "Berlin", "Lisbon", "Madrid", "Oslo", "Paris"].map((city) => (
              <ComboboxItem key={city} value={city.toLowerCase()}>
                {city}
              </ComboboxItem>
            ))}
          </ComboboxContent>
        </Combobox>
      </div>
    );
  },
  play: async ({ args, canvas, step }) => {
    const input = canvas.getByRole("combobox", { name: "City" });

    await step("keeps typed text with Enter, without highlighting a match", async () => {
      input.focus();
      await userEvent.keyboard("Lis");
      await expect(canvas.getByRole("option", { name: "Lisbon" })).toBeInTheDocument();
      await expect(input).not.toHaveAttribute("aria-activedescendant");
      await userEvent.keyboard("{Enter}");
      await expect(args.onValueChange).toHaveBeenLastCalledWith("Lis");
      await expect(input).toHaveValue("Lis");
      await expect(input).toHaveAttribute("aria-expanded", "false");
    });

    await step("picks an option with ArrowDown and Enter", async () => {
      await userEvent.clear(input);
      await userEvent.keyboard("par{ArrowDown}{Enter}");
      await expect(args.onValueChange).toHaveBeenLastCalledWith("paris");
      await expect(input).toHaveValue("Paris");
    });

    await step("keeps text that names no option when leaving the field", async () => {
      await userEvent.clear(input);
      await userEvent.keyboard("Kraków");
      await expect(canvas.getByRole("status")).toHaveTextContent("No suggestions");
      await userEvent.tab();
      await expect(args.onValueChange).toHaveBeenLastCalledWith("Kraków");
      await expect(input).toHaveValue("Kraków");
    });

    await step("still picks an option its text names exactly", async () => {
      await userEvent.clear(input);
      await userEvent.keyboard("oslo");
      await userEvent.tab();
      await expect(args.onValueChange).toHaveBeenLastCalledWith("oslo");
      await expect(input).toHaveValue("Oslo");
    });
  },
};

// Stands in for a server: answers after a delay with the countries matching the query.
function useCountrySearch(query: string) {
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setResults(COUNTRIES.filter((country) => fold(country).includes(fold(query))).slice(0, 8));
      setLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);
  return { results, loading };
}

function AsyncCountryCombobox(args: Partial<ComboboxStoryArgs>) {
  const [query, setQuery] = useState("");
  const { results, loading } = useCountrySearch(query);
  return (
    <div style={field}>
      <label htmlFor="async-country">Country</label>
      <Combobox {...args} filter={false} onQueryChange={setQuery}>
        <ComboboxInput id="async-country" placeholder="Search countries…" />
        <ComboboxContent loading={loading}>
          {results.map((country) => (
            <ComboboxItem key={country} value={toValue(country)} disabled={country === "Antarctica"}>
              {country}
            </ComboboxItem>
          ))}
        </ComboboxContent>
      </Combobox>
    </div>
  );
}

/**
 * To load options as the user types, pass `filter={false}` and fetch in `onQueryChange`, showing
 * `loading` on ComboboxContent meanwhile. The selected option's text is remembered after it drops
 * out of the results.
 */
export const LoadingOptions: Story = {
  name: "Loading options",
  render: (args) => <AsyncCountryCombobox {...args} />,
  play: async ({ args, canvas, step }) => {
    const input = canvas.getByRole("combobox", { name: "Country" });
    const options = () => canvas.queryAllByRole("option").map((option) => option.textContent);

    await step("announces loading, then highlights the first result", async () => {
      input.focus();
      await userEvent.keyboard("nor");
      await expect(canvas.getByRole("status")).toHaveTextContent("Loading…");
      await waitFor(() => expect(options()).toEqual(["Norway"]));
      await expect(canvas.getByRole("status")).toHaveTextContent("");
      await expect(input).toHaveAttribute("aria-activedescendant", canvas.getByRole("option", { name: "Norway" }).id);
    });

    await step("picks a result with Enter", async () => {
      await userEvent.keyboard("{Enter}");
      await expect(args.onValueChange).toHaveBeenLastCalledWith("norway");
      await expect(input).toHaveValue("Norway");
    });

    await step("says so when nothing comes back", async () => {
      await userEvent.clear(input);
      await userEvent.keyboard("atlantis");
      await waitFor(() => expect(canvas.getByRole("status")).toHaveTextContent("No matches"));
    });

    await step("remembers the selection's text after it leaves the results", async () => {
      await expect(canvas.queryByRole("option", { name: "Norway" })).not.toBeInTheDocument();
      await userEvent.keyboard("{Escape}");
      await expect(input).toHaveValue("Norway");
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

const LABELS = [
  { value: "bug", label: "Bug", icon: <Icon d="M8 8h8v9a4 4 0 0 1-8 0zM12 8V5M5 11h3M16 11h3M5 17h3M16 17h3" /> },
  { value: "feature", label: "Feature", icon: <Icon d="M12 3l2.6 5.6 6 .7-4.4 4.1 1.2 6L12 16.5 6.6 19.4l1.2-6L3.4 9.3l6-.7z" /> },
  { value: "docs", label: "Documentation", icon: <Icon d="M6 3h9l4 4v14H6zM14 3v5h5M9 13h7M9 17h7" /> },
  { value: "question", label: "Question", icon: <Icon d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .9-1 1.7M12 17h.01" /> },
];

/**
 * ComboboxItem takes an `icon`. The selected option's icon shows at the input's start, dimming
 * while the text is edited, so the text doesn't shift and the current choice stays in view.
 */
export const WithIcons: Story = {
  name: "With icons",
  args: { defaultValue: "bug" },
  render: (args) => {
    const id = "issue-label";
    return (
      <div style={field}>
        <label htmlFor={id}>Label</label>
        <Combobox {...args}>
          <ComboboxInput id={id} />
          <ComboboxContent>
            {LABELS.map((label) => (
              <ComboboxItem key={label.value} value={label.value} icon={label.icon}>
                {label.label}
              </ComboboxItem>
            ))}
          </ComboboxContent>
        </Combobox>
      </div>
    );
  },
  play: async ({ canvas, canvasElement, step }) => {
    const input = canvas.getByRole("combobox", { name: "Label" });
    const icon = () => canvasElement.querySelector("[data-slot=combobox] > [data-slot=icon]");

    await step("shows the selected option's icon, hidden from assistive tech", async () => {
      await expect(input).toHaveValue("Bug");
      await expect(icon()).toHaveAttribute("aria-hidden", "true");
      await expect(icon()).not.toHaveAttribute("data-stale");
    });

    await step("marks the icon stale while the text is edited away from the selection", async () => {
      await userEvent.clear(input);
      await userEvent.keyboard("doc");
      await expect(icon()).toHaveAttribute("data-stale");
    });

    await step("swaps the icon when another option is picked", async () => {
      const before = icon()!.innerHTML;
      await userEvent.keyboard("{Enter}");
      await expect(input).toHaveValue("Documentation");
      await expect(icon()!.innerHTML).not.toBe(before);
      await expect(icon()).not.toHaveAttribute("data-stale");
    });

    await step("names options by their text alone", async () => {
      await userEvent.click(input);
      await expect(canvas.getByRole("option", { name: "Feature" })).toBeInTheDocument();
    });
  },
};

/** Inside a Modal, Escape closes the open list first and leaves the Modal open. */
export const InModal: Story = {
  name: "In a modal",
  render: (args) => (
    <Modal>
      <ModalTrigger>Edit address</ModalTrigger>
      <ModalContent>
        <ModalTitle>Edit address</ModalTitle>
        <CountryCombobox {...args} />
      </ModalContent>
    </Modal>
  ),
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Edit address" }));
    const dialog = canvas.getByRole("dialog", { name: "Edit address" }) as HTMLDialogElement;
    const input = canvas.getByRole("combobox", { name: "Country" });

    await userEvent.click(input);
    await userEvent.keyboard("{Escape}");
    await expect(input).toHaveAttribute("aria-expanded", "false");
    await expect(dialog.open).toBe(true);

    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(dialog.open).toBe(false));
  },
};

/**
 * Open, so axe checks the options in light mode. The list is longer than its 20rem cap, so it
 * scrolls, opening with the selected option in view.
 */
export const Open: Story = {
  args: { defaultValue: "switzerland" },
  play: async ({ canvas }) => {
    const input = canvas.getByRole("combobox", { name: "Country" });
    await userEvent.click(input);
    const listbox = canvas.getByRole("listbox", { name: "Country" });
    const selected = canvas.getByRole("option", { name: "Switzerland" });
    await expect(listbox.scrollHeight).toBeGreaterThan(listbox.clientHeight);
    await waitFor(() => {
      const list = listbox.getBoundingClientRect();
      const item = selected.getBoundingClientRect();
      expect(item.bottom).toBeLessThanOrEqual(list.bottom);
      expect(item.top).toBeGreaterThanOrEqual(list.top);
    });
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
