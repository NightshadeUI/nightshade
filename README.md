# Nightshade

Nightshade is a small, opinionated design system for Vue.

It focuses on a compact CSS-variable foundation and a handful of reusable components, so apps can own most of their look-and-feel without fighting framework defaults.

## Core Principles

### 1) CSS Variables First

Nightshade is built around layered CSS variables:

- UI variables delegate to semantic variables.
- Semantic variables are app-defined (palettes can be generated from OKLCH settings for ensuring uniformity and contrast).
- Naming conventions form a stable skeleton.

The goal is to reduce cognitive load and framework fatigue while keeping customization easy:

- Import `nightshade` styles.
- Define a small set of `:root` variables (e.g. color palettes, font sizes & families).
- Keep styling in CSS.

### 2) Buttons and Inputs as Style Primitives

Nightshade is designed around a practical observation: most component styling patterns can be derived from buttons and text inputs.

So instead of optimizing for component count, Nightshade optimizes these primitives.

Other controls are expected to follow these rules unless intentionally diverging.

### 3) Style Over Strict Semantics

Nightshade uses familiar semantic labels (`base`, `inverse`, `primary`, `secondary`, `tertiary`, `success`, `warning`, `danger`) but treats them as constrained style tools, not rigid product semantics.

This keeps the system practical:

- Semantic names are guidance, not dogma.
- Teams can map meanings to fit product needs.
- Consistency comes from constraints + conventions.

## Non-Goals

Nightshade does **not** aim to be:

- A giant, all-inclusive component framework.
- A design language that dictates product semantics.
- A replacement for app-level styling ownership.

## Packages

Nightshade is a workspace with focused packages:

- `nightshade`: umbrella package (`nightshade` + `nightshade/css`).
- `@nightshadeui/core`: Vue components.
- `@nightshadeui/stylesheets`: CSS variables and style modules.
- `@nightshadeui/gallery`: local showcase/playground.
- `@nightshadeui/scroller`: Vue scroll progress composable.

## Quick Start

### Install

```bash
npm i nightshade
```

### Use CSS foundation

```ts
import 'nightshade/css';
```

### Use components

```ts
import { Btn, InputBase, InputText } from 'nightshade';
// Or import all core components
import { coreComponents } from 'nightshade';
```

### Theme at `:root`

```css
:root {

  --font-main: "Source Sans 3", sans-serif;
  --font-alt: "MonteCarlo", cursive;

  --font-size: 16px;
  
  /* Define palettes */
}
```

## Development

### Run gallery

```bash
npm run dev
```

### Build workspace

```bash
npm run build
```

## Roadmap (Living)

Potential next improvements:

- Document variable layers in a dedicated token map.
- Add recipes for generating semantic palettes from OKLCH.
- Expand examples that show “small core, app-owned styling” in practice.

## License

ISC
