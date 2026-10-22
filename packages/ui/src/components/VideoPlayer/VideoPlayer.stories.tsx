import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor } from "storybook/test";
import { VideoPlayerControls } from "./parts/VideoPlayerControls";
import { VideoPlayerFullscreen } from "./parts/VideoPlayerFullscreen";
import { VideoPlayerPlay } from "./parts/VideoPlayerPlay";
import { VideoPlayerSeek } from "./parts/VideoPlayerSeek";
import { VideoPlayerTime } from "./parts/VideoPlayerTime";
import { VideoPlayerVideo } from "./parts/VideoPlayerVideo";
import { VideoPlayer } from "./VideoPlayer";
import type { VideoPlayerProps } from "./VideoPlayer.types";

// Stories are excluded from Tailwind's source scan, so layout here uses inline styles.
const row = { display: "flex", flexWrap: "wrap", alignItems: "flex-start", gap: 24 } as const;

// Served from apps/docs/public: a 4-second silent clip with English captions. WebM, because the
// Chromium the tests run in can't play H.264.
const src = "media/sample.webm";
const poster = "media/sample-poster.jpg";

function Sample({ captions = true, ...args }: VideoPlayerProps & { captions?: boolean }) {
  return (
    <VideoPlayer style={{ width: 560 }} {...args}>
      <VideoPlayerVideo src={src} poster={poster}>
        {captions && <track kind="captions" src="media/sample.en.vtt" srcLang="en" label="English" default />}
      </VideoPlayerVideo>
      {args.children ?? <VideoPlayerControls />}
    </VideoPlayer>
  );
}

// The seek slider is disabled until the video's length is known, so wait for that first.
async function loaded(canvasElement: HTMLElement) {
  await waitFor(() => expect(canvasElement.querySelector("[data-slot=video-player-seek]")).not.toHaveAttribute("aria-disabled"), {
    timeout: 5000,
  });
}

const meta = {
  title: "Media/VideoPlayer",
  component: VideoPlayer,
  tags: ["autodocs"],
  argTypes: {
    ratio: { control: "select", options: ["auto", "1/1", "4/3", "16/9", "21/9", "9/16"] },
    radius: { control: "inline-radio", options: ["none", "sm", "md", "lg", "xl"] },
  },
  render: (args) => <Sample {...args} />,
} satisfies Meta<typeof VideoPlayer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas, canvasElement, step }) => {
    const video = canvasElement.querySelector("video")!;
    const controls = canvas.getByRole("group", { name: "Video controls" });
    await loaded(canvasElement);

    await step("tabs to the video, described by its shortcuts, then into the named controls group", async () => {
      await userEvent.tab();
      await expect(video).toHaveFocus();
      await expect(video).toHaveAccessibleDescription(/^Keyboard shortcuts: Space or K plays and pauses/);
      await userEvent.tab();
      await expect(controls.contains(document.activeElement)).toBe(true);
      await expect(document.activeElement).toHaveAccessibleName("Play");
    });

    await step("plays and pauses from the play button and the video, naming what a press will do", async () => {
      // Simulated clicks aren't a user gesture, so Chrome's autoplay policy only lets a muted video play.
      video.muted = true;
      await userEvent.click(canvas.getByRole("button", { name: "Play" }));
      await waitFor(() => expect(video.paused).toBe(false));
      await expect(canvas.getByRole("button", { name: "Pause" })).toBeInTheDocument();
      await userEvent.click(video);
      await waitFor(() => expect(canvas.getByRole("button", { name: "Play" })).toBeInTheDocument());
      await expect(video.paused).toBe(true);
      video.muted = false;
    });

    await step("seeks with the keyboard, announcing the position in words", async () => {
      const seek = canvas.getByRole("slider", { name: "Seek" });
      seek.focus();
      await userEvent.keyboard("{Home}");
      await expect(video.currentTime).toBe(0);
      await expect(seek).toHaveAttribute("aria-valuetext", "0 seconds of 4 seconds");
      await userEvent.keyboard("{ArrowRight}{ArrowRight}");
      await expect(video.currentTime).toBe(2);
      await expect(seek).toHaveAttribute("aria-valuetext", "2 seconds of 4 seconds");
      await expect(canvasElement.querySelector("[data-slot=video-player-time]")).toHaveTextContent("0:02 / 0:04");
    });

    await step("mutes and unmutes, with the volume slider reading 0 while muted", async () => {
      const volume = canvas.getByRole("slider", { name: "Volume" });
      await userEvent.click(canvas.getByRole("button", { name: "Mute" }));
      await waitFor(() => expect(video.muted).toBe(true));
      await expect(volume).toHaveAttribute("aria-valuetext", "0%");
      await userEvent.click(canvas.getByRole("button", { name: "Unmute" }));
      await waitFor(() => expect(video.muted).toBe(false));
      await expect(volume).toHaveAttribute("aria-valuetext", "100%");
    });

    await step("sets the volume with its slider", async () => {
      const volume = canvas.getByRole("slider", { name: "Volume" });
      volume.focus();
      await userEvent.keyboard("{ArrowDown}{ArrowDown}");
      await waitFor(() => expect(video.volume).toBeCloseTo(0.9));
      await expect(volume).toHaveAttribute("aria-valuetext", "90%");
    });

    await step("turns the default captions track off and on", async () => {
      const track = video.textTracks[0]!;
      await waitFor(() => expect(track.mode).toBe("showing"));
      await userEvent.click(canvas.getByRole("button", { name: "Turn off captions" }));
      await expect(track.mode).toBe("disabled");
      await userEvent.click(canvas.getByRole("button", { name: "Turn on captions" }));
      await expect(track.mode).toBe("showing");
    });
  },
};

