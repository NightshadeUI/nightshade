<!-- nightshade-methodology:begin -->
# Nightshade methodology

This project's design system grows from Nightshade: a few principles, styles as CSS variables, and a generated palette. The app owns everything it grows. Speak the existing vocabularies, and extend one before adding a parallel one.

These are the always-on rules. For the token catalog, the palette workflow, component recipes and the token checker, use the `nightshade` skill (installed under `.agents/skills/nightshade`).

## Tiers

- **Four tiers, and each reads only the tiers before it:** raw values → context → roles → component variables. Sizes have no role tier: raw values → context → component. Inside a tier the order holds too: settings may pick a scale step, and tone roles may read canvas roles (`--tone-shadow: var(--shadow-medium)`), never the reverse.
- **Raw values** come in two shapes. Scales are enumerable ladders: `--color-<ramp>-<step>` and `--color-<ramp>-contrast`, `--sp*`, `--radius-s|m|l`, `--font-size-*`, `--font-weight-*`, `--gr*`, and the control sizes `--input-size-<size>-<metric>`. Settings are single values: `--font-main|alt|monospace`, `--font-size`, `--font-weight`, `--line-height` and `--line-height-main|alt|monospace`, `--input-border-size`, `--input-outline-size|offset`, and the shared states below.
- **Context** is set by classes on a subtree. `.tone-<tone>` points the context ramp `--tone-0` … `--tone-950` at one ramp. `.input-size-<xs|s|m|l|xl>` sets `--input-major-height`, `--input-minor-height`, `--input-major-padding`, `--input-minor-padding`, `--input-gap` and `--input-font-size`. `:root` is the default context: tone `base`, size `m`.
- **Roles** are the meaning, stated once:
  - Canvas roles: `--surface-base`/`--border-base`, `--surface-shade`/`--border-shade`, `--surface-deep`/`--border-deep`, `--surface-raised`/`--border-raised`, `--surface-overlay`, `--text-base|subtle|faint`, `--shadow-light|medium|heavy`, `--text-shadow-auto`, `--translucency-*`.
  - Tone roles: `--tone-text`, `--tone-tint`, `--tone-tint-text`, `--tone-fill`, `--tone-fill-top|bottom`, `--tone-fill-text`, `--tone-border`, `--tone-shadow`, `--tone-focus-outline|border`. They resolve against whatever tone context they're read in.
  - This list is complete. Add a role only when every tone (or every canvas level) can answer it.
- **Customize at your `:root`**, in a cascade layer after Nightshade's: scales and settings change the character, roles change the meaning. Never copy a component's CSS to change one value.

## Color

- `palette.css` is generated from the project's palette spec with `npx nightshade palette`, and imported next to `@nightshadeui/stylesheets`, which brings none. Never edit it by hand: change the spec, regenerate, and commit both. The starter `@nightshadeui/stylesheets/palette.css` is for prototypes only.
- The spec must have `base`, `primary` and `secondary` ramps: the styles read them by name (neutral controls focus in `secondary`). Every other ramp is the app's choice.
- A new tone is a new ramp in the spec, and the generator emits its `.tone-<name>`. Never hand-write per-tone variables or roles.
- **Multi-tone components** (controls meant to work in any tone: buttons, inputs, toggles, chips) read roles, and the context ramp (`--tone-200`) when no role fits. They never read `--color-*`, so one `.tone-*` class re-tones them.
- **Single-tone components**, which is most of what an app builds, may read ramp steps directly (`--color-primary-600`, `--color-base-100`). Prefer a canvas role when one names the use (`--surface-deep` for a well).
- Nothing outside the palette and roles calls `light-dark()`: every ramp step is already scheme-aware.
- `--surface-*` are levels of the page (base, then shade, then deep), each with its `--border-*`. `--tone-fill` is a control's solid fill. Don't mix the words.
- `--shadow-*` and `--tone-shadow` are reference colors, not full shadows. Each component owns its shadow geometry.
- Role names are two words or more (`--text-base`, never `--text`) and carry no type suffix (`--tone-fill`, not `--tone-fill-color`).

