import type { Meta, StoryObj } from "@storybook/react-vite";
import { useRef, useState, type FormEvent } from "react";
import { expect, fn, userEvent, waitFor } from "storybook/test";
import {
  Button,
  Checkbox,
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  Input,
  Modal,
  ModalClose,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalTitle,
  ModalTrigger,
  Radio,
  RadioGroup,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  Switch,
  Textarea,
} from "../../../../packages/ui/src";

// The docs app isn't in Tailwind's source scan, so layout here uses inline styles.
const stack = { display: "grid", gap: 20 } as const;
const option = { display: "inline-flex", alignItems: "center", gap: 10, fontWeight: 500 } as const;

interface InviteArgs {
  onOpenChange: (open: boolean) => void;
  onInvite: (data: Record<string, FormDataEntryValue>) => void;
}

/**
 * The browser blocks a submit while a required control is empty and fires `invalid` on each one,
 * so the form collects those names to show their FieldErrors. A control's error clears once it's
 * valid again. The modal stays mounted while closed, so the form is reset each time it closes,
 * however it closes, to open fresh next time.
 */
function InviteModal({ onOpenChange, onInvite }: InviteArgs) {
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<ReadonlySet<string>>(new Set());
  const flag = (event: FormEvent<HTMLFormElement>) => {
    const { name } = event.target as HTMLInputElement;
    setErrors((prev) => new Set(prev).add(name));
  };
  const clear = (name: string) =>
    setErrors((prev) => {
      if (!prev.has(name)) return prev;
      const next = new Set(prev);
      next.delete(name);
      return next;
    });

  return (
    <Modal
      onOpenChange={(open) => {
        if (!open) {
          formRef.current?.reset();
          setErrors(new Set());
        }
        onOpenChange(open);
      }}
    >
      <ModalTrigger>Invite teammate</ModalTrigger>
      <ModalContent>
        <ModalTitle>Invite a teammate</ModalTitle>
        <ModalDescription>They'll get an email with a link to join the Keyline Docs workspace.</ModalDescription>
        <form
          ref={formRef}
          method="dialog"
          style={stack}
          onInvalidCapture={flag}
          onChangeCapture={(event) => {
            const control = event.nativeEvent.target as HTMLInputElement;
            if (control.validity.valid) clear(control.name);
          }}
          onSubmit={(event) => onInvite(Object.fromEntries(new FormData(event.currentTarget)))}
        >
          <Field required invalid={errors.has("name")}>
            <FieldLabel>Name</FieldLabel>
            <Input name="name" autoComplete="off" autoFocus />
            <FieldError>Enter their name.</FieldError>
          </Field>
          <Field required invalid={errors.has("email")}>
            <FieldLabel>Email</FieldLabel>
            <Input name="email" type="email" autoComplete="off" />
            <FieldDescription>Use their work address.</FieldDescription>
            <FieldError>Enter a full email address, like ada@example.com.</FieldError>
          </Field>
          <Field required invalid={errors.has("role")}>
            <FieldLabel>Role</FieldLabel>
            <Select name="role" onValueChange={() => clear("role")}>
              <SelectTrigger placeholder="Pick a role" />
              <SelectContent>
                <SelectItem value="viewer">Viewer</SelectItem>
                <SelectItem value="editor">Editor</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
            <FieldError>Pick a role.</FieldError>
          </Field>
          <Field>
            <FieldLabel>Team</FieldLabel>
            <Combobox name="team">
              <ComboboxInput placeholder="Search teams" />
              <ComboboxContent empty="No teams match.">
                <ComboboxItem value="design">Design</ComboboxItem>
                <ComboboxItem value="engineering">Engineering</ComboboxItem>
                <ComboboxItem value="marketing">Marketing</ComboboxItem>
                <ComboboxItem value="support">Support</ComboboxItem>
              </ComboboxContent>
            </Combobox>
            <FieldDescription>Optional. They'll see the team's projects first.</FieldDescription>
          </Field>
          <Field>
            <FieldLabel>Access</FieldLabel>
            <RadioGroup name="access" defaultValue="all">
              <label style={option}>
                <Radio value="all" />
                All projects
              </label>
              <label style={option}>
                <Radio value="team" />
                Their team's projects only
              </label>
            </RadioGroup>
          </Field>
          <Field>
            <FieldLabel>Message</FieldLabel>
            <Textarea name="message" size="sm" />
            <FieldDescription>Added to the invite email.</FieldDescription>
          </Field>
          <Field orientation="horizontal">
            <Switch name="twoFactor" defaultChecked />
            <FieldLabel>Require two-factor sign-in</FieldLabel>
          </Field>
          <Field orientation="horizontal">
            <Checkbox name="copyMe" />
            <FieldLabel>Send me a copy</FieldLabel>
          </Field>
          <ModalFooter>
            <ModalClose>Cancel</ModalClose>
            <Button type="submit" variant="primary">
              Send invite
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}

function getDialog(canvasElement: HTMLElement) {
  return canvasElement.querySelector("dialog")!;
}

/**
 * Every Keyline form control, in a Field, inside a Modal. A `<form method="dialog">` closes the
 * modal when it submits, and the browser's own `required` validation keeps it open until the
 * form is complete. Select and Combobox lists open above the modal, and Escape closes the list
 * before the modal.
 */
const meta = {
  title: "Forms/Examples/Form in a modal",
  tags: ["autodocs"],
  args: { onOpenChange: fn(), onInvite: fn() },
  argTypes: {
    onOpenChange: { table: { disable: true } },
    onInvite: { table: { disable: true } },
  },
  render: (args) => <InviteModal {...args} />,
} satisfies Meta<InviteArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ args, canvas, canvasElement, step }) => {
    const dialog = getDialog(canvasElement);
    const submit = () => userEvent.click(canvas.getByRole("button", { name: "Send invite" }));

    await step("opens with focus in the first field", async () => {
      await userEvent.click(canvas.getByRole("button", { name: "Invite teammate" }));
      await expect(canvas.getByRole("dialog", { name: "Invite a teammate" })).toBeInTheDocument();
      await expect(canvas.getByRole("textbox", { name: "Name" })).toHaveFocus();
    });

    await step("blocks an incomplete submit, stays open and shows each required field's error", async () => {
      await submit();
      await expect(args.onInvite).not.toHaveBeenCalled();
      await expect(dialog.open).toBe(true);
      await expect(canvas.getByRole("textbox", { name: "Name" })).toBeInvalid();
      await expect(canvas.getByRole("textbox", { name: "Email" })).toHaveAccessibleDescription(
        "Use their work address. Enter a full email address, like ada@example.com.",
      );
      await expect(canvas.getByRole("combobox", { name: "Role" })).toBeInvalid();
      await expect(canvas.getByText("Pick a role.")).toBeInTheDocument();
    });

    await step("clears each error once its field is filled in", async () => {
      await userEvent.type(canvas.getByRole("textbox", { name: "Name" }), "Ada Lovelace");
      await userEvent.type(canvas.getByRole("textbox", { name: "Email" }), "ada@example.com");
      await expect(canvas.queryByText("Enter their name.")).not.toBeInTheDocument();
      await expect(canvas.queryByText(/Enter a full email/)).not.toBeInTheDocument();
    });

    await step("picks from a Select inside the modal", async () => {
      await userEvent.click(canvas.getByRole("combobox", { name: "Role" }));
      await userEvent.click(canvas.getByRole("option", { name: "Editor" }));
      await expect(canvas.getByRole("combobox", { name: "Role" })).toHaveTextContent("Editor");
      await expect(canvas.queryByText("Pick a role.")).not.toBeInTheDocument();
    });

    await step("opens the list above the modal, and Escape closes the list, not the modal", async () => {
      const role = canvas.getByRole("combobox", { name: "Role" });
      await userEvent.click(role);
      await expect(role).toHaveAttribute("aria-expanded", "true");
      // A popover opened after the dialog sits above it in the top layer.
      await expect(canvas.getByRole("listbox", { name: /Role/ }).matches(":popover-open")).toBe(true);
      await userEvent.keyboard("{Escape}");
      await expect(role).toHaveAttribute("aria-expanded", "false");
      await expect(dialog.open).toBe(true);
      await expect(role).toHaveFocus();
    });

    await step("filters and picks from a Combobox inside the modal", async () => {
      await userEvent.type(canvas.getByRole("combobox", { name: "Team" }), "eng");
      await userEvent.click(canvas.getByRole("option", { name: "Engineering" }));
      await expect(canvas.getByRole("combobox", { name: "Team" })).toHaveValue("Engineering");
    });

    await step("sets the rest by keyboard and label", async () => {
      await userEvent.click(canvas.getByRole("radio", { name: "Their team's projects only" }));
      await userEvent.type(canvas.getByRole("textbox", { name: "Message" }), "Welcome aboard!");
      await userEvent.click(canvas.getByText("Send me a copy"));
      await expect(canvas.getByRole("checkbox", { name: "Send me a copy" })).toBeChecked();
    });

    await step("submits every value under its name and closes", async () => {
      await submit();
      await expect(args.onInvite).toHaveBeenCalledTimes(1);
      await expect(args.onInvite).toHaveBeenCalledWith({
        name: "Ada Lovelace",
        email: "ada@example.com",
        role: "editor",
        team: "engineering",
        access: "team",
        message: "Welcome aboard!",
        twoFactor: "on",
        copyMe: "on",
      });
      await expect(dialog.open).toBe(false);
      await waitFor(() => expect(args.onOpenChange).toHaveBeenLastCalledWith(false));
    });

    await step("opens fresh next time, with every field back to its default", async () => {
      await userEvent.click(canvas.getByRole("button", { name: "Invite teammate" }));
      await expect(canvas.getByRole("textbox", { name: "Name" })).toHaveValue("");
      await expect(canvas.getByRole("textbox", { name: "Email" })).toHaveValue("");
      await expect(canvas.getByRole("combobox", { name: "Role" })).toHaveTextContent("Pick a role");
      await expect(canvas.getByRole("combobox", { name: "Team" })).toHaveValue("");
      await expect(canvas.getByRole("radio", { name: "All projects" })).toBeChecked();
      await expect(canvas.getByRole("textbox", { name: "Message" })).toHaveValue("");
      await expect(canvas.getByRole("switch", { name: "Require two-factor sign-in" })).toBeChecked();
      await expect(canvas.getByRole("checkbox", { name: "Send me a copy" })).not.toBeChecked();
    });
  },
};

