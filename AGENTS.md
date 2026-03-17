# Nightshade Agents Guide

Nightshade is a Vue-focused UI system workspace containing core components, stylesheets, a gallery, and a thin umbrella package.

## Packages

- `@nightshadeui/core` (`packages/core`): core Vue UI components and exported source entrypoints.
- `@nightshadeui/stylesheets` (`packages/stylesheets`): shared CSS tokens, utilities, and optional CSS modules.
- `@nightshadeui/gallery` (`packages/gallery`): VitePress-based development and showcase frontend.
- `nightshade` (`packages/nightshade`): umbrella distribution package that re-exports core + styles.

## Required References

- Follow the global authoring rules in [`docs/GUIDELINES.md`](docs/GUIDELINES.md).
- Also check package-local guides when editing package internals:
  - `packages/core/AGENTS.md`
  - `packages/stylesheets/AGENTS.md`
  - `packages/gallery/AGENTS.md`
  - `packages/nightshade/AGENTS.md`
- If rules conflict, apply the stricter/package-specific constraint.

## Change Checklist

- [ ] Scope changes to the correct package(s); keep modules focused.
- [ ] Follow package-local requirements in the corresponding `packages/*/AGENTS.md`.
- [ ] Keep docs concise and scannable with proper fenced code blocks.
- [ ] Run relevant build/dev checks before finishing (`npm run build` or package-specific scripts).

## Commit Style

- Use Conventional Commits for every commit message.
- Format: `type(scope): short summary` (or `type: short summary` if no scope fits).
- Allowed types: `feat`, `fix`, `docs`, `chore`, `refactor`, `test`, `build`, `ci`, `perf`.
