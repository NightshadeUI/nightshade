<!-- nightshade-methodology:begin -->
# Nightshade methodology

This project's design system grows from Nightshade: a few principles, styles as CSS variables, and a generated palette. The app owns everything it grows. Speak the existing vocabularies, and extend one before adding a parallel one.

These are the always-on rules. For the token catalog, the palette workflow, component recipes and the token checker, use the `nightshade` skill (installed under `.agents/skills/nightshade`).

## Tiers

- **Four tiers, and each reads only the tiers before it:** raw values → context → roles → component variables. Sizes have no role tier: raw values → context → component. Inside a tier the order holds too: settings may pick a scale step, and tone roles may read canvas roles (`--tone-shadow: var(--shadow-medium)`), never the reverse.
- **Raw values** come in two shapes. Scales are enumerable ladders: `--color-<ramp>-<step>` and `--color-<ramp>-contrast`, `--sp*`, `--radius-s|m|l`, `--font-size-*`, `--font-weight-*`, `--gr*`, and the control sizes `--input-size-<size>-<metric>`. Settings are single values: `--font-main|alt|monospace`, `--font-size`, `--font-weight`, `--line-height` and `--line-height-main|alt|monospace|prose`, `--input-border-size`, `--input-outline-size|offset`, and the shared states below.
- **Context** is set by classes on a subtree. `.tone-<tone>` points the context ramp `--tone-0` … `--tone-950` at one ramp. `.input-size-<xs|s|m|l|xl>` sets `--input-major-height`, `--input-minor-height`, `--input-major-padding`, `--input-minor-padding`, `--input-gap` and `--input-font-size`. `:root` is the default context: tone `base`, size `m`.
- **Roles** are the meaning, stated once:
  - Canvas roles: `--surface-base`/`--border-base`, `--surface-shade`/`--border-shade`, `--surface-deep`/`--border-deep`, `--surface-raised`/`--border-raised`, `--surface-knob`, `--surface-overlay`, `--text-base|subtle|faint`, `--shadow-light|medium|heavy`, `--text-shadow-auto`, `--translucency-*`.
  - Tone roles: `--tone-text`, `--tone-tint`, `--tone-tint-text`, `--tone-fill`, `--tone-fill-top|bottom`, `--tone-fill-text`, `--tone-border`, `--tone-shadow`, `--tone-focus-outline|border`. They resolve against whatever tone context they're read in.
  - This list is complete. Add a role only when every tone (or every canvas level) can answer it.
- **Customize at your `:root`**, in your cascade layer: scales and settings change the character, roles change the meaning. Never copy a component's CSS to change one value.

## Cascade layers

- Nightshade's names, weakest first: `nightshade`, `nightshade-docs`, `nightshade-components`. Then libraries you wrap, then yours. Do not rename them, do not skip them.
- The first `@layer` in the document is the order. State it before any `@import`: `@layer nightshade, nightshade-docs, nightshade-components, acme`. A skipped name, first mentioned later, is appended.
- Stay in the layers. Unlayered CSS beats every layer; don't unlayer to win.

## Color

- `palette.css` is generated from the project's palette spec with `npx nightshade palette`, and imported next to `@nightshadeui/stylesheets`, which brings none. Never edit it by hand: change the spec, regenerate, and commit both. The starter `@nightshadeui/stylesheets/palette.css` is for prototypes only.
- The spec must have `base` and `primary` ramps: the styles read them by name. Every other ramp is the app's choice.
- A new tone is a new ramp in the spec, and the generator emits its `.tone-<name>`. Never hand-write per-tone variables or roles.
- **Multi-tone components** (controls meant to work in any tone: buttons, inputs, toggles, chips) read roles, and the context ramp (`--tone-200`) when no role fits. They never read `--color-*`, so one `.tone-*` class re-tones them.
- **Single-tone components**, which is most of what an app builds, may read ramp steps directly (`--color-primary-600`, `--color-base-100`). Prefer a canvas role when one names the use (`--surface-deep` for a well).
- Nothing outside the palette and roles calls `light-dark()`: every ramp step is already scheme-aware.
- `--surface-*` are levels of the page (base, then shade, then deep), each with its `--border-*`. `--tone-fill` is a control's solid fill. Don't mix the words.
- `--shadow-*` and `--tone-shadow` are reference colors, not full shadows. Each component owns its shadow geometry.
- Role names are two words or more (`--text-base`, never `--text`) and carry no type suffix (`--tone-fill`, not `--tone-fill-color`).

## Size

