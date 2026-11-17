---
title: The seed
---

# The seed

<p class="Lead">Nightshade is not a design system. It is the seed one grows from: a few principles, the styles that follow from them, and a palette generator. The app decides what grows next, and owns all of it.</p>

## What's in the seed

Two pieces, and a palette. Install the styles, generate a palette, and you're ready to build your own.

| Piece | Package | What it gives you |
|-------|---------|-------------------|
| The principles | this site | simplicity, finite vocabularies, CSS first, ownership |
| The styles | `@nightshadeui/stylesheets` | scales, context and roles as CSS variables, a reset, utilities |
| Your palette | `@nightshadeui/cli`, or the [Palette Studio](/studio) | OKLCH ramps and tones from a small JSON spec |

Everything else is an opt-in that orbits your system: take it when it helps.

| Opt-in | Package | What it gives you |
|--------|---------|-------------------|
| [Standard components](/components/) | `@nightshadeui/components` | [buttons, chips, inputs and a few layout and overlay pieces](/components/) |
| Canvas, particles, scroller | `@nightshadeui/canvas`, `particle-system`, `scroller` | behavior as controllers, with optional components |

`nightshade` bundles the styles and the standard components, for apps that want both.

## Simple on purpose

Simplicity is the first principle. Every tier, role and prop has to earn its place, and the whole vocabulary has to fit in your head. If styling a panel needs a cheat sheet, that's a bug in the system.

## Finite vocabularies

One idea runs through every layer: **turn an open space into a short list, then only speak the list.**

| Open space | Vocabulary | Where |
|------------|------------|-------|
| Any length | Multiples of one grid unit: `--sp1`, `--sp1-5`, `--sp2`… | [Space and sizing](/styles/sizing) |
| Any color | Twelve-step ramps sampled from a hue | [Color](/styles/color) |
| Any ramp step | A handful of roles, the same for every tone | [Tones and roles](/styles/tones) |
| Any control size | Five input sizes, `xs` to `xl` | [Space and sizing](/styles/sizing#input-sizes) |
| Any component look | One grammar: tone, size, flat, outline, ghost, round | [Control grammar](/components/) |

With a short list in hand, an arbitrary `22px` or `#3a7bd5` rarely comes up. When you do need one, adding it to a vocabulary makes it available to everyone.

## CSS variables first

Theming is CSS. There's no theme object, no build step and no provider tree. You set variables at your app's `:root`, and the browser does the rest, including light and dark.

Variables are layered and delegated, never flat. A button doesn't know your brand color. It knows `--tone-fill`, a role that names a step of the context ramp, which a `.tone-*` class points at one of your ramps. Change any link in that chain and everything after it follows.

## Buttons and inputs set the rhythm

Most of an interface is buttons and text fields, so Nightshade optimizes those and lets everything else follow them.

- Single-line controls use a fixed **height**, not padding, so they snap exactly onto the spacing grid.
- Every control is `border-box`. A border never changes a size.
- Toggles, checkboxes and slider knobs take the *minor* height of the same size, so they line up with the field next to them.

## Style over strict semantics

Tones carry meaning, but loosely. `danger` is a red that reads as caution. It doesn't mean "delete", and nothing stops you from using it for a destructive but expected action. The tone vocabulary is there to keep colors from appearing out of nowhere, not to enforce product semantics.

## Non-goals

Nightshade does not try to be:

- an all-inclusive component framework,
- a design language that dictates your product's semantics,
- a replacement for owning your app's styling.

Next: the model, and the one rule that makes it snap.
