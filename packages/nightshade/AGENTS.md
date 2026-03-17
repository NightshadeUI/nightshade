# AGENTS Guide: nightshade

## Purpose

`nightshade` is the umbrella distribution package. It exposes a simple public API for consumers:
- JS exports from `@nightshadeui/core`
- CSS entrypoint combining core CSS and stylesheets

## Existing Architecture

- `index.mjs`: re-export all from `@nightshadeui/core`.
- `index.d.ts`: mirrors the same type re-export.
- `index.css`: imports `@nightshadeui/stylesheets` and `@nightshadeui/core/css` (scoped styles of core components).

## Conventions

- Keep this package thin: no runtime logic, no component definitions.
- Keep JS and type exports aligned (if `index.mjs` changes, `index.d.ts` must match).
- Preserve CSS import order unless there is a deliberate layering change.
- Dependency versions for `@nightshadeui/core` and `@nightshadeui/stylesheets` stay synchronized with workspace versioning.

## Editing Rules

- Prefer changes in source packages (`core`, `stylesheets`) over adding behavior here.
- Only modify this package when changing public packaging/export behavior.

## Useful Commands

- Validate package through workspace build: `npm run build`
