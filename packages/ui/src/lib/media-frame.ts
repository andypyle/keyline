// The frame MediaImage and MediaVideo share, so the two stay in step. Each passes these to its own
// cva() in its .variants.ts. The classes style the media element itself, never a wrapper, so the
// exported variants also work on a framework's image component (next/image, astro:assets).

export const mediaFrameBase = [
  "kl:block",
  "kl:max-w-full",
  // Keeps the natural (or width/height attribute) ratio when only the width is constrained, and
  // lets `ratio` set the height.
  "kl:h-auto",
  // Shows while the media loads, and around it with fit="contain".
  "kl:bg-sunken",
  "kl:border-line",
];

export const mediaFrameVariants = {
  /** Crops to this width/height ratio. `auto` keeps the media's own. */
  ratio: {
    auto: ["kl:aspect-auto"],
    "1/1": ["kl:aspect-square"],
    "4/3": ["kl:aspect-4/3"],
    "3/2": ["kl:aspect-3/2"],
    "16/9": ["kl:aspect-video"],
    "21/9": ["kl:aspect-21/9"],
    "3/4": ["kl:aspect-3/4"],
    "9/16": ["kl:aspect-9/16"],
  },
  /** `cover` crops to fill the frame; `contain` fits the whole picture, showing the background around it. */
  fit: {
    cover: ["kl:object-cover"],
    contain: ["kl:object-contain"],
  },
  radius: {
    none: ["kl:rounded-none"],
    sm: ["kl:rounded-sm"],
    md: ["kl:rounded-md"],
    lg: ["kl:rounded-lg"],
    xl: ["kl:rounded-xl"],
  },
  /** Removes the shadow, keeping the outline. */
  flat: {
    true: [],
    false: [],
  },
  /** Removes the outline, and with it the shadow. */
  noBorders: {
    true: [],
    false: ["kl:border-3"],
  },
};

export const mediaFrameCompoundVariants = [{ flat: false, noBorders: false, class: ["kl:shadow-lg"] }];

export const mediaFrameDefaultVariants = {
  ratio: "auto",
  fit: "cover",
  radius: "lg",
  flat: false,
  noBorders: false,
} as const;
