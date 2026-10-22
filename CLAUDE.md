# Keyline

pnpm + Turborepo monorepo for the Keyline React component library.

- `packages/ui`: `@keyline/ui`, the published library (tsdown for JS, Tailwind v4 CLI for CSS)
- `apps/docs`: Storybook. It loads stories and MDX from `packages/*/src`, so stories live next to their components.

## Commands

```sh
pnpm gen component   # scaffold a component (see below)
pnpm gen part        # scaffold a part of a compound component (see below)
pnpm typecheck       # all packages
pnpm test            # every story as a test in headless Chromium (Storybook's Vitest addon)
pnpm build           # all packages + Storybook
pnpm storybook       # Storybook dev server on :6006
pnpm changeset       # record a change to a published package
```

## Creating components

**Always create a component with the generator. Never create its files or folder by hand.** The generator is the source of truth for component structure. If the structure needs to change, change the templates in `packages/ui/plop-templates/` and `packages/ui/plopfile.js`, not individual components.

Prompts can't be answered from a non-interactive shell, so pass all five answers as positional arguments:

```sh
pnpm gen component <Name> "<one-line description>" <root-element> <y|n> <Section>
# e.g.
pnpm gen component Button "Triggers an action." button y Buttons
```

- `<Name>`: PascalCase. Generation fails if `src/components/<Name>` already exists.
- `<root-element>`: lowercase HTML tag; it types the props (`ComponentPropsWithRef<"button">`).
- `y|n`: whether the component has CVA variants.
- `<Section>`: the Storybook sidebar section the stories go in: `Buttons`, `Forms`, `Layout` or `Overlays`. A new section goes in `SECTIONS` in `plopfile.js` and in `storySort` in `apps/docs/.storybook/preview.ts`.

This creates `packages/ui/src/components/<Name>/` with:

| File | Contains |
| --- | --- |
| `<Name>.tsx` | The component, and nothing else |
| `<Name>.types.ts` | `<Name>Props` and any other public types |
| `<Name>.variants.ts` | CVA config (`<name>Variants`) and `<Name>VariantProps`; only if it has variants |
| `<Name>.stories.tsx` | Stories, titled `<Section>/<Name>` |

It also appends the exports to `packages/ui/src/index.ts`. After generating, edit the generated files to build the component out. Keep each kind of code in its own file: no CVA calls in `.tsx`, no prop interfaces in `.tsx`. If a component needs variants later, add `<Name>.variants.ts` following the template, then export it from `index.ts`.

### Compound components

A compound component is built from parts the consumer composes (`Card` from `CardImage`, `CardTitle`, `CardAction`, …). Generate the parent with `pnpm gen component`, then generate each part, again only with the generator:

```sh
pnpm gen part <Parent> <PartName> "<one-line description>" <root-element> <y|n>
# e.g.
pnpm gen part Card CardTitle "Heading of a Card." h3 n
```

- `<Parent>`: an existing component folder.
- `<PartName>`: PascalCase, starting with the parent's name.

This creates `<PartName>.tsx`, `<PartName>.types.ts` and, with variants, `<PartName>.variants.ts` in `src/components/<Parent>/parts/`, and appends the exports to `index.ts`. Parts get no stories of their own: the parent's stories compose them and test them together. Parts read the parent's settings through CSS custom properties set on the parent (e.g. `--kl-card-border`), or through React context in `src/lib/` when they need more than styling.

Apart from `parts/`, don't add other files or folders (`index.ts` barrels, `utils.ts`, CSS files) to a component folder. Shared helpers go in `packages/ui/src/lib/`, including React context that one component provides and another reads (e.g. `lib/button-group-context.ts`).

## Component conventions

- Function components with `ref` as a regular prop (React 19). No `forwardRef`.
- Merge classes with `cn` from `src/lib/cn.ts`, with the consumer's `className` last.
- Set `data-slot="<kebab-name>"` on the root element.
- Spread remaining props onto the root element so native attributes and handlers pass through.
- Each component keeps a `Default` story, plus one story per meaningful variant or state.

