import type { SVGProps } from "react";

// Icons for the VideoPlayer's buttons. They're decorative: each button is named by its aria-label.
function Icon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    />
  );
}

export function PlayIcon() {
  return (
    <Icon>
      <path d="M7 4.5v15l12-7.5z" fill="currentColor" />
    </Icon>
  );
}

export function PauseIcon() {
  return (
    <Icon>
      <path d="M8 5v14M16 5v14" strokeWidth={3.5} />
    </Icon>
  );
}

export function VolumeIcon() {
  return (
    <Icon>
      <path d="M4 9.5h3.5L12 5v14l-4.5-4.5H4z" fill="currentColor" />
      <path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a7.5 7.5 0 0 1 0 11" />
    </Icon>
  );
}

export function MutedIcon() {
  return (
    <Icon>
      <path d="M4 9.5h3.5L12 5v14l-4.5-4.5H4z" fill="currentColor" />
      <path d="m16 9.5 5 5M21 9.5l-5 5" />
    </Icon>
  );
}

export function CaptionsIcon({ on }: { on: boolean }) {
  return (
    <Icon>
      <rect x="2.5" y="5" width="19" height="14" rx="3" fill={on ? "currentColor" : "none"} />
      <path
        d="M10.5 10.2a2.2 2.2 0 1 0 0 3.6M17 10.2a2.2 2.2 0 1 0 0 3.6"
        stroke={on ? "var(--kl-color-surface)" : "currentColor"}
        strokeWidth={2}
      />
    </Icon>
  );
}

export function FullscreenIcon() {
  return (
    <Icon>
      <path d="M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5" />
    </Icon>
  );
}

export function ExitFullscreenIcon() {
  return (
    <Icon>
      <path d="M9 4v5H4M20 9h-5V4M15 20v-5h5M4 15h5v5" />
    </Icon>
  );
}
