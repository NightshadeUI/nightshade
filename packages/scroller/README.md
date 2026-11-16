# @nightshadeui/scroller

How far an element has scrolled through the viewport, as a reactive number from 0 to 1.

```bash
npm i @nightshadeui/scroller
```

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
| `start` | `0` | where `startAnchor` has to be for `t` to leave 0, as a viewport fraction from the bottom |
| `end` | `1` | where `endAnchor` has to be for `t` to reach 1, on the same scale |
| `startAnchor` | `top` | which edge of the element starts the count |
| `endAnchor` | `bottom` | which edge ends it |

Pass `t` to CSS as a variable, `:style="{ '--t': scroller.t }"`, and let `calc()` do the animation.
