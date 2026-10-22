import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { cn } from "../../lib/cn";
import { mergeRefs } from "../../lib/merge-refs";
import { VideoPlayerContext } from "../../lib/video-player-context";
import type { VideoPlayerProps } from "./VideoPlayer.types";
import { videoPlayerVariants } from "./VideoPlayer.variants";

// Safari on iPhone can't put an element in full screen, only a video, through its own player.
type IOSVideo = HTMLVideoElement & { webkitEnterFullscreen?: () => void };

const MEDIA_EVENTS = [
  "play",
  "pause",
  "ended",
  "timeupdate",
  "seeking",
  "durationchange",
  "loadedmetadata",
  "volumechange",
  "progress",
  "emptied",
] as const;

// How far the shortcut keys move.
const SEEK_STEP = 5;
const SEEK_JUMP = 10;
const VOLUME_STEP = 0.05;

const DEFAULT_SHORTCUTS_DESCRIPTION =
  "Keyboard shortcuts: Space or K plays and pauses. Left and Right arrows skip back and forward 5 seconds, " +
  "J and L 10 seconds. Home and End go to the start and end, and 0 to 9 to that tenth of the video. " +
  "Up and Down arrows change the volume. M mutes, C turns captions on or off, and F toggles full screen.";

function isCaptionTrack(track: TextTrack) {
  return track.kind === "captions" || track.kind === "subtitles";
}

/**
 * Plays a video with Keyline-styled controls. Compose it from a VideoPlayerVideo and a
 * VideoPlayerControls; the controls bar holds the full set (play, seek, time, mute, volume,
 * captions, full screen) unless you pass the ones you want. Add captions as `<track>` children of
 * the VideoPlayerVideo.
 *
 * The parts follow the video's own media events, so the video stays the source of truth: anything
 * that plays, pauses or seeks it through its ref is reflected in the controls.
 *
 * While focus is anywhere in the player, it takes YouTube's keyboard shortcuts: Space or K plays and
 * pauses; Left and Right skip 5 seconds, J and L 10; Home, End and 0 to 9 jump; Up and Down change
 * the volume; M mutes; C toggles captions; F toggles full screen. Keys a focused control uses
 * itself are left to it (Space on a button, the arrows on a slider), and nothing happens while a
 * modifier key is held. The video is a tab stop, described by the list of shortcuts, so keyboard
 * users can reach them without landing on a control. Turn them off with `keyboardShortcuts={false}`.
 */
