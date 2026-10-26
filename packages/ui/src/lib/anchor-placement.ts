export type PlacementSide = "top" | "bottom" | "left" | "right";
export type PlacementAlign = "start" | "center" | "end";

/**
 * Where an anchored popover sits relative to its anchor, for each `side` and `align`, as CVA
 * compound variants. position-area takes both axes at once, so each pairing needs its own class.
 * It's written in logical keywords, so left and right are the inline start and end and swap in
 * right-to-left text. The variants that use it set the gap, flip fallback and motion per side.
 */
export const placementCompoundVariants: { side: PlacementSide; align: PlacementAlign; class: string[] }[] = [
  { side: "bottom", align: "start", class: ["kl:[position-area:block-end_span-inline-end]"] },
  { side: "bottom", align: "center", class: ["kl:[position-area:block-end]"] },
  { side: "bottom", align: "end", class: ["kl:[position-area:block-end_span-inline-start]"] },
  { side: "top", align: "start", class: ["kl:[position-area:block-start_span-inline-end]"] },
  { side: "top", align: "center", class: ["kl:[position-area:block-start]"] },
  { side: "top", align: "end", class: ["kl:[position-area:block-start_span-inline-start]"] },
  { side: "left", align: "start", class: ["kl:[position-area:inline-start_span-block-end]"] },
  { side: "left", align: "center", class: ["kl:[position-area:inline-start]"] },
  { side: "left", align: "end", class: ["kl:[position-area:inline-start_span-block-start]"] },
  { side: "right", align: "start", class: ["kl:[position-area:inline-end_span-block-end]"] },
  { side: "right", align: "center", class: ["kl:[position-area:inline-end]"] },
  { side: "right", align: "end", class: ["kl:[position-area:inline-end_span-block-start]"] },
];
