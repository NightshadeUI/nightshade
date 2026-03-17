# Nightshade Authoring Guidelines

## Code Guidelines

- Keep modules focused and small; prefer explicit exports over wildcard aggregators inside package internals.
- Use named exports for reusable constants and helpers.
- Keep formatting consistent with 4-space indentation and trailing commas in multiline arrays/objects/exports.
- Keep vocabulary aligned with existing names.
- Avoid adding runtime logic to packaging/umbrella files (`packages/nightshade/*`); keep them thin re-export layers.

## Component Guidelines

- Use Vue Options API in SFCs (`props`, `data`, `computed`, `methods`), not `<script setup>` in components.
- Drive visual variants through class tokens (`ui-*`, `input-size-*`), computed style objects (`baseStyle`, `effectiveStyle`). Add scoped CSS for mapping tokens to sub-elements and modifiers. Use minimal CSS for component-specific styling.
- Keep props consistent across controls (`kind`, `size`, `flat`, `round`, `outline`, `disabled`, `force*`).
- Emit `update:modelValue` for v-model compatible controls.
- For modifiers use explicit state class names with component prefixing (`Component-modifier`).
- Use PascalCase for component names and sub-elements. Unlike modifiers, sub-elements are NOT prefixed with component name (e.g. use `Label` instead of `Btn-Label`).
- Use concise, contextual sub-element names and avoid redundant semantics in one class name (e.g. `BodyContent` -> `Content`, `ButtonLabel` -> `Label`, `HeaderTitle` -> `Title`). Prefer not to use the same name for multiple elements in the same component.
- Maintain slot names (`before`, default, `after`) where relevant.

## CSS Guidelines

- Keep `packages/stylesheets/index.css` as ordered layered imports using `layer(nightshade)`.
- Prefer CSS variables over hardcoded values; follow existing naming families:
  - `--color-*`
  - `--ui-*`
  - `--input-*`
  - `--sp*`
- Keep utilities single-purpose and low-specificity.
- Keep component-local variables prefixed by component name (`--Btn-*`, `--InputBase-*`, `--Toggle-*`).
- Define component-local variable defaults on the component root class (e.g. `.Btn`, `.Bubble`) and reference those variables without per-usage fallbacks; avoid `var(--Component-foo, ...)` in descendants so CSS layer overrides work consistently.
- Prefer tokenized sizing/spacing (`--sp*`, `--input-*`, `--ui-*`) over literal `px` values when an equivalent token exists.
- Avoid redundant wrapper elements when one container can express structure and styling.
- Group styles in readable blocks: base, states, variants/modifiers.

## Docs Guidelines

- Keep Markdown concise and scannable with short sections and practical examples.
- Use fenced code blocks with language hints for commands and code snippets.
- Maintain sentence-style prose instead of dense paragraph walls.
- **Insert one blank line between Markdown blocks** (headings, paragraphs, lists, code fences, frontmatter-adjacent sections, and HTML/component blocks).
- Keep naming and terminology consistent with package names and token vocabulary used in code.

## Conflict Handling

- Follow both package-local `AGENTS.md` and this file.
- If there is tension, keep package-specific constraints and apply the stricter rule.