## Size

- Lengths are multiples of `--sp`: `--sp0-5`, `--sp1`, `--sp1-5`, `--sp2`… Prefer a token over a literal `px` whenever one exists.
- Single-line controls have a fixed height, `--input-major-height`, and are `border-box`, so they land on the grid. Elements inside or beside them (knobs, toggles, checkboxes) take `--input-minor-height`.
- A control's padding includes its border: `padding: 0 calc(var(--Btn-padding) - var(--Btn-border-size))`. `border-box` only holds a box that has a set size; this keeps a content-sized one the same size and its content in place when `outline` adds a border.
- A round control's radius is half its own height (`calc(.5 * var(--Btn-size))`), never a radius token.

## Components

- Each component exposes its knobs as `--<Component>-*`, defaulted on its root class from roles and the size context, and read without per-use fallbacks.
- **One grammar for those variables.** Named after a role, they hold a color (`--Btn-fill`, `--Chip-text`, `--Toggle-border`, `--Btn-shadow`). Named after a CSS property, they hold a full value (`--Btn-background`, `--Btn-box-shadow`, `--Toggle-border-size`). Parts go in between (`--Slider-track-background`). No `-color` and no `-surface` suffixes.
- **States are shared:** `--input-disabled-opacity|filter`, `--input-hover-overlay` for filled controls, `--input-hover-filter` for wells. Focus rings use `:focus-visible` (text fields: `:focus-within`).
- **Controls draw their props from one set,** and take the ones that apply: `tone`, `size`, `flat`, `outline`, `round`, `translucent`, `disabled`, `force*`. No prop means something else on another control. `tone` and `size` have no default: when they're omitted the control inherits the context, so add the `.tone-*` or `.input-size-*` class only when the prop is set.
- Root and sub-element classes are PascalCase and short (`Btn`, `Label`). Modifier and state classes are prefixed with the component and camelCased (`Btn-flat`, `Toggle-forceFocus`).
- Set a look for a region with a context class, and for the whole app with `$nightshade.defaults`. Don't repeat the same props on every instance.
- If the project uses `@nightshadeui/components`, wrap or restyle those components through their variables before writing a new one. If it uses another library, map that library's variables to the roles once, at `:root`.

## Process

- After touching CSS, run `npx nightshade-methodology tokens <dir>` and fix what it reports.
- After changing the palette spec, regenerate `palette.css` and check both color schemes.
<!-- nightshade-methodology:end -->

<!-- flexent-methodology:begin -->
# Flexent methodology

This repository follows the Flexent methodology: OOP-first code guidelines for TypeScript, Vue and mesh-ioc. Read what's around you and match it. Never invent a new approach where a local one exists.

These are the always-on rules. For the reasoning, patterns, recipes and the structure checker, use the `flexent` skill (installed under `.agents/skills/flexent`).

## Structure

- **Never mix top-level functions and classes in one module.** A class module is `PascalCase.ts`, named after its class. Functions live in kebab-case helper modules (`helpers/`, or the `util` package when generic).
- **One role per directory.** `managers/`, `controllers/`, `scenes/`, `views/`, `components/`, `pages/`, domain family directories (`objects/`, `generators/`, …), `forms/`, `helpers/`. Don't drop a helper into a class directory or a class into a helper directory.
- **Don't add ad hoc helper modules.** Put the behavior on the class that owns it, or in an existing helper that already does that job. Create a new helper module only when asked.
- **Dependencies point down:** apps → framework packages → domain packages → utility packages. Domain packages are framework-free.

## State

- **One source of truth per fact.** A setting has one shape: the shape its form produces. Don't mirror it, and don't restate its defaults elsewhere.
- **Decode at the boundary.** Storage, files, clipboard and HTTP input are `unknown` until a schema or form decodes them. Past the boundary, trust the types.
- **Single ownership.** Instances deep-copy what they're given and hand out copies (`toData()`). Nothing keeps a live reference into another instance's data.
- **Use scopes sparingly.** Use a scope only when several classes share state bound to one lifecycle instance (request, connection, session, spawned process); otherwise keep it a plain object, a field on the owner, or an instance the owner connects with `mesh.connect`. A scope is a `<Unit>Scope extends Mesh`, registered with `mesh.scope()` and created through an injected `@scope()` provider.
- **Derived engines are raw.** Scenes, simulations and Three.js or Manifold objects are stored with `markRaw` and never persisted.

