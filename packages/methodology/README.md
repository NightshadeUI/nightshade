# @nightshadeui/methodology

How design systems grown from Nightshade are built, written for people and for coding agents.

Nightshade is a seed: principles, styles as CSS variables, and a palette generator. The methodology is how to grow it without drift. It covers the four tiers, the complete role vocabulary, the palette spec, the component variable grammar, app-wide defaults, recipes, and migrating from 2.x.

## Install

```sh
npm i --save-dev @nightshadeui/methodology
```

On install, the package writes into the project that ran `npm install`:

| Path | What | Read by |
|------|------|---------|
| `AGENTS.md` | always-on rules, in a managed block between `<!-- nightshade-methodology:begin -->` and `<!-- nightshade-methodology:end -->`; the rest of the file is yours | Codex, Cursor, GitHub Copilot, Gemini CLI, and most other agents |
| `.agents/skills/nightshade/` | the `nightshade` Agent Skill: token catalog, palette, components, recipes, token checker | Codex, Cursor, GitHub Copilot, and other Agent Skills tools |
| `.claude/skills/nightshade` | a link to the skill above, available as `/nightshade` | Claude Code |
| `CLAUDE.md` | `@AGENTS.md`, created only when missing | Claude Code, which doesn't read `AGENTS.md` on its own |

Commit these files. Agents that read the repository without installing anything (cloud agents, fresh clones) then see the same rules as everyone else.

The install step is skipped in CI, for global installs, and when `NIGHTSHADE_METHODOLOGY_SKIP=1` is set. pnpm and Yarn don't run install scripts by default; with those, run `npx nightshade-methodology sync` once after installing or upgrading.

It sits alongside `@flexent/methodology`: each package manages only its own block in `AGENTS.md`.

## Commands

```sh
npx nightshade-methodology sync [root]     # install or refresh the rules and skill
npx nightshade-methodology check [root]    # exit 1 if they are missing or stale (for CI)
npx nightshade-methodology tokens [dir]    # report CSS that breaks the variable grammar
```

`tokens` reads `.css`, `.scss` and the `<style>` blocks of `.vue` files. It flags `light-dark()` outside scales, context and roles, component variables read with fallbacks, `-color` and `-surface` suffixes on component variables, one-word roles, and 2.x variables. It doesn't flag ramp steps: single-tone components may read them, and whether a component is multi-tone is a judgment call.

Upgrading the package and running `sync` refreshes the skill and the managed block, and leaves your own `AGENTS.md` sections and `CLAUDE.md` untouched.

## Other tools

| Tool | Rules | Skill |
|------|-------|-------|
| **Claude Code** (as a plugin) | — | `/plugin marketplace add NightshadeUI/nightshade`, then `/plugin install nightshade@nightshade` |
| **Cursor** (as a plugin) | the plugin adds `rules/nightshade.mdc` as an always-on rule | Customize → Plugins → From GitHub Repository → `NightshadeUI/nightshade` |
| **Gemini CLI** | add `"context": { "fileName": ["AGENTS.md", "GEMINI.md"] }` to `.gemini/settings.json` | `.agents/skills/nightshade` |
| **Claude.ai, Claude Desktop** | paste `AGENTS.md` into the project instructions | zip `skills/nightshade` and upload it under Settings → Capabilities → Skills |

A plugin installs the skill for one person. The npm package is what makes the rules part of the project.

## Guidelines

- [The model](./skills/nightshade/references/model.md): the seed, the principles, the tiers and cascade layers.
- [Tokens](./skills/nightshade/references/tokens.md): every scale, context and role, with defaults.
- [Palette](./skills/nightshade/references/palette.md): the spec, the generator, adding and tuning tones.
- [Components](./skills/nightshade/references/components.md): the variable grammar, a component template, the prop grammar, app-wide defaults.
- [Growing your own](./skills/nightshade/references/recipes/growing.md): from a palette spec to your own published system.
- [Migrating from 2.x](./skills/nightshade/references/migration.md): the renames, a script, and a per-repository workflow.

## How it's built

- **Rules** ([`AGENTS.md`](./AGENTS.md)) load on every turn, so they stay short: only the non-negotiables.
- **The skill** ([`skills/nightshade`](./skills/nightshade/SKILL.md)) follows the open [Agent Skills](https://agentskills.io) format. Agents read only its name and description until a task needs it.
