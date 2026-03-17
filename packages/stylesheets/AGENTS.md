# AGENTS Guide: @nightshadeui/stylesheets

## Purpose

`@nightshadeui/stylesheets` defines Nightshade’s CSS foundation: variables, semantic mappings, base element styles, utility classes, and optional modules.

## Existing Architecture

- Entry: `index.css` imports all core variable and utility files.
- Layering: imports use `layer(nightshade)` and should stay consistent.
- Modules: more opinionated extras not included in core, those are exported separately and must be imported explicitly by the users.
- Package exports:
  - `.` -> `index.css`
  - `./dynamic-palette`
  - `./kbd`
  - `./transitions`

## Variable System Conventions

- Variables are layered and delegated, not flat.
- Main naming families:
  - `--color-<token>-<scale>` for color ramps (`base`, `primary`, etc.; scales like `0..950`).
  - `--ui-<token>-*` for semantic UI assignments (`surface`, `border`, `focus`, etc.).
  - `--input-*` for sizing/radius/input rhythm.
  - `--sp*` for spacing scale.
- UI classes map semantic token sets into generic active vars:
  - `.ui-base`, `.ui-primary`, etc. provide `--ui-*` values.
- Size classes map input metrics:
  - `.input-size-xs|s|m|l|xl`.

## Utility/Module Conventions

- `commons.css`: global reset/base semantics.
- `util.css`: small, single-purpose utility classes.
- `modules/*`: opt-in extras with dedicated entrypoints and index files.

## Dynamic Palette Conventions

- Dynamic palette uses OKLCH for generating color ramps using a few input variables.
- Those are generated at runtime, thus Browser must support OKLCH. Because of this it's not included by default.
- A recommended approach for most users is to use a static palette generator.

## Editing Rules

- Use existing variable naming schema.
- Use existing token vocabulary.
- Preserve existing naming and token vocabulary; avoid parallel alias systems.
- If adding a new module, export it in `package.json` and include an `index.css` entry for that module.
- Keep classes composable and low-specificity.

## Useful Commands

- Build is consumed via workspace build: `npm run build`