## Frontend

- Use the Vue Options API. Never use `<script setup>`, and don't write composables.
- Logic lives in classes: app-scoped `@provide`d managers, or controllers a manager creates with `mesh.connect` (views never construct them). In Vite apps, inject with `dependency(this, X)`. In Node, use `@dep()`.
- Views `inject` managers. Components use props and events only. Pages are thin.
- Managers never watch each other. A coordinating manager sequences actions that touch several.
- Three.js and Manifold code lives in lazily loaded `scenes/` (or workbench chunks) and never in pages, views, components or managers.
- Prefer Nightshade components and design tokens over native elements and custom CSS.

## Code

- **Make contracts carry invariants.** If every caller re-checks the same preconditions, move the check into the producer.
- **Don't write excessively defensive code.** No guards against your own contracts.
- **Don't invent accidental complexity.** Prefer fewer entities, layers, flags, branches and arguments. No speculative features.
- **Name methods as verb plus object** (`openProject`, `deleteProject`). `remove` takes an element out of a list; `delete` destroys an entity.
- **Don't fake English with Of/For names** (`idsOf`, `pathFor`). Name the value.
- **Don't type-narrow thrown errors.** Use `catch (error: any)` and read `error?.message`.
- **Never collapse multi-key object literals onto one line.**
- **Always fix lint errors.** A long-method warning means the method has two jobs.
- **Fix inconsistencies you notice**, or add them to `TODO.md`. When two ways exist, follow the dominant one and never add a third.

## Process

- Don't commit unless asked. Use Conventional Commits (`type: short summary`).
- Run `tsc -b`, the linter and the package tests before reporting done.
<!-- flexent-methodology:end -->

## Nightshade

Nightshade is a seed for application-owned design systems: principles, styles as CSS variables, and a palette generator. Standard Vue components and other packages are opt-ins. It is published as a set of `@nightshadeui/*` libraries. It is not an end-user app: there is no app container, no mesh-ioc and no managers in the packages. Read the Flexent rules above through that lens.

### The model

Principles → styles (`stylesheets`) → the app's own system. Simplicity is the first principle. Everything else is an opt-in that orbits: the palette generator (`palette-generator`, `cli`, the website's Palette Studio) writes the styles' `palette.css` and nothing else; `components`, `canvas`, `particle-system`, `scroller` and `content-editor` plug into the app, and `docs` gives the app's system a site of its own. The styles never depend on an opt-in.

### Packages

- Styles: `stylesheets` (generated palette, scales, context, roles, base, utilities, modules).
- Palette generator: `palette-generator` (scheme-aware OKLCH ramps and tone contexts, `PaletteSpecSchema`), `cli` (`nightshade palette`).
- Standard components (opt-in): `components` (Vue controls and layout). Depends on `stylesheets`.
- Other opt-ins: `canvas`, `particle-system`, `scroller`, `content-editor` (private prototype).
- Docs theme (opt-in): `docs`, a VitePress theme for an app's own design-system site: the frame, a landing, `defineDocsConfig` and live references (variables, palette, tones, scales) that read the site's styles. Sites configure it through `themeConfig` and extend it with `extends: DocsTheme`. It knows nothing about Nightshade's own site. Its frame is single-tone, like an app's: it may read `base`, `primary` and `secondary` steps, and any other ramp only with a fallback to one of them. It ships sources, which the site's Vite compiles (`defineDocsConfig` keeps them out of pre-bundling).
- Utility: `util` (geometry helpers, `dom/` input classes, `readStored`/`writeStored`). Framework-free.
- Distribution: `nightshade`, a thin umbrella package. No runtime logic here.
- Methodology: `methodology`, the rules and the `nightshade` skill for apps grown from the seed. Its `AGENTS.md` is the source of the Nightshade methodology block above (synced with `npx nightshade-methodology sync`). When the model, tokens or grammar change, update it and the skill references with them.
- Website: `website`, the VitePress documentation site (private). It is an app grown from the seed, built on the `docs` theme: its navigation is its `themeConfig`, and the Palette Studio, the look playground and the opt-in demos are its own.