/** Cancel, Escape and the close button all dismiss the modal without submitting. */
export const Dismiss: Story = {
  play: async ({ args, canvas, canvasElement, step }) => {
    const dialog = getDialog(canvasElement);
    const open = async () => {
      await userEvent.click(canvas.getByRole("button", { name: "Invite teammate" }));
      await expect(dialog.open).toBe(true);
    };

    await step("Cancel", async () => {
      await open();
      await userEvent.type(canvas.getByRole("textbox", { name: "Name" }), "Ada");
      await userEvent.click(canvas.getByRole("button", { name: "Cancel" }));
      await expect(dialog.open).toBe(false);
    });

    await step("discards what was typed", async () => {
      await open();
      await expect(canvas.getByRole("textbox", { name: "Name" })).toHaveValue("");
      await userEvent.click(canvas.getByRole("button", { name: "Cancel" }));
    });

    await step("Escape", async () => {
      await open();
      await userEvent.keyboard("{Escape}");
      await waitFor(() => expect(dialog.open).toBe(false));
    });

    await step("close button", async () => {
      await open();
      await userEvent.click(canvas.getByRole("button", { name: "Close" }));
      await expect(dialog.open).toBe(false);
    });

    await expect(args.onInvite).not.toHaveBeenCalled();
  },
};

/** Opened with its errors showing, so axe checks the form's contrast in dark mode too. */
export const ErrorsDark: Story = {
  name: "Errors (dark)",
  globals: { theme: "dark" },
  play: async ({ canvas }) => {
    // Guards the contrast check: if the theme global stops applying, this story would silently test light mode.
    await expect(document.documentElement).toHaveAttribute("data-theme", "dark");
    await userEvent.click(canvas.getByRole("button", { name: "Invite teammate" }));
    await userEvent.click(canvas.getByRole("button", { name: "Send invite" }));
    await expect(canvas.getByText("Pick a role.")).toBeInTheDocument();
  },
};
