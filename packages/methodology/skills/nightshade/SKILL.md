---
name: nightshade
description: Nightshade methodology, the guidelines for design systems grown from Nightshade (@nightshadeui/stylesheets, palette-generator, cli, components). Use when styling, theming or building UI components in a project whose AGENTS.md or CLAUDE.md mentions Nightshade, or that depends on any @nightshadeui package; when generating or changing a palette or adding a tone; when choosing a CSS variable for a color, surface, border, shadow, spacing or control size; when migrating from Nightshade 2.x; or when auditing CSS for tier and token drift. Covers the four tiers, the complete role vocabulary, the palette spec and CLI, the component variable grammar, app-wide defaults, recipes and a token checker.
---

# Nightshade methodology

Nightshade is a seed for an application-owned design system: principles, styles as CSS variables, and a palette generator. The short form of the rules lives in the project's `AGENTS.md`. This skill adds the catalog, the reasoning, the recipes and a checker.

## Workflow: styling or building UI

1. **Orient.** Find the project's palette spec (often `palette.json` or `design/palette.json`), the generated `palette.css`, and where the app imports `@nightshadeui/stylesheets` and declares its cascade layers. Look at two or three of the project's own components before writing a new one. Local precedent wins, and you must never add a third way of doing something.
2. **Name the tier of what you're changing**, then change it there:
   - The character of the whole system (grid unit, radius, type, a hue): a **scale**, at `:root`, or the palette spec.
   - A color for one region or one control: a **context** class (`.tone-danger`, `.input-size-s`), not new variables.
   - What a surface, border or text color *means* everywhere: a **role**, reassigned once at `:root`.
   - A control you write: default `--<Component>-*` on its root class from roles.
   Details: [references/model.md](references/model.md).
3. **Pick the variable from the vocabulary.** Read [references/tokens.md](references/tokens.md) for the full catalog with defaults. Decide first whether the component is multi-tone (it must work in any tone, like a button) or single-tone (one color scheme, like most app components). Multi-tone components read roles and the context ramp (`--tone-<step>`). Single-tone components may read ramp steps directly. Add a role only when every tone can answer it.
4. **Write components in the grammar.** Root-class defaults, role-named color locals, property-named value locals, shared states, context classes for `tone` and `size`. Details and a template: [references/components.md](references/components.md).
5. **Check before you report done:**
   - run `node <this-skill>/scripts/check-tokens.mjs <dir>…` (or `npx nightshade-methodology tokens <dir>…`) on the directories you touched, all in one run, and fix what you introduced;
   - if you changed the palette spec, regenerate `palette.css` ([references/palette.md](references/palette.md));
   - check light and dark: every ramp step is `light-dark()`, so a role that reads right in one scheme reads right in both, while a literal color doesn't.

## Workflow: auditing a codebase

1. Run `scripts/check-tokens.mjs` at the repository root.
2. Look for the four drift smells: ramp steps read in multi-tone components (a button that hard-codes `--color-primary-600` won't re-tone), hand-written per-tone variables, a second spacing or sizing system beside `--sp*` and the input sizes, and component CSS copied to change one value.
3. Report findings ranked by how far they spread. Fix only what was asked, and list the rest.

## Picking the right piece

| You need | Use | Reference |
|----------|-----|-----------|
| A new brand, status or plan color | A ramp in the palette spec, then `.tone-<name>` | [palette.md](references/palette.md) |
| A color for one region | A `.tone-*` class on the region | [model.md](references/model.md#context) |
| A denser or larger region | An `.input-size-*` class on the region | [tokens.md](references/tokens.md#control-sizes) |
| The whole app flat, round or dense | `$nightshade.defaults` | [components.md](references/components.md#app-wide-defaults) |
| A well, a panel, a divider | `--surface-*` and its paired `--border-*` | [tokens.md](references/tokens.md#canvas-roles) |
| A new control | A component on the grammar | [components.md](references/components.md#writing-a-component) |
| Your own design system package | The growing recipe | [recipes/growing.md](references/recipes/growing.md) |
| Cascade layer order | `nightshade`, `nightshade-docs`, `nightshade-components`, then yours | [model.md](references/model.md#cascade-layers) |
| Upgrading from 2.x | The renames and the script | [migration.md](references/migration.md) |

## Non-negotiables

- Each tier reads only the tiers before it.
- Multi-tone components read roles and the context ramp, never `--color-*`. Single-tone components may read ramps directly.
- Nothing outside the palette and roles calls `light-dark()`.
- `palette.css` is generated. A new tone is a new ramp.
- The role vocabulary is complete as listed. Role names are two words or more.
- Component variables follow one grammar: role names hold colors, property names hold full values.
- Lengths come from `--sp*`; control heights from the size context.
- `--line-height` is `--sp2` and is inherited; `--line-height-prose` is `1.5` for running text. Nightshade does not map `h1`–`h6`, `pre` or `code`: the app sets their sizes, and ratios for line-height, in its cascade layer (inline `code` only inside running text). Never `em` or `rem` except `letter-spacing`. Never subtract a border or a pixel from padding: `outline` is a look, not a state, so the box doesn't grow. Chosen drops `ghost`.
- Cascade layers, weakest first: `nightshade`, `nightshade-docs`, `nightshade-components`, then yours. The first `@layer` in the document is the order: declare it once in your CSS entry, and in a Vite app add `cssLayerOrder()` so it comes ahead of every stylesheet. Vue components never write `@layer`: the `cssLayer()` Vite plugin from `nightshade/vite` (or `@nightshadeui/vite`) puts their styles in a layer. Components never list the order. Stay in the layers; don't unlayer to win.