### Library conventions

- Components are the public API. They take props and emit events; they never `inject` app state. `$nightshade.defaults` is the only provided value.
- A component with real behavior (animation loops, scroll tracking, editing) delegates to a controller class in the same package (`ParticleSystemController`, `ScrollerController`, `ContentEditor`). Controllers are plain classes with `mount`/`unmount` and reactive state; consumers can use them without the component.
- Packages are directories by role: `components/`, `editor/` or the controller at `src/`, `helpers/`, `dom/`, `schema/`. Keep `index.ts` the only aggregator.
- Keep the `./src` subpath export on every package; the website and sibling packages import sources through it. Don't remove an export subpath without a major version.
- Package versions are kept in lockstep. Inter-package dependencies use exact versions; `bump-version` keeps them in sync.
- The website is the one app-shaped package: site-wide state lives in `managers/` classes, provided once from the theme's `enhanceApp`. `views/` inject managers, `components/` take props only, `pages/` are Markdown and stay thin (no `<script setup>`; site views and components are registered globally).

### Components and CSS

The Nightshade methodology block above applies to the packages too: tiers, roles, the variable grammar, the prop grammar and class naming. On top of it:

- The standard components and the opt-ins' components are multi-tone: they read roles and the context ramp, never `--color-*`. The website is an app, and its single-tone views and components may read ramps directly.
- Drive visual variants through context classes (`tone-*`, `input-size-*`) and computed style objects (`baseStyle`, `effectiveStyle`).
- Emit `update:modelValue` for v-model controls, and preserve the slot names `before`, default and `after`.
- `packages/stylesheets/index.css` is an ordered list of layered imports with `layer(nightshade)`, in tier order: `scales/` → `settings/` → `context/` → `roles/`, then `base.css` and `utilities.css`. It doesn't import `palette.css`: apps bring their own, and the shipped one is a starter (the generator's defaults) that only the website imports. A new module is exported in `package.json` and has its own `index.css`.
- `palette.css` is generated with `npm run palette -w @nightshadeui/stylesheets`. The neutral contexts (`:root` = base, `.tone-inverse` = base mirrored) live in `context/tones.css`, and the neutral role overrides in `roles/tones.css`. The styles read `base`, `primary` and `secondary` by name (`REQUIRED_RAMPS` in the generator); never make them depend on another.
- Keep utilities single-purpose and low-specificity, and don't add parallel alias systems.
- Use scoped component CSS, grouped as base, states, then variants and modifiers. Avoid wrappers that one container can replace.
- Run `npx nightshade-methodology tokens packages` before reporting done.

### Docs

- Keep Markdown short and scannable, with practical examples and fenced code blocks with language hints.
- Put one blank line between Markdown blocks, including around HTML and component blocks.
- Website pages teach: one concept per section, concise copy, live demos in `<Demo>`. Site navigation is the `themeConfig` in `.vitepress/config.ts` (`sections` and `topLinks`), in model order; `SiteManager` reads it. The site uses Source Sans 3, Cormorant Garamond (h1 and h2 titles and the wordmark, weight 600; h3 and below use Source Sans 3, with h5 and h6 in spaced uppercase) and Source Code Pro; no eyebrows outside the home hero.

### Process

- Commit types: `feat`, `fix`, `docs`, `chore`, `style`, `refactor`, `build`.
- Before reporting done: `npm run build`, `npm run lint`, `npm test`.
- Release with `npm version <bump>`: it builds, syncs workspace versions with `bump-version`, pushes, then publishes every non-private workspace.

### House rules

- Don't test in a browser unless asked. Code, lint and reading the source are enough.
- Always lead with a joke when providing updates. It has to be funny.