export function VideoPlayer({
  ref,
  className,
  ratio,
  radius,
  flat,
  noBorders,
  keyboardShortcuts = true,
  shortcutsDescription = DEFAULT_SHORTCUTS_DESCRIPTION,
  onKeyDown,
  children,
  ...props
}: VideoPlayerProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const mergedRef = useMemo(() => mergeRefs(rootRef, ref), [ref]);
  const [video, setVideo] = useState<HTMLVideoElement | null>(null);
  const descriptionId = useId();

  const [paused, setPaused] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [bufferedEnd, setBufferedEnd] = useState(0);
  const [volume, setVolumeState] = useState(1);
  const [muted, setMuted] = useState(false);
  const [hasCaptions, setHasCaptions] = useState(false);
  const [captionsOn, setCaptionsOn] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [canFullscreen, setCanFullscreen] = useState(false);

  // Mirror the video's state from its media events.
  useEffect(() => {
    if (!video) return;
    const sync = () => {
      setPaused(video.paused);
      setCurrentTime(video.currentTime);
      setDuration(Number.isNaN(video.duration) ? 0 : video.duration);
      setVolumeState(video.volume);
      setMuted(video.muted);
      // The buffered stretch that holds the current position, so a gap ahead isn't shown as loaded.
      let end = 0;
      for (let i = 0; i < video.buffered.length; i++) {
        if (video.buffered.start(i) <= video.currentTime + 0.5) end = Math.max(end, video.buffered.end(i));
      }
      setBufferedEnd(end);
    };
    const syncTracks = () => {
      const tracks = Array.from(video.textTracks).filter(isCaptionTrack);
      setHasCaptions(tracks.length > 0);
      setCaptionsOn(tracks.some((track) => track.mode === "showing"));
    };
    for (const type of MEDIA_EVENTS) video.addEventListener(type, sync);
    video.textTracks.addEventListener("addtrack", syncTracks);
    video.textTracks.addEventListener("removetrack", syncTracks);
    video.textTracks.addEventListener("change", syncTracks);
    sync();
    syncTracks();
    setCanFullscreen(document.fullscreenEnabled || typeof (video as IOSVideo).webkitEnterFullscreen === "function");
    return () => {
      for (const type of MEDIA_EVENTS) video.removeEventListener(type, sync);
      video.textTracks.removeEventListener("addtrack", syncTracks);
      video.textTracks.removeEventListener("removetrack", syncTracks);
      video.textTracks.removeEventListener("change", syncTracks);
    };
  }, [video]);

  useEffect(() => {
    const sync = () => setFullscreen(document.fullscreenElement !== null && document.fullscreenElement === rootRef.current);
    document.addEventListener("fullscreenchange", sync);
    return () => document.removeEventListener("fullscreenchange", sync);
  }, []);

  const context = useMemo(
    () => ({
      setVideo,
      paused,
      currentTime,
      duration,
      bufferedEnd,
      volume,
      muted,
      hasCaptions,
      captionsOn,
      fullscreen,
      canFullscreen,
      shortcutsDescriptionId: keyboardShortcuts ? descriptionId : undefined,
      togglePlay: () => {
        if (!video) return;
        // play() rejects when the browser blocks playback or a pause interrupts it; the media
        // events already keep the controls right, so there's nothing more to do.
        if (video.paused || video.ended) video.play().catch(() => {});
        else video.pause();
      },
      seek: (time: number) => {
        if (!video) return;
        video.currentTime = time;
        setCurrentTime(time);
      },
      setVolume: (next: number) => {
        if (!video) return;
        video.volume = next;
        video.muted = next === 0;
      },
      toggleMute: () => {
        if (!video) return;
        // Unmuting at zero volume would still be silent, so it comes back at half.
        if (video.muted || video.volume === 0) {
          if (video.volume === 0) video.volume = 0.5;
          video.muted = false;
        } else {
          video.muted = true;
        }
      },
      toggleCaptions: () => {
        if (!video) return;
        const tracks = Array.from(video.textTracks).filter(isCaptionTrack);
        if (tracks.some((track) => track.mode === "showing")) {
          for (const track of tracks) if (track.mode === "showing") track.mode = "disabled";
        } else if (tracks[0]) {
          tracks[0].mode = "showing";
        }
      },
      toggleFullscreen: () => {
        const root = rootRef.current;
        if (!root) return;
        if (document.fullscreenElement === root) document.exitFullscreen().catch(() => {});
        else if (document.fullscreenEnabled) root.requestFullscreen().catch(() => {});
        else (video as IOSVideo | null)?.webkitEnterFullscreen?.();
      },
    }),
    [
      video,
      paused,
      currentTime,
      duration,
      bufferedEnd,
      volume,
      muted,
      hasCaptions,
      captionsOn,
      fullscreen,
      canFullscreen,
      keyboardShortcuts,
      descriptionId,
    ],
  );

  function handleShortcut(event: KeyboardEvent<HTMLDivElement>) {
    if (!keyboardShortcuts || !video || event.defaultPrevented) return;
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    const target = event.target as HTMLElement;
    // Text fields a consumer adds to the controls need every key.
    if (target.closest("input, textarea, select, [contenteditable]:not([contenteditable=false])")) return;
    const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
    const seekable = Number.isFinite(duration) && duration > 0;
    const seekTo = (time: number) => {
      if (seekable) context.seek(Math.min(duration, Math.max(0, time)));
    };
    const changeVolume = (delta: number) =>
      context.setVolume(Math.round(Math.min(1, Math.max(0, video.volume + delta)) * 100) / 100);

    switch (key) {
      case " ":
        // Space presses a focused button or link; leave it to them.
        if (target.closest("button, a[href]")) return;
        context.togglePlay();
        break;
      case "k":
        context.togglePlay();
        break;
      case "ArrowLeft":
        seekTo(video.currentTime - SEEK_STEP);
        break;
      case "ArrowRight":
        seekTo(video.currentTime + SEEK_STEP);
        break;
      case "j":
        seekTo(video.currentTime - SEEK_JUMP);
        break;
      case "l":
        seekTo(video.currentTime + SEEK_JUMP);
        break;
      case "Home":
        seekTo(0);
        break;
      case "End":
        seekTo(duration);
        break;
      case "ArrowUp":
        changeVolume(VOLUME_STEP);
        break;
      case "ArrowDown":
        changeVolume(-VOLUME_STEP);
        break;
      case "m":
        context.toggleMute();
        break;
      case "c":
        if (!hasCaptions) return;
        context.toggleCaptions();
        break;
      case "f":
        if (!canFullscreen) return;
        context.toggleFullscreen();
        break;
      default:
        if (!/^[0-9]$/.test(key)) return;
        seekTo((duration * Number(key)) / 10);
    }
    // The keys would otherwise scroll the page.
    event.preventDefault();
  }

  return (
    <VideoPlayerContext value={context}>
      <div
        data-slot="video-player"
        data-paused={paused || undefined}
        data-fullscreen={fullscreen || undefined}
        className={cn(videoPlayerVariants({ ratio, radius, flat, noBorders }), className)}
        onKeyDown={(event) => {
          onKeyDown?.(event);
          handleShortcut(event);
        }}
        {...props}
        ref={mergedRef}
      >
        {children}
        {keyboardShortcuts && (
          <span id={descriptionId} hidden>
            {shortcutsDescription}
          </span>
        )}
      </div>
    </VideoPlayerContext>
  );
}
