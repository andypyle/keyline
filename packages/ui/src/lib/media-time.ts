function parts(seconds: number) {
  const total = Math.max(0, Math.floor(seconds));
  return { hours: Math.floor(total / 3600), minutes: Math.floor((total % 3600) / 60), seconds: total % 60 };
}

/** A media position as a clock: "0:07", "12:34", "1:02:03". */
export function formatClock(seconds: number) {
  if (!Number.isFinite(seconds)) return "--:--";
  const time = parts(seconds);
  const ss = String(time.seconds).padStart(2, "0");
  if (time.hours > 0) return `${time.hours}:${String(time.minutes).padStart(2, "0")}:${ss}`;
  return `${time.minutes}:${ss}`;
}

/** A media position in words, for assistive tech: "1 hour 2 minutes 3 seconds", "0 seconds". */
export function formatSpokenTime(seconds: number) {
  const time = parts(seconds);
  const words = [
    time.hours > 0 && `${time.hours} ${time.hours === 1 ? "hour" : "hours"}`,
    time.minutes > 0 && `${time.minutes} ${time.minutes === 1 ? "minute" : "minutes"}`,
    (time.seconds > 0 || (time.hours === 0 && time.minutes === 0)) &&
      `${time.seconds} ${time.seconds === 1 ? "second" : "seconds"}`,
  ];
  return words.filter(Boolean).join(" ");
}
