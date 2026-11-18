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
- Vite plugins: `vite` (`cssLayer`, `cssLayerOrder` for cascade layers). Re-exported as `nightshade/vite`.
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

[Flexent] Follow .agents/flexent/RULES.md
[Nightshade] Follow .agents/nightshade/RULES.md
