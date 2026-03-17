# AGENTS Guide: @nightshadeui/core

## Purpose

`@nightshadeui/core` contains Nightshade Vue UI primitives and layout helpers. It is intentionally small and built around the same styling model as the CSS package.

## Shared Repository Guidelines (Required)

All edits in this package must follow the shared repository guidelines in `docs/GUIDELINES.md`.

## Existing Architecture

- Component style: Vue SFCs in `src/components/*.vue`.
- SFCs use JavaScript, not TypeScript.
- JS style: Options API (`props`, `data`, `computed`, `methods`), not `<script setup>`.
- Exports:
  - `src/components/index.ts` exports each component explicitly.
  - `src/index.ts` re-exports components and `coreComponents` namespace.
- Build: Vite library build with `vite-plugin-dts` and Vue externalized.

## Styling Conventions (Important)

- Every interactive primitive maps to Nightshade token classes:
  - `ui-${kind}`
  - `input-size-${size}`
- Component-local CSS variables use `--<Component>-*` naming and delegate to shared tokens (`--ui-*`, `--color-*`, `--input-*`, `--sp*`).
- Put component-local default values on the component root class, then consume them without inline fallbacks in descendants (prefer `var(--Component-foo)` over `var(--Component-foo, ...)`) to keep CSS layer overrides predictable.
- Modifier/state classes follow `Component-modifier` naming:
  - examples: `Btn-round`, `InputBase-flat`, `Toggle-active`.
- Styles are `scoped` by default.
- PascalCase classes are used for component names and sub-elements. Unlike modifiers, sub-elements are NOT prefixed with component name (e.g. use `Label` instead of `Btn-Label`).
- Visual behavior is mostly CSS-variable driven; avoid hardcoded colors/sizing when a shared token exists.
- Some common props are used across different components (where applicable):
  - kind
  - size
  - flat
  - round
  - outline
  - disabled

## Behavioral Conventions

- Repeated style override pattern is used in interactive components:
  - `baseStyle` computed
  - `effectiveStyle` computed merged with `hoverOverrides` / `focusOverrides` / `activeOverrides`.
- `tagName` is used to allow rendering a generic component as a different HTML element, those must have a default.
- Internal interaction state is tracked with local booleans (`hover`, `focus`, `active`) and class bindings.
- `v-model` components emit `update:modelValue`.

## Design-System Rules For New Components

- Treat `Btn` and `InputBase` as style primitives.
- New controls should inherit their frame/focus/radius/size patterns from those primitives.
- Prefer composing existing components (`InputBase`, `HGroup`, `VGroup`, etc.) before inventing new low-level patterns.
- Keep APIs compact and prop names aligned with existing components (`kind`, `size`, `flat`, `round`, `outline`, `disabled`, `force*`).

## Do / Don’t

- Do keep exports explicit and stable.
- Do keep CSS variable naming consistent with existing component prefixing.
- Do add only minimal new props required by real usage.
- Don’t add external runtime dependencies.
- Don’t bypass token classes with ad-hoc inline styles unless unavoidable.

## Useful Commands

- Build: `npm run build -w @nightshadeui/core`
- Watch build: `npm run build:watch -w @nightshadeui/core`
