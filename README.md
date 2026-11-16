# Nightshade

Nightshade is a seed for design systems that applications own.

It isn't a framework to fight. It's a few principles, the styles that follow from them, and an OKLCH palette generator. Install the styles, generate a palette, and build your own. Your app grows the rest, and owns all of it.

## The model

| Ring | Package | Provides |
|------|---------|----------|
| Principles | the website | simplicity, finite vocabularies, CSS first, ownership |
| Styles | `@nightshadeui/stylesheets` | scales, context and roles, as CSS variables |
| Your system | your app | your product's look and language |

Opt-ins orbit your system:

- `@nightshadeui/cli` and `@nightshadeui/palette-generator` write your `palette.css`: scheme-aware ramps and one tone per ramp.
- `@nightshadeui/components`: standard Vue controls that read the styles. Use them, or map your own component library to the same variables.
- `@nightshadeui/canvas`, `particle-system`, `scroller`: behavior as controllers, with optional components.
- `@nightshadeui/docs`: a documentation site for your own system, a VitePress theme whose references read your styles.

## Quick start

```bash
npm i @nightshadeui/stylesheets
npm i -D @nightshadeui/cli
npx nightshade palette -f palette.json -o src/palette.css
```

```css
@import '@nightshadeui/stylesheets';
@import './palette.css'; /* or '@nightshadeui/stylesheets/palette.css', the starter */

:root {
    --font-main: "Source Sans 3", sans-serif;
    --radius-m: 6px;
}
```

Want the standard components too? `npm i nightshade` bundles the styles and `@nightshadeui/components`.

## For coding agents

```bash
npm i --save-dev @nightshadeui/methodology
```

It writes the always-on rules into your `AGENTS.md` and installs the `nightshade` skill (`/nightshade` in Claude Code): the token catalog, the palette workflow, the component grammar, recipes and a token checker. See [`packages/methodology`](packages/methodology/README.md).

## Tokens in one paragraph

Raw values are scales, enumerable ladders (`--color-primary-500`, `--sp4`), and settings, single values (`--font-main`, `--input-border-size`); every color step is scheme-aware. Context classes pick one tone ramp and one input size for a subtree (`.tone-danger` sets `--tone-0` … `--tone-950`; `.input-size-s` sets `--input-major-height`), and `:root` is the default context. Roles give meaning, once: canvas roles (`--surface-base`, `--border-base`, `--text-base`, in three nesting levels) and a short, complete list of tone roles (`--tone-fill`, `--tone-text`, `--tone-border`…) that every tone answers. Multi-tone components (buttons, inputs) read roles, never a ramp, so one class re-tones or re-sizes everything inside them. Single-tone app components may read ramp steps directly.

## Development

```bash
npm run dev      # the website, with live sources
npm run build    # every package, then the website
npm run lint
```

Migrating from 2.x: see `packages/website/pages/migration.md`, or the Migrating to 3.0 page on the website.

## License

ISC