/**
 * While focus is in the player, it takes YouTube's keyboard shortcuts. Keys a focused control uses
 * itself are left to it: Space presses a focused button, and the arrows move a focused slider.
 */
export const KeyboardShortcuts: Story = {
  play: async ({ canvas, canvasElement, step }) => {
    const video = canvasElement.querySelector("video")!;
    await loaded(canvasElement);
    // Simulated key presses aren't a user gesture, so Chrome's autoplay policy only lets a muted video play.
    video.muted = true;
    await userEvent.tab();
    await expect(video).toHaveFocus();

    await step("Space and K play and pause", async () => {
      await userEvent.keyboard(" ");
      await waitFor(() => expect(video.paused).toBe(false));
      await userEvent.keyboard("k");
      await waitFor(() => expect(video.paused).toBe(true));
    });

    await step("the arrows, J and L skip, and Home, End and the digits jump, within the video", async () => {
      await userEvent.keyboard("{Home}");
      await expect(video.currentTime).toBe(0);
      await userEvent.keyboard("5");
      await expect(video.currentTime).toBe(2);
      await userEvent.keyboard("{ArrowLeft}");
      await expect(video.currentTime).toBe(0);
      await userEvent.keyboard("{ArrowRight}");
      await expect(video.currentTime).toBe(4);
      await userEvent.keyboard("j");
      await expect(video.currentTime).toBe(0);
      await userEvent.keyboard("l");
      await expect(video.currentTime).toBe(4);
      await userEvent.keyboard("0");
      await expect(video.currentTime).toBe(0);
    });

    await step("Up and Down change the volume, and M mutes", async () => {
      await userEvent.keyboard("{ArrowDown}{ArrowDown}");
      await waitFor(() => expect(video.volume).toBeCloseTo(0.9));
      await expect(video.muted).toBe(false);
      await userEvent.keyboard("{ArrowUp}");
      await waitFor(() => expect(video.volume).toBeCloseTo(0.95));
      await userEvent.keyboard("m");
      await waitFor(() => expect(video.muted).toBe(true));
      await expect(canvas.getByRole("button", { name: "Unmute" })).toBeInTheDocument();
    });

    await step("C turns captions off and on", async () => {
      const track = video.textTracks[0]!;
      await waitFor(() => expect(track.mode).toBe("showing"));
      await userEvent.keyboard("c");
      await expect(track.mode).toBe("disabled");
      await userEvent.keyboard("c");
      await expect(track.mode).toBe("showing");
    });

    await step("leaves keys held with a modifier to the browser", async () => {
      await userEvent.keyboard("{Control>}k{/Control}");
      await expect(video.paused).toBe(true);
    });

    await step("leaves Space to a focused button, so it presses once", async () => {
      const play = canvas.getByRole("button", { name: "Play" });
      play.focus();
      await userEvent.keyboard(" ");
      await waitFor(() => expect(video.paused).toBe(false));
      await expect(canvas.getByRole("button", { name: "Pause" })).toHaveFocus();
      await userEvent.keyboard(" ");
      await waitFor(() => expect(video.paused).toBe(true));
    });

    await step("leaves the arrows to a focused slider, which moves by its own step", async () => {
      const seek = canvas.getByRole("slider", { name: "Seek" });
      seek.focus();
      await userEvent.keyboard("{Home}{ArrowRight}");
      await expect(video.currentTime).toBe(1);
    });
  },
};

