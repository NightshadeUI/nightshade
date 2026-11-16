---
title: Scroller
---

# Scroller

<p class="Lead">How far an element has scrolled through the viewport, as a reactive number from 0 to 1. Drive any CSS with it.</p>

```bash
npm i @nightshadeui/scroller
```

Four controllers read the same 2400px track below, each with its own anchors. Scroll through it and compare where each `t` leaves 0 and where it reaches 1.

<ScrollerDemo />

## Usage

```ts
import { ScrollerController } from '@nightshadeui/scroller';

const scroller = new ScrollerController({
    start: 0.2,
    end: 1,
});

scroller.mount(el);
// scroller.t goes from 0 to 1 as el scrolls through
scroller.unmount();
```

| Param | Default | Means |
|-------|---------|-------|
| `start` | `0` | where `startAnchor` has to be for `t` to leave 0, as a viewport fraction from the bottom (`0` the bottom edge, `1` the top) |
| `end` | `1` | where `endAnchor` has to be for `t` to reach 1, on the same scale |
| `startAnchor` | `top` | which edge of the element starts the count |
| `endAnchor` | `bottom` | which edge ends it |

The defaults count the whole pass: from the element's top entering at the bottom of the viewport to its bottom leaving at the top. `t` is clamped to 0…1, and recomputed on scroll and resize.

Pass `t` to CSS as a variable, and let `calc()` and `clamp()` do the animation:

```html
<div :style="{ '--t': scroller.t }">
```
