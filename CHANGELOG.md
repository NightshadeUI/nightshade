# Changelog

## 3.2.0

- `@nightshadeui/components`: a disabled `Btn` or `Chip` on another tag (a link, a `RouterBtn`) no longer shows hover, focus or press states.
- Docs: palette spec examples keep the required `secondary` ramp.
- `@nightshadeui/util`: `createGridDotsSvg` and the unused `createGridLinesSvg` are gone; the canvas draws its own grid.
- `@nightshadeui/cli`: needs Node 22.12 or later (commander 15).
- `@nightshadeui/docs`: VitePress 2.0.0-alpha.21 and Shiki 4.

## 3.1.1

- `@nightshadeui/cli`: restore the `nightshade` bin again; 3.1.0 shipped it broken. `bump-version` (`@flexent/repo-tools` 2.20.1) now rewrites only dependency fields.

## 3.1.0

- `@nightshadeui/cli`: restore the `nightshade` bin, which 3.0.0 shipped as `"3.0.0"`, so the CLI wasn't installed.
- `@nightshadeui/components`: a bound `undefined` prop (`:tone="item.tone"`) no longer blocks `$nightshade.defaults`; `InputText` and `InputTextarea` emit the `input` they declare.
- `@nightshadeui/palette-generator`: `PaletteSpecSchema` checks ramp names (lowercase kebab-case) and ranges; the generator refuses repeated or reserved (`inverse`) ramp names and curves without twelve values.
- `@nightshadeui/docs`: `@nightshadeui/particle-system` is an optional peer: register `HeroBackdrop` from `@nightshadeui/docs/hero-backdrop` to use `backdrop: true`, which now also takes a component name. Register only the standard components; fix the header actions layout; compose `router.onAfterRouteChange`; count a section's landing as part of the section and match paths with or without a trailing slash; `ToneRoles` shows `--tone-tint-text`; `SpacingScale` and `InputSizes` measure the page's own values.
- `@nightshadeui/components`: knobs that broke the variable grammar are renamed: `--Bubble-filter` and `--Tab-filter` (they feed `filter`), `--Checkbox-mark-text-shadow`; flat controls set shadow colors to `transparent`, not `none`. A disabled `Btn` on another tag (a link, a `RouterBtn`) drops its `href`, leaves the tab order and swallows clicks; disabled `Checkbox`, `Toggle` and `Slider` leave the tab order; `InputGroup` joins the frames of wrapped inputs; an `InputBase` tab label follows tone overrides; the unrendered `MenuItem.children` is gone.
- `@nightshadeui/canvas`: its knobs are component knobs, defaulted from roles: `--CanvasView-*` (the grid dots are `--CanvasView-grid-major-fill` and `-minor-fill`) and `--CanvasBoxSelect-fill`, replacing `--canvas-*`.
- `@nightshadeui/methodology`: the token checker flags `-color` and `-surface` suffixes on any variable, declared or read; tone roles may read canvas roles, never the reverse.
- `@nightshadeui/docs`: `ToneMatrix` renders any control through its `{ tone, size }` slot and sits in a `<Demo>`; `<Demo dual stacked>` stacks the schemes; a test keeps the variable catalog and the stylesheets in sync.
- Website: every control page ends with every tone at every size in both schemes; new demos for `BaseMenu`, the Bubble sides and alignments, ToolPanel sizes, `InputGroup` sizes and segments, Checkbox slots, and combinations.
- Docs: corrected migration guide (inverse step mirror, `--color-base-text`, a valid palette spec, the full gap table, a broader rename script, and the changes it missed).

## 3.0.0

A redesign of the token model: tiers, tones over scheme-aware ramps, a finite role vocabulary, and components that inherit tone and size. `@nightshadeui/core` is now `@nightshadeui/components`, and `@nightshadeui/docs` is new. See [Migrating to 3.0](packages/website/pages/migration.md).
