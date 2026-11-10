---
title: Base and utilities
---

# Base and utilities

<p class="Lead">A minimal reset that puts the canvas roles on the page, a few single-purpose utilities, and two opt-in modules.</p>

## Base

`base.css` sets `box-sizing: border-box` everywhere, removes default margins, applies `--surface-base`, `--text-base` and the type scale to `html`, and sets `color-scheme: light dark`. Pin a scheme with an attribute:

```html
<html data-theme="dark">
```

## Utilities

| Classes | Sets |
|---------|------|
| `.color-primary` … `.color-danger` | the tone's `text` role as `color` |
| `.color-subtle`, `.color-faint` | canvas text roles |
| `.text-xxs` … `.text-xxxl` | font size |
| `.text-thin` … `.text-heavy` | font weight |
| `.font-alt`, `.font-monospace` | font family |
| `.flex-1` … `.flex-12` | `flex` |
| `.nowrap` | single line with ellipsis |

Utilities stay single-purpose and low in specificity. They're for the last mile, not for building components.

## Modules

Modules aren't in the default import. Add them when you need them.

### Keyboard keys

```css
@import '@nightshadeui/stylesheets/kbd';
```

Press <kbd>⌘</kbd> <kbd>K</kbd> to search, or <kbd>Esc</kbd> to close.

### Transitions

```css
@import '@nightshadeui/stylesheets/transitions';
```

Vue transition classes: `fade`, `fade-scale`, `fade-squash`, `fade-swipe`, `fade-shove` and the directional `fade-top`, `fade-bottom`, `fade-left`, `fade-right`.

```html
<Transition name="fade-scale">
    <Bubble v-if="shown">…</Bubble>
</Transition>
```