- Lengths are multiples of `--sp`: `--sp0-5`, `--sp1`, `--sp1-5`, `--sp2`… Prefer a token over a literal `px` whenever one exists.
- `--line-height` is `--sp2`: one line of a single-line control. It is set on the page and inherited, so application components don't fight it. Don't set `line-height` to a spacing step (`--sp7`, `--sp9`); inherit `--line-height`, or for running text read `--line-height-prose`.
- `--line-height-prose` is `1.5`, a ratio, for articles and long copy (`.prose`).
- **Map heading tags yourself**, in your cascade layer. Nightshade does not style `h1`–`h6`. Display type takes a unitless ratio (`1.2`), not `--line-height` and not `--line-height-prose`. Do it for the whole app, not only `.Prose`. Without that, headings inherit `--sp2` and the letters clip.
- Never `em` or `rem`, except `letter-spacing`. Font sizes are `--font-size-*` (simple `px` in the scale: 8, 10, 12, 14, 16, 20, 24, 40, 88). Don't `calc` a size from another step.
- Single-line controls have a fixed height, `--input-major-height`, and are `border-box`. Companions take `--input-minor-height`. Size adjusts height and padding (`--input-major-padding`, `--input-minor-padding`, `--input-gap`); leave line-height inherited.
- `calc()` is for values that have to be derived: a round radius (`calc(.5 * var(--Btn-size))`), a negative offset, adding two tokens. Not for font sizes, and not for subtracting a border or a pixel from padding. Content doesn't jump when `outline` stays a look, not a state.
- A round control's radius is half its own height (`calc(.5 * var(--Btn-size))`), never a radius token.

## Components

- Each control you write defaults `--<Component>-*` on its root class from roles and the size context, and reads them without per-use fallbacks. Those locals are how the control is written, not a public token family.
- **One grammar for those variables.** Named after a role, they hold a color (`--Btn-fill`, `--Chip-text`, `--Toggle-border`, `--Btn-shadow`). Named after a CSS property, they hold a full value (`--Btn-background`, `--Btn-box-shadow`, `--Toggle-border-size`). Named after a metric, they hold a length (`--Btn-size`, `--Btn-padding`, `--Slider-knob-size`). Parts go in between (`--Slider-track-background`). No `-color` and no `-surface` suffixes.
- **States are shared:** `--input-disabled-opacity|filter`, `--input-hover-overlay` for filled controls, `--input-hover-filter` for wells, `--input-focus-outline|border` for the neutral tones' focus ring (`primary` by default; colored tones focus in their own ramp). Focus rings use `:focus-visible` (text fields: `:focus-within`).
- **Controls draw their props from one set,** and take the ones that apply: `tone`, `size`, `flat`, `outline`, `ghost`, `round`, `translucent`, `disabled`, `force*`. No prop means something else on another control. `tone` and `size` have no default: when they're omitted the control inherits the context, so add the `.tone-*` or `.input-size-*` class only when the prop is set.
- `outline` is a look, not selected. A chosen control drops `ghost`; the rest stay ghost. Toggling `outline` grows a border, and a row or toolbar jumps.
- Root and sub-element classes are PascalCase and short (`Btn`, `Label`). Modifier and state classes are prefixed with the component and camelCased (`Btn-flat`, `Toggle-forceFocus`).
- Set a look for a region with a context class, and for the whole app with `$nightshade.defaults`. Don't repeat the same props on every instance.
- If the project uses `@nightshadeui/components`, those already follow the grammar. If it uses another library, map that library's variables to the roles once, at `:root`.

## Process

- After touching CSS, run `npx nightshade-methodology tokens <dir>` and fix what it reports.
- After changing the palette spec, regenerate `palette.css` and check both color schemes.
<!-- nightshade-methodology:end -->

<!-- flexent-methodology:begin -->
# Flexent methodology

This repository follows the Flexent methodology: OOP-first code guidelines for TypeScript, Vue and mesh-ioc. Read what's around you and match it. Never invent a new approach where a local one exists.

These are the always-on rules. The `flexent` skill (installed under `.agents/skills/flexent`) has the full rule set, the reasoning, the conventions and a structure checker. Project-specific rules live in this file's own sections and in project skills, and they win inside the project.

## Always

