# Keyline

A React component library with outlined controls and hard offset shadows, built on Tailwind v4.

> [!WARNING]
> Keyline is experimental. I'm using it to explore a Claude → Figma → code workflow, and it isn't published to npm. APIs, tokens and visuals can change without notice. Don't depend on it in production.

- Storybook: [keyline.andypyle.dev](https://keyline.andypyle.dev)
- Figma: [Keyline](https://www.figma.com/design/gVJvJJAOtJkcdeBHk61Ivb/Keyline)

## The workflow

Each component goes through the same loop:

1. **Claude → Figma**: Claude, using the Figma connector, designs the component on its own page in the Figma file, with fills, strokes, radii and spacing bound to variables that mirror the code's tokens.
2. **Figma**: I adjust the design by hand in Figma.
3. **Figma → code**: Claude Code reads the adjusted design through the Figma MCP server, scaffolds the component with the repo's generator, builds it to match, and writes stories whose `play` functions test its behavior. Each story links back to its Figma page from the Storybook toolbar.

[`CLAUDE.md`](CLAUDE.md) holds the conventions Claude follows in this repo: file structure, class ordering, tokens and testing.

## Components

Accordion, Badge, Button, ButtonGroup, Card, CardGrid, Checkbox, Combobox, DatePicker, DateRangePicker, DropdownMenu, Field, Input, MediaImage, MediaVideo, Modal, Pagination, Popover, Radio, RadioGroup, Select, Slider, Switch, Table, Textarea, Toast, Toaster, Tooltip, VideoModal and VideoPlayer.

## Usage

Keyline needs React 19. Import the stylesheet once, then the components:

```tsx
import "@keyline/ui/styles.css";
import { Button } from "@keyline/ui";

export function Save() {
  return <Button>Save</Button>;
}
```

The stylesheet doesn't reset your app's styles, and everything in it sits in the `keyline` cascade layer. Declare that layer first and your own styles win:

```css
@layer keyline, theme, base, components, utilities;
```

## Repository

A pnpm and Turborepo monorepo:

- `packages/ui`: `@keyline/ui`, the library
- `apps/docs`: Storybook, which loads the stories that sit next to each component

```sh
pnpm install
pnpm storybook   # Storybook on :6006
pnpm test        # every story as a test in headless Chromium
pnpm typecheck
pnpm build
```

Stories are also checked with axe and compared against screenshot baselines in CI. See [`CLAUDE.md`](CLAUDE.md) for how those work.
