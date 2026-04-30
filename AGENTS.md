# Nightshade AGENTS Guide

Nightshade is a Vue-focused UI system workspace containing:

- `@nightshadeui/core` (`packages/core`) for Vue UI primitives and layout helpers
- `@nightshadeui/stylesheets` (`packages/stylesheets`) for shared CSS tokens/utilities/modules
- `@nightshadeui/gallery` (`packages/gallery`) for the VitePress demo/showcase app
- `nightshade` (`packages/nightshade`) as the thin umbrella distribution package

This file is the single source of guidance for repository changes.
Follow this guide for all edits in the workspace.

## Guidelines

### Code Rules

- Keep modules focused and small.
- Prefer explicit exports over wildcard aggregators inside package internals.
- Use named exports for reusable constants and helpers.
- Keep vocabulary aligned with existing names and token families.
- Use consistent formatting: 4-space indentation and trailing commas in multiline arrays/objects/exports.
- Avoid adding runtime logic to umbrella/packaging files (`packages/nightshade/*`).

### Component Rules

- In SFC components, use Vue Options API (`props`, `data`, `computed`, `methods`), not `<script setup>`.
- Drive visual variants through token classes (`ui-*`, `input-size-*`) and computed style objects (`baseStyle`, `effectiveStyle`).
- Use component-scoped CSS for mapping tokens to sub-elements and modifiers.
- Keep props aligned across controls where relevant: `kind`, `size`, `flat`, `round`, `outline`, `disabled`, `force*`.
- Emit `update:modelValue` for v-model-compatible controls.
- Use modifier/state classes with component prefixing (`Component-modifier`).
- Use PascalCase for component names and sub-elements; sub-elements are not prefixed with the component name (for example, `Label` not `Btn-Label`).
- Prefer concise, contextual sub-element names and avoid redundant semantics (for example, `BodyContent` -> `Content`).
- Preserve slot names where relevant: `before`, default, `after`.

### CSS Rules

- Keep `packages/stylesheets/index.css` as ordered layered imports with `layer(nightshade)`.
- Prefer CSS variables over hardcoded values.
- Keep naming aligned to existing families:
  - `--color-*`
  - `--ui-*`
  - `--input-*`
  - `--sp*`
- Keep utilities single-purpose and low-specificity.
- Prefix component-local variables by component name (`--Btn-*`, `--InputBase-*`, `--Toggle-*`).
- Define component-local variable defaults on the component root class (for example, `.Btn`, `.Bubble`) and consume without per-usage fallbacks in descendants.
- Prefer tokenized sizing/spacing (`--sp*`, `--input-*`, `--ui-*`) over literal `px` values when equivalent tokens exist.
- Avoid redundant wrappers when one container can express structure and styling.
- Group styles in readable blocks: base, states, variants/modifiers.

### Documentation Rules

- Keep Markdown concise and scannable with short sections and practical examples.
- Use fenced code blocks with language hints for commands and snippets.
- Prefer sentence-style prose over dense paragraph walls.
- Insert one blank line between Markdown blocks (headings, paragraphs, lists, code fences, frontmatter-adjacent sections, and HTML/component blocks).
- Keep naming and terminology consistent with package names and token vocabulary.

### Stylesheets Rules

- Treat token and variable conventions as repository-wide, not package-specific.
- Keep `packages/stylesheets/index.css` as ordered layered imports with `layer(nightshade)`.
- Variables are layered/delegated, not flat.
- Keep naming aligned to existing families:
  - `--color-<token>-<scale>` for palette ramps
  - `--ui-<token>-*` for semantic UI assignments
  - `--input-*` for sizing/radius/rhythm
  - `--sp*` for spacing scale
- Preserve class token conventions used across the system:
  - `ui-*` for semantic themes
  - `input-size-*` for sizing
- Prefix component-local variables by component name (`--Btn-*`, `--InputBase-*`, `--Toggle-*`).
- Define component-local defaults on component root classes and consume without per-usage fallbacks in descendants.
- Keep utilities single-purpose and low-specificity.
- Keep classes composable and avoid parallel alias systems.
- Prefer tokenized spacing/sizing over literal `px` values when equivalent tokens exist.
- If adding a stylesheets module, export it in `package.json` and include a module `index.css` entrypoint.

### Commit Rules

- Do not commit changes unless explicitly instructed.
- Use Conventional Commits when committing.
- Commit format: `type: short summary` (lowercased, no trailing period).
- Allowed commit types: `feat`, `fix`, `docs`, `chore`, `style`, `refactor`, `build`.

## Package Notes

### `@nightshadeui/gallery`

- `@nightshadeui/gallery` is the VitePress demo/showcase app for component and token behavior.
- Keep gallery changes teaching-oriented and concise.

### `nightshade`

- `nightshade` is a thin umbrella package; avoid runtime logic here.
- Keep packaging and export layers minimal and aligned.

## Change Checklist

- [ ] Scope changes to the correct package(s).
- [ ] Follow all repository-wide rules in this file.
- [ ] Keep docs concise/scannable and use proper fenced code blocks.
- [ ] Run relevant build/dev checks (`npm run build` or package-specific scripts).
- [ ] Ensure commit messages follow Conventional Commit format when committing.