- **Keep the three kinds of input apart.** State lives in fields, dependencies come from the container (`@dep()` in Node, `dependency(this, X)` in Vite), and arguments are only what the caller decides on each call.
- **Put code where its subject lives.** A class's own steps are its methods, private even when they don't use `this`. Code about an entity, record or format goes to the class that owns it, or to the missing entity you create for it. Only value types (`Box`, `Money`) and generic code (`slug.ts`) get helper modules.
- **Give each class module one class, named after the file** (`PascalCase.ts`), and each directory one role: `managers/`, `controllers/`, `views/`, `components/`, `pages/`, `global/`, `storage/`, domain families (`exporters/`), `schema/`, `helpers/`.
- **Point dependencies down:** apps → framework packages → domain packages → utility packages. Domain packages are framework-free.
- **Keep one source of truth per fact.** A setting has the shape its schema or form produces, and its defaults are declared there once.
- **Decode at the boundary.** Storage, files, the clipboard and HTTP input are `unknown` until a schema decodes them. Past the boundary, trust the types.
- **Copy at boundaries.** Instances deep-copy what they're given and hand out copies (`toData()`).
- **Prefer fewer entities, layers, branches and arguments.** Abstract on the fourth similar call site, not before.
- **Test the public contract.**
- **Read thrown errors as `catch (error: any)`** and `error?.message`.
- **Name methods as verb plus object** (`openNote`, `deleteNote`). `remove` takes an element out of a list, and `delete` destroys an entity.
- **Fix lint errors.** A long-method warning means the method has two jobs.
- **Fix inconsistencies you notice**, or add them to `TODO.md`. When two ways exist, follow the dominant one.
- **Run `tsc -b`, the linter and the package tests before reporting done.**

## Never

- **Never mix top-level functions and classes in one module.**
- **Never write a static** other than `create` and `decode`, except in an `XCatalog` registry. A static-only class is a missing entity: give it state, don't turn it into helpers.
- **Never write a one-method class with no fields.** A class needs state, collaborators or a lifecycle.
- **Never move a private method out of its class, or make it public, so a test can reach it.**
- **Never write a helper whose subject the app owns.** `order-items.ts`, `user-info.ts` and `cart-utils.ts` name their owner: the code goes there.
- **Never read collaborators from a static, a module global or `process.env` in place.**
- **Never mirror a fact in a second shape, or restate its defaults.**
- **Never write defensive guards against your own contracts**, or speculative features, flags and options.
- **Never fake English with Of/For names** (`idsOf`, `pathFor`). Name the value.
- **Never collapse multi-key object literals onto one line.**
- **Never use `<script setup>` or composables.** Use the Vue Options API.
- **Never introduce a third way of doing something.**
- **Never commit unless asked.** Use Conventional Commits (`type: short summary`).

## When

- **When three or more classes share state bound to one lifecycle instance** (request, connection, session, spawned process), use a scope: a `<Unit>Scope extends Mesh`, registered with `mesh.scope()` and created through an injected `@scope()` provider. Otherwise keep a plain object, a field on the owner, or an instance the owner connects with `mesh.connect`.
- **When frontend logic needs state**, put it in a class: an app-scoped `@provide`d manager, or a controller a manager creates with `mesh.connect`. Views inject managers and never construct controllers. Components use props and events only. Pages are thin.
- **When one action touches several managers**, a coordinating manager sequences them. Managers never watch each other.
- **When a library is heavy**, load it lazily and store its instances with `markRaw`. Never persist them.
- **When every caller re-checks the same preconditions**, move the check into the producer.
<!-- flexent-methodology:end -->

## Nightshade

Nightshade is a seed for application-owned design systems: principles, styles as CSS variables, and a palette generator. Standard Vue components and other packages are opt-ins. It is published as a set of `@nightshadeui/*` libraries. It is not an end-user app: there is no app container, no mesh-ioc and no managers in the packages. Read the Flexent rules above through that lens.

### The model

Principles → styles (`stylesheets`) → the app's own system. Simplicity is the first principle. Everything else is an opt-in that orbits: the palette generator (`palette-generator`, `cli`, the website's Palette Studio) writes the styles' `palette.css` and nothing else; `components`, `canvas`, `particle-system` and `scroller` plug into the app, and `docs` gives the app's system a site of its own. The styles never depend on an opt-in.

### Packages

