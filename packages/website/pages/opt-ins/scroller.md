---
title: Scroller
---

# Scroller

<p class="Lead">How far an element has scrolled through the viewport, as a reactive number from 0 to 1. Drive any CSS with it.</p>

```bash
npm i @nightshadeui/scroller
```

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
| `start` | `0` | viewport fraction where `t` starts |
| `end` | `1` | viewport fraction where `t` reaches 1 |
| `startAnchor` | `top` | which edge of the element starts the count |
| `endAnchor` | `bottom` | which edge ends it |

Pass `t` to CSS as a variable, and let `calc()` and `clamp()` do the animation:

```html
<div :style="{ '--t': scroller.t }">
```