## Testing

Tests are `play` functions in the component's stories, using `expect`, `fn` and `userEvent` from `storybook/test`. There are no separate test files. Every story also runs as a smoke test (it must render without errors), even without a `play` function.

Test behavior a consumer relies on, not styling: keyboard access and focus, event handlers firing (or not, when disabled), accessible names and roles, and defaults that prevent bugs (like `type="button"`). Don't assert on class names or computed styles. Put spies in `meta.args` (`onClick: fn()`) and group related assertions with `step()`.

Every story is also checked with axe (`@storybook/addon-a11y`), and violations fail `pnpm test`. Fix violations rather than disabling rules; if a rule must be turned off for one story, do it in that story's `parameters.a11y.config` with a comment explaining why. Stories render in light mode by default, so components with colored fills need a dark-mode story (`globals: { theme: "dark" }`) for contrast to be checked there too. See `Variants (dark)` in `Button.stories.tsx`.

## Styling and tokens

- Every Tailwind utility uses the `kl:` prefix (`kl:bg-surface`, `kl:px-3`). Unprefixed utilities aren't generated.
- Use the semantic tokens (`surface`, `fg-1`, `line`, `inverse`, …) in components, not the raw palette (`slate-200`, `sage-500`); dark mode works by swapping the semantic tokens.
- Tokens live in `packages/ui/src/styles/theme.css`. A token that references another token must use the prefixed name, `var(--kl-color-ink-900)`, because Tailwind doesn't rewrite `var()` references.
- Visual language: outlines in `line` (2px, or 3px on larger controls), hard offset shadows with no blur.

### Class lists

Write classes as an array with one class per element, never as a single space-separated string. This applies everywhere classes are written: the CVA base, every CVA variant value, `compoundVariants`, and `cn()` calls.

```ts
cva(
  [
    "kl:inline-flex",
    "kl:items-center",
    "kl:gap-2",
    "kl:px-3",
    "kl:py-2",
    "kl:font-medium",
    "kl:text-sm",
    "kl:bg-surface",
    "kl:text-fg-1",
    "kl:border-2",
    "kl:border-line",
    "kl:rounded-md",
    "kl:shadow-sm",
    "kl:transition-colors",
    "kl:hover:bg-sunken",
    "kl:focus-visible:outline-2",
    "kl:disabled:opacity-50",
  ],
  { variants: { size: { sm: ["kl:px-2", "kl:py-1"] } } },
);

cn(["kl:flex", "kl:gap-2"], className);
```

Order the classes by utility category, in this order:

1. Layout and position: `block`, `flex`, `grid`, `relative`, `absolute`, `inset-*`, `z-*`, `overflow-*`
2. Flex and grid: `flex-*`, `grid-cols-*`, `items-*`, `justify-*`, `gap-*`
3. Sizing: `w-*`, `h-*`, `size-*`, `min-*`, `max-*`
4. Spacing: `p*`, `m*`
5. Typography: `font-*`, `text-<size>`, `leading-*`, `tracking-*`, `truncate`
6. Color: `bg-*`, `text-<color>`, `fill-*`, `stroke-*`
7. Borders: `border-*`, `rounded-*`, `outline-*`, `ring-*`
8. Effects: `shadow-*`, `opacity-*`
9. Motion: `transition-*`, `duration-*`, `ease-*`, `animate-*`
10. Interaction: `cursor-*`, `select-*`, `pointer-events-*`
11. Classes with state or responsive prefixes (`hover:`, `focus-visible:`, `disabled:`, `data-[...]:`, `md:`) come last, grouped by prefix in that same order. Within each prefix, sort by the categories above.

Keep the array on one line if it fits within ~100 characters; otherwise put one class per line.

## Git

Don't add `Co-Authored-By` trailers or any other Claude or Claude Code attribution to commit messages or pull request descriptions (no "Generated with Claude Code" lines).

## Before finishing

Run `pnpm typecheck`, `pnpm test` and `pnpm build`. Changes that affect `@keyline/ui` consumers need a changeset (`pnpm changeset`).