- Styles: `stylesheets` (generated palette, scales, context, roles, base, utilities, modules).
- Palette generator: `palette-generator` (scheme-aware OKLCH ramps and tone contexts, `PaletteSpecSchema`), `cli` (`nightshade palette`).
- Standard components (opt-in): `components` (Vue controls and layout). Depends on `stylesheets`.
- Other opt-ins: `canvas`, `particle-system`, `scroller`. The unfinished `content-editor` prototype is parked in `.archive/`, outside the workspaces.
- Docs theme (opt-in): `docs`, a VitePress theme for an app's own design-system site: the frame, a landing, `defineDocsConfig` and live references (variables, palette, tones, scales) that read the site's styles. Sites configure it through `themeConfig` and extend it with `extends: DocsTheme`. It knows nothing about Nightshade's own site. Its frame is single-tone, like an app's: it may read `base` and `primary` steps, and any other ramp (`secondary` included) only with a fallback to one of them. It ships sources, which the site's Vite compiles (`defineDocsConfig` keeps them out of pre-bundling).
- Utility: `util` (geometry helpers, `dom/` input classes, `readStored`/`writeStored`). Framework-free.
- Distribution: `nightshade`, a thin umbrella package. No runtime logic here.
- Methodology: `methodology`, the rules and the `nightshade` skill for apps grown from the seed. Its `AGENTS.md` is the source of the Nightshade methodology block above (synced with `npx nightshade-methodology sync`). When the model, tokens or grammar change, update it and the skill references with them.
- Website: `website`, the VitePress documentation site (private). It is an app grown from the seed, built on the `docs` theme: its navigation is its `themeConfig`, and the Palette Studio, the look playground and the opt-in demos are its own.

### Library conventions

- Components are the public API. They take props and emit events; they never `inject` app state. `$nightshade.defaults` is the only provided value.
- A component with real behavior (animation loops, scroll tracking, editing) delegates to a controller class in the same package (`ParticleSystemController`, `ScrollerController`). Controllers are plain classes with `mount`/`unmount` and reactive state; consumers can use them without the component.
- Packages are directories by role: `components/`, the controller at `src/`, `helpers/`, `dom/`, `schema/`. Keep `index.ts` the only aggregator.
- Keep the `./src` subpath export on every package; the website and sibling packages import sources through it. Don't remove an export subpath without a major version.
- Package versions are kept in lockstep. Inter-package dependencies use exact versions; `bump-version` keeps them in sync.
- The website is the one app-shaped package: site-wide state lives in `managers/` classes, provided once from the theme's `enhanceApp`. `views/` inject managers, `components/` take props only, `pages/` are Markdown and stay thin (no `<script setup>`; site views and components are registered globally).

### Components and CSS

The Nightshade methodology block above applies to the packages too: tiers, roles, the variable grammar, the prop grammar and class naming. On top of it:

- The standard components and the opt-ins' components are multi-tone: they read roles and the context ramp, never `--color-*`. The website is an app, and its single-tone views and components may read ramps directly.
- Drive visual variants through context classes (`tone-*`, `input-size-*`) and computed style objects (`baseStyle`, `effectiveStyle`).
- Emit `update:modelValue` for v-model controls, and preserve the slot names `before`, default and `after`.
- `packages/stylesheets/index.css` is an ordered list of layered imports with `layer(nightshade)`, in tier order: `scales/` → `settings/` → `context/` → `roles/`, then `base.css` and `utilities.css`. It doesn't import `palette.css`: apps bring their own, and the shipped one is a starter (the generator's defaults) that only the website imports. A new module is exported in `package.json` and has its own `index.css`.
- `palette.css` is generated with `npm run palette -w @nightshadeui/stylesheets`. The neutral contexts (`:root` = base, `.tone-inverse` = base mirrored) live in `context/tones.css`, and the neutral role overrides in `roles/tones.css`. The styles read `base` and `primary` by name (`REQUIRED_RAMPS` in the generator); never make them depend on another.
- Keep utilities single-purpose and low-specificity, and don't add parallel alias systems.
- Use scoped component CSS, grouped as base, states, then variants and modifiers. Avoid wrappers that one container can replace.
- Run `npx nightshade-methodology tokens packages` before reporting done.

### Docs

- Keep Markdown short and scannable, with practical examples and fenced code blocks with language hints.
- Put one blank line between Markdown blocks, including around HTML and component blocks.
- Website pages teach: one concept per section, concise copy, live demos in `<Demo>`. Site navigation is the `themeConfig` in `.vitepress/config.ts` (`sections` and `topLinks`), in model order; `SiteManager` reads it.

### Process

- Commit types: `feat`, `fix`, `docs`, `chore`, `style`, `refactor`, `build`.
- Before reporting done: `npm run build`, `npm run lint`, `npm test`.
- Release with `npm version <bump>`: it builds, syncs workspace versions with `bump-version`, pushes, then publishes every non-private workspace.

### House rules

- Don't test in a browser unless asked. Code, lint and reading the source are enough.
- Always lead with a joke when providing updates. It has to be funny.
