import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, waitFor } from "storybook/test";
import { Button } from "@/components/Button/Button";
import { VideoPlayerControls } from "@/components/VideoPlayer/parts/VideoPlayerControls";
import { VideoPlayerVideo } from "@/components/VideoPlayer/parts/VideoPlayerVideo";
import { VideoModalContent } from "./parts/VideoModalContent";
import { VideoModalTitle } from "./parts/VideoModalTitle";
import { VideoModalTrigger } from "./parts/VideoModalTrigger";
import { VideoModal } from "./VideoModal";

// Stories are excluded from Tailwind's source scan, so layout here uses inline styles.
const row = { display: "flex", flexWrap: "wrap", alignItems: "flex-start", gap: 24 } as const;

// Served from apps/docs/public: a 4-second silent clip with English captions.
const src = "media/sample.webm";
const poster = "media/sample-poster.jpg";

function Content() {
  return (
    <VideoModalContent>
      <VideoModalTitle>Light across the field</VideoModalTitle>
      <VideoPlayerVideo src={src} poster={poster}>
        <track kind="captions" src="media/sample.en.vtt" srcLang="en" label="English" default />
      </VideoPlayerVideo>
      <VideoPlayerControls />
    </VideoModalContent>
  );
}

const meta = {
  title: "Media/VideoModal",
  component: VideoModal,
  tags: ["autodocs"],
  render: (args) => (
    <VideoModal {...args}>
      <VideoModalTrigger poster={poster} style={{ width: 320 }}>
        Watch “Light across the field”
      </VideoModalTrigger>
      <Content />
    </VideoModal>
  ),
} satisfies Meta<typeof VideoModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas, canvasElement, step }) => {
    const trigger = canvas.getByRole("button", { name: "Watch “Light across the field”" });
    const video = canvasElement.ownerDocument.querySelector<HTMLVideoElement>("[data-slot=video-modal-content] video")!;
    // Simulated clicks aren't a user gesture, so Chrome's autoplay policy only lets a muted video play.
    video.muted = true;

    await step("is a button that opens a dialog", async () => {
      await expect(trigger).toHaveAttribute("aria-haspopup", "dialog");
      await expect(trigger).toHaveAttribute("type", "button");
    });

    await step("opens a dialog named by the title, playing from the start with focus on the video", async () => {
      await userEvent.click(trigger);
      // The panel fades in, so wait for it to finish showing.
      await waitFor(() => expect(canvas.getByRole("dialog", { name: "Light across the field" })).toBeVisible());
      await expect(video).toHaveFocus();
      await waitFor(() => expect(video.paused).toBe(false));
    });

    await step("takes the player's keyboard shortcuts straight away", async () => {
      // The digits jump to a fraction of the video's length, which isn't known until its metadata
      // loads; the seek slider is enabled once it is.
      await waitFor(() => expect(canvas.getByRole("slider", { name: "Seek" })).not.toHaveAttribute("aria-disabled"), {
        timeout: 5000,
      });
      await userEvent.keyboard("k");
      await waitFor(() => expect(video.paused).toBe(true));
      await userEvent.keyboard("5");
      await expect(video.currentTime).toBe(2);
    });

    await step("closes on Escape, pausing the video and returning focus to the trigger", async () => {
      await userEvent.keyboard("k");
      await waitFor(() => expect(video.paused).toBe(false));
      await userEvent.keyboard("{Escape}");
      await waitFor(() => expect(canvas.queryByRole("dialog")).not.toBeInTheDocument());
      await expect(video.paused).toBe(true);
      await expect(trigger).toHaveFocus();
    });

    await step("starts again from the beginning when reopened", async () => {
      await userEvent.click(trigger);
      await waitFor(() => expect(canvas.getByRole("dialog")).toBeVisible());
      // It left off past 2 seconds; it's playing again, so it may be a moment in.
      await expect(video.currentTime).toBeLessThan(1);
    });

    await step("closes from the close button over the video", async () => {
      await userEvent.click(canvas.getByRole("button", { name: "Close" }));
      await waitFor(() => expect(canvas.queryByRole("dialog")).not.toBeInTheDocument());
      await expect(video.paused).toBe(true);
    });
  },
};

