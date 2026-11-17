# Changelog

## Unreleased

- `@nightshadeui/components`: `Chip` takes `ghost`, same as `Btn`. Chosen chips and buttons drop it; the rest stay ghost. Don't use `outline` as selected. `Toggle` no longer subtracts its border from the knob offset. Component CSS sits in `nightshade-components` and does not declare cascade order; the app's CSS entry does that once.
- `@nightshadeui/docs`: the theme's CSS sits in `nightshade-docs` and does not declare cascade order.
- Website: TokenChain's step connector no longer subtracts `1px` to overlap a border.
- Docs and website: tone and look pickers follow that (TokenChain, RoleVocabulary, Palette Studio, the variable reference, the playground bar). Anatomy already did.
- Methodology: `outline` is a look, not selected. Keep the border static and content doesn't jump, so you don't subtract it from padding. Chosen drops `ghost`.
- `@nightshadeui/stylesheets`: `--line-height` is `--sp2`, inherited by the app so single-line controls fit the grid. `--line-height-prose` is `1.5` (a ratio) for running text, with a `.prose` class. The type scale is simple pixels: 8, 10, 12, 14, 16, 20, 24, 40, 88 (`xxxs` … `xxxl`). Never `em` or `rem` except `letter-spacing`. Type sits on `body`, not `html`.
- `@nightshadeui/docs`: prose rules stop at live references as well as `<Demo>`, so catalog headings don't pick up the article `h2` border. The theme does not map `h1`–`h6` (no font-size, family or weight on tags): the site's system does, in its cascade layer. The stance `yours` is now `specify`, so the stances read: Specify, Fine tune, Override with care, Do not override. `variableGroups` entries with `stance: 'yours'` need the new name. The type size ladder is Specify throughout: each step is a knob, none is derived from `--font-size-m`.
- Website: the Tokens page is three public tiers (raw, context, role). Component locals are not a family, and `TokenChain` stops at the role or size context. Control grammar is how to write a reusable control: shared props, `--<Component>-*` defaulted on the root class from roles. Those locals are not a restyle API.
- `@nightshadeui/docs`: `ToneRoles` names the variables you write. Each label is the role (`--tone-fill`) and the context step it reads (`--tone-500`); hover the chip for the scale variable (`--color-primary-500`). Inverse fill is `--tone-0` → `--color-base-950`. Light and dark split the chip. Swatches follow the selected tone.
- `@nightshadeui/docs`: the variable reference is a public-token catalog. Each entry shows the specified CSS value (from the live sheets, Nightshade's definitions on the toolkit site, the system's winning values on a system's site), or one or two examples for a family (`--sp0-5`, `--sp2`). Tiers appear on each row. Component knobs (`--Btn-*` and the rest) are out: they are not tokens an app reads. The default view, `usage`, is a system's docs for the apps built on it, with no Read / Set on a class / Avoid cards. Nightshade's own site sets `variableView: 'foundation'` to keep Specify / Fine tune / Override with care / Do not override. `usage` on catalog entries, `VARIABLE_USES` and `readVariableUsage` are gone; `variableGroups` entries no longer take a `usage`.

## 3.2.1

- `@nightshadeui/stylesheets`: `--tone-text` reads step `600`, one step past the fill toward the ink end, so tone-colored text and links read on the canvas in both schemes. The docs theme's prose links and callouts follow.
- `@nightshadeui/docs`: `ToneRoles` is an anatomy figure: one app card taken apart, a leader from each of the eleven tone roles to the part it colors, with the ramp step it lands on (in a badge, split on a slash into light and dark where the schemes differ), and a switch for viewing one tone at a time. On narrow pages the leaders become numbered markers with a legend.
- `@nightshadeui/docs`: `outline: false` in a page's frontmatter hides the outline and gives its width to the content, keeping the sidebar. A `home` page with no content below the hero renders no empty section. The hero's secondary actions are outlined in the primary tone.
- `@nightshadeui/docs`: `rampSteps` lists a ramp's twelve steps.
- `@nightshadeui/particle-system`: `ParticleCanvas` takes `layers`, several systems drawn on one canvas by one frame loop, and pauses that loop while every layer is paused or the canvas is off screen. `ParticleCanvasController` is that renderer without Vue. `draw` is optional when `layers` is set. The particle list is shallow-reactive, so stepping particles no longer goes through Vue proxies: renderers redraw on `updated`.
- `@nightshadeui/docs`: `HeroBackdrop` draws its four emitters on one canvas from tone-colored sprites, instead of hundreds of DOM nodes, and still follows the palette and the color scheme live.
- Website: the home page takes the tone roles apart in a new Anatomy section, right after the model.
- Website: the playground bar shows Active only on pages with buttons, the one control with a pressed state, and turns a forced press off elsewhere. The Chip demo marks the chosen chip with a check, so the Outline switch reaches every chip.

## 3.2.0

- `@nightshadeui/stylesheets`: `--surface-raised` is now a real elevated surface: one step above the page in dark mode. It used to resolve to nearly white there, because the ramp is already scheme-aware. New `--surface-knob` keeps toggle and slider knobs light in both schemes. `Bubble` (and so popups and menus) and the slider tooltip sit on `--surface-raised`.
- `@nightshadeui/components`: new `Tooltip`, a `ContextPopup` that opens on hover or keyboard focus, with a title and a text or a slot for rich content, and the `v-tooltip` directive (`v-tooltip="'Saves the draft'"` or `v-tooltip="{ title, text }"`). `ContextPopup` takes an `anchorEl` and `anchorDir="auto"`, which anchors on the side it opens towards.
- `@nightshadeui/stylesheets`: the entry declares `@layer nightshade, nightshade-components` up front, so an app's own layer, declared after the import, wins over both. The `kbd` keycap is redrawn on the raised surface, flat, for both schemes.
- `@nightshadeui/components`: cherry-pick components. Each module imports its own CSS, so `import { Btn } from '@nightshadeui/components'` ships only Btn's styles. `@nightshadeui/components/css` still links them all. The `nightshade-components` layer is now in the sources, so `./src` and `dist` style alike. `@nightshadeui/util` is external, no longer bundled. `nightshade/css` is the styles only, because component CSS comes with the components.
- `@nightshadeui/docs`: the theme's CSS sits in the `nightshade-docs` layer, and its prose rules (headings, links, tables) stop at `<Demo>`. The theme no longer registers every standard component globally: its views import what they use, and the site registers the components its pages need.
- `@nightshadeui/scroller`: `t` is recomputed on resize too.
- `@nightshadeui/content-editor` is retired: the unfinished prototype is parked in `.archive/`.
- `@nightshadeui/components`: `HGroup` and `VGroup` take any step of the spacing scale as `gap`, through `--HGroup-gap` and `--VGroup-gap`, which a class can also set; `justify` takes `space-evenly`, and an unset `justify` no longer renders a stray class. `ToolPanel` drops a padding rule that restated the size context, and takes its size as a minimum height, so oversized contents keep its padding on every side.
- `@nightshadeui/docs`: `<Demo dual>` keeps both schemes the same width and scrolls content that doesn't fit, instead of pushing the second stage out. `ToneMatrix` sizes each column to its content, so it fits the stage, and its default button reads "Button".
- Every published package has a README.
- Docs: corrected the model's tier rule ("the tiers inside it"), the role-reassignment example (it rewrote ramp steps), stale role values, the palette import rule, the particle features, and the variable grammar, which now names metric variables (`--Btn-size`).
- Website: the Bubble sides and alignments demo gives each bubble its own anchor. The Scroller demo compares four anchor settings on one 2400px track. The particle demo stacks its preview above its controls. Raised surfaces get a section of their own on the Depth page.
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