/** `keyboardShortcuts={false}` turns the shortcuts off; the video is no longer a tab stop. */
export const WithoutKeyboardShortcuts: Story = {
  args: { keyboardShortcuts: false },
  play: async ({ canvas, canvasElement }) => {
    const video = canvasElement.querySelector("video")!;
    await loaded(canvasElement);
    await userEvent.tab();
    await expect(video).not.toHaveFocus();
    await expect(canvas.getByRole("button", { name: "Play" })).toHaveFocus();
    await expect(video).not.toHaveAttribute("aria-describedby");
    await userEvent.keyboard("{End}m");
    await expect(video.currentTime).toBe(0);
    await expect(video.muted).toBe(false);
  },
};

/** Pass VideoPlayerControls the parts you want, in the order you want them. */
export const CustomControls: Story = {
  render: (args) => (
    <Sample {...args}>
      <VideoPlayerControls>
        <VideoPlayerPlay />
        <VideoPlayerTime />
        <VideoPlayerSeek />
        <VideoPlayerFullscreen />
      </VideoPlayerControls>
    </Sample>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("button", { name: "Play" })).toBeInTheDocument();
    await expect(canvas.queryByRole("button", { name: "Mute" })).not.toBeInTheDocument();
    await expect(canvas.queryByRole("slider", { name: "Volume" })).not.toBeInTheDocument();
  },
};

/** Without a captions or subtitles track, there's no captions button. */
export const WithoutCaptions: Story = {
  render: (args) => <Sample {...args} captions={false} />,
  play: async ({ canvas, canvasElement }) => {
    await loaded(canvasElement);
    await expect(canvas.queryByRole("button", { name: /captions/ })).not.toBeInTheDocument();
  },
};

/**
 * The controls fit narrow players. Under 28rem the volume slider gives way, leaving the mute
 * button; under 24rem the seek bar takes a row of its own; under 18rem the time is hidden.
 */
export const Narrow: Story = {
  render: (args) => (
    <div style={row}>
      <Sample {...args} style={{ width: 400 }} />
      <Sample {...args} style={{ width: 320 }} />
      <Sample {...args} style={{ width: 240 }} />
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole("slider", { name: "Volume" })).not.toBeInTheDocument();
    await expect(canvas.getAllByRole("button", { name: "Mute" })).toHaveLength(3);
    // Every control stays inside its player rather than spilling past the frame.
    for (const player of canvas.getAllByRole("group", { name: "Video controls" })) {
      const frame = player.getBoundingClientRect();
      for (const control of player.querySelectorAll("button, [role=slider]")) {
        await expect(control.getBoundingClientRect().right).toBeLessThanOrEqual(frame.right);
      }
    }
  },
};

/** `ratio` shapes the video's area, letterboxing a video of another shape; the controls bar sits below it either way. */
export const Ratios: Story = {
  render: (args) => (
    <div style={row}>
      <Sample {...args} ratio="1/1" style={{ width: 320 }} />
      <Sample {...args} ratio="9/16" style={{ width: 240 }} />
    </div>
  ),
};

export const Variants: Story = {
  render: (args) => (
    <div style={{ display: "grid", gap: 24 }}>
      <Sample {...args} />
      <Sample {...args} flat />
      <Sample {...args} noBorders />
    </div>
  ),
};

/** Dark mode swaps the semantic tokens, so contrast is checked here too. */
export const VariantsDark: Story = {
  name: "Variants (dark)",
  globals: { theme: "dark" },
  render: Variants.render,
  play: async () => {
    // Guards the contrast check: if the theme global stops applying, this story would silently test light mode.
    await expect(document.documentElement).toHaveAttribute("data-theme", "dark");
  },
};