/**
 * With `asChild`, the trigger's one child opens the modal in place of the poster: here a Button,
 * keeping its own look and its own click handler.
 */
export const AsChild: Story = {
  args: { onOpenChange: fn() },
  render: (args) => (
    <VideoModal {...args}>
      <VideoModalTrigger asChild>
        <Button variant="secondary">Watch the clip</Button>
      </VideoModalTrigger>
      <Content />
    </VideoModal>
  ),
  play: async ({ args, canvas, canvasElement }) => {
    const video = canvasElement.ownerDocument.querySelector<HTMLVideoElement>("[data-slot=video-modal-content] video")!;
    video.muted = true;
    const trigger = canvas.getByRole("button", { name: "Watch the clip" });
    await expect(trigger).toHaveAttribute("data-slot", "video-modal-trigger");
    await expect(trigger).toHaveAttribute("aria-haspopup", "dialog");
    await userEvent.click(trigger);
    await waitFor(() => expect(canvas.getByRole("dialog", { name: "Light across the field" })).toBeVisible());
    await expect(args.onOpenChange).toHaveBeenCalledWith(true);
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(canvas.queryByRole("dialog")).not.toBeInTheDocument());
  },
};

/** `autoPlay={false}` opens on the first frame, waiting for the viewer to press play. */
export const WithoutAutoPlay: Story = {
  render: (args) => (
    <VideoModal {...args}>
      <VideoModalTrigger poster={poster} style={{ width: 320 }}>
        Watch “Light across the field”
      </VideoModalTrigger>
      <VideoModalContent autoPlay={false}>
        <VideoModalTitle>Light across the field</VideoModalTitle>
        <VideoPlayerVideo src={src} poster={poster} />
        <VideoPlayerControls />
      </VideoModalContent>
    </VideoModal>
  ),
  play: async ({ canvas, canvasElement }) => {
    const video = canvasElement.ownerDocument.querySelector<HTMLVideoElement>("[data-slot=video-modal-content] video")!;
    await userEvent.click(canvas.getByRole("button", { name: "Watch “Light across the field”" }));
    await waitFor(() => expect(canvas.getByRole("dialog")).toBeVisible());
    await expect(video).toHaveFocus();
    await expect(video.paused).toBe(true);
  },
};

/** Open, to check the panel, the title over the video and the close button in both themes. */
export const Open: Story = {
  args: { defaultOpen: true },
};

export const OpenDark: Story = {
  name: "Open (dark)",
  args: { defaultOpen: true },
  globals: { theme: "dark" },
  play: async () => {
    // Guards the contrast check: if the theme global stops applying, this story would silently test light mode.
    await expect(document.documentElement).toHaveAttribute("data-theme", "dark");
  },
};

/** Triggers in both themes: the poster with its play badge, and a Button through `asChild`. */
export const Triggers: Story = {
  render: (args) => (
    <div style={row}>
      <VideoModal {...args}>
        <VideoModalTrigger poster={poster} style={{ width: 320 }}>
          Watch “Light across the field”
        </VideoModalTrigger>
        <Content />
      </VideoModal>
      <VideoModal {...args}>
        <VideoModalTrigger asChild>
          <Button variant="secondary">Watch the clip</Button>
        </VideoModalTrigger>
        <Content />
      </VideoModal>
    </div>
  ),
};

export const TriggersDark: Story = {
  name: "Triggers (dark)",
  globals: { theme: "dark" },
  render: Triggers.render,
  play: async () => {
    await expect(document.documentElement).toHaveAttribute("data-theme", "dark");
  },
};
