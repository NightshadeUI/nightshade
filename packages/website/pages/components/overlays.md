---
title: Overlays and menus
---

# Overlays and menus

<p class="Lead">A bubble, a popup that positions one next to an anchor, a tooltip, the overlay that catches outside clicks, and a menu built from buttons.</p>

Overlays teleport into an element with `id="overlays"`. Put one at the end of your app's root.

```html
<div id="overlays" />
```

## Bubble

A surface with an arrow. The `Bubble` element is a point, the arrow's tip: place it with `left` and `top` inside a positioned parent. `dir` is the side the bubble opens towards; `align` is `start`, `center` or `end`, where the arrow lands along the bubble's edge.

<Demo dual stacked>
    <div class="BubbleMatrix">
        <template v-for="dir in ['top', 'bottom', 'left', 'right']" :key="dir">
            <div v-for="align in ['start', 'center', 'end']" :key="align" class="BubbleCell" :class="`BubbleCell-${dir}`">
                <div class="BubblePoint">
                    <Bubble :dir="dir" :align="align">
                        <div class="BubbleContent">{{ dir }} · {{ align }}</div>
                    </Bubble>
                </div>
            </div>
        </template>
    </div>
</Demo>

```html
<div class="Anchor">
    <Bubble dir="top" align="center">…</Bubble>
</div>
```

```css
.Anchor {
    position: relative;
}

.Anchor > .Bubble {
    left: 50%;
    top: 0;
}
```

The body takes its content's width, up to `--Bubble-max-width`; give the content its own `max-width` to wrap it sooner.

| Variable | Default |
| --- | --- |
| `--Bubble-background` | `var(--surface-raised)` |
| `--Bubble-arrow-size` | `var(--sp)` |
| `--Bubble-arrow-offset` | `var(--sp2)`, from the body's edge to the arrow at `start` and `end` |
| `--Bubble-radius` | `var(--radius-m)` |
| `--Bubble-max-width` | `calc(100vw - var(--sp4))` |
| `--Bubble-shadow` | `var(--shadow-light)` |
| `--Bubble-filter` | `drop-shadow(0 1px 3px var(--Bubble-shadow))` |

<style>
.BubbleMatrix {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    row-gap: var(--sp2);
    width: 100%;
}

/* Each cell holds one point, moved away from the side its bubble opens towards */

.BubbleCell {
    display: grid;
    place-items: center;
    height: var(--sp12);
}

.BubblePoint {
    position: relative;
    width: 0;
    height: 0;
}

.BubbleCell-top > .BubblePoint {
    transform: translateY(var(--sp3));
}

.BubbleCell-bottom > .BubblePoint {
    transform: translateY(calc(-1 * var(--sp3)));
}

.BubbleCell-left > .BubblePoint {
    transform: translateX(var(--sp6));
}

.BubbleCell-right > .BubblePoint {
    transform: translateX(calc(-1 * var(--sp6)));
}

.BubblePoint::after {
    content: '';
    position: absolute;
    z-index: 11;
    width: var(--sp0-5);
    height: var(--sp0-5);
    border-radius: 50%;
    background: var(--color-primary-500);
    transform: translate(-50%, -50%);
}

.BubbleContent {
    padding: var(--sp1) var(--sp1-5);
    font-size: var(--font-size-s);
}
</style>

## ContextPopup

Shows a bubble next to an anchor: the element behind `anchorRef` or `anchorEl`, or the popup's parent. It emits `hide` on an outside click or <kbd>Esc</kbd>.

<Demo :initial="{ shown: false, copied: false }" v-slot="{ state }">
    <Btn ref="popupAnchor" label="Share" icon="fas fa-share-nodes" tone="primary" @click="state.shown = true; state.copied = false" />
    <ContextPopup v-if="state.shown" anchorRef="popupAnchor" :overlayShown="false" @hide="state.shown = false">
        <div class="PopupCard">
            <div class="PopupTitle">Share this page</div>
            <p class="PopupText">Anyone with the link can view it. Only editors can make changes.</p>
            <div class="PopupActions">
                <Btn label="Close" size="s" flat @click="state.shown = false" />
                <Btn :label="state.copied ? 'Copied' : 'Copy link'" :icon="state.copied ? 'fas fa-check' : 'far fa-copy'" size="s" tone="primary" @click="state.copied = true" />
            </div>
        </div>
    </ContextPopup>
</Demo>

```html
<Btn ref="anchor" label="Share" @click="shown = true" />
<ContextPopup
    v-if="shown"
    anchorRef="anchor"
    @hide="shown = false">
    …
</ContextPopup>
```

| Prop | Means |
| --- | --- |
| `dir` | `top`, `bottom`, `left`, `right`, or `v` (the default) and `h` to pick the side with more room |
| `align` | `start`, `center`, `end`, or `auto` (the default) to open towards the middle of the viewport |
| `anchorDir` | the anchor's point the arrow meets: `auto` (the default) is the edge facing `dir`, or `top`, `bottom`, `left`, `right`, `middle` |
| `overlayShown` | dims the page behind the popup (the default) |
| `overlayEnabled` | catches outside clicks (the default); off, the page stays interactive |
| `arrowShown` | draws the arrow (the default) |

<style>
.PopupCard {
    display: flex;
    flex-flow: column;
    gap: var(--sp1);
    width: var(--sp36);
    padding: var(--sp2);
}

.PopupTitle {
    font-weight: var(--font-weight-bold);
}

.PopupText {
    margin: 0;
    font-size: var(--font-size-s);
    color: var(--text-subtle);
}

.PopupActions {
    display: flex;
    justify-content: flex-end;
    gap: var(--sp1);
    margin-top: var(--sp1);
}
</style>

## Tooltip

A `ContextPopup` that opens while its anchor is hovered or focused from the keyboard, and closes on leave, press, scroll or <kbd>Esc</kbd>. The pointer can move onto the bubble without closing it. It holds a `title` and a `text`; a lone `text` is the whole message.

The `v-tooltip` directive takes a string or an object:

<Demo>
    <Btn label="Save" tone="primary" v-tooltip="'Saves the draft'" />
    <Btn icon="fas fa-share-nodes" square v-tooltip="{ title: 'Share', text: 'Anyone with the link can view this page, but only editors can change it.' }" />
    <Btn icon="fas fa-trash-can" square ghost tone="danger" v-tooltip="{ title: 'Delete', text: 'Moves the page to the trash.', dir: 'right' }" />
</Demo>

```html
<Btn label="Save" v-tooltip="'Saves the draft'" />
<Btn
    icon="fas fa-share-nodes"
    v-tooltip="{ title: 'Share', text: 'Anyone with the link can view this page.' }" />
```

Register it once, next to the components:

```ts
import { vTooltip } from '@nightshadeui/components';

app.directive('tooltip', vTooltip);
```

`Tooltip` itself anchors to its parent element. Its default slot takes rich content; inside a `Btn`, put it in the `after` slot:

<Demo>
    <Btn label="Publish" tone="primary">
        <template #after>
            <Tooltip dir="bottom">
                <div class="TooltipRich">
                    <strong>Publish</strong>
                    <span>Goes live for everyone. Press <kbd>⌘</kbd> <kbd>Enter</kbd> from the editor.</span>
                </div>
            </Tooltip>
        </template>
    </Btn>
    <span class="TooltipTarget">
        Hover this text
        <Tooltip title="Any element" text="The parent of a Tooltip is its anchor." />
    </span>
</Demo>

```html
<Btn label="Publish">
    <template #after>
        <Tooltip dir="bottom">
            <strong>Publish</strong> goes live for everyone.
        </Tooltip>
    </template>
</Btn>
```

`dir` is `top` (the default), `bottom`, `left`, `right`, or `v` and `h` to pick the side with more room; `align` is `center` (the default), `start` or `end`.

| Variable | Default |
| --- | --- |
| `--Tooltip-padding` | `var(--sp1) var(--sp1-5)` |
| `--Tooltip-gap` | `var(--sp0-5)` |
| `--Tooltip-width` | `var(--sp40)`, the most it takes before wrapping |
| `--Tooltip-title` | `var(--text-base)` |
| `--Tooltip-text` | `var(--text-subtle)` |

<style>
.TooltipRich {
    display: flex;
    flex-flow: column;
    gap: var(--sp0-5);
}

.TooltipTarget {
    text-decoration: underline dotted;
    text-underline-offset: 3px;
    cursor: help;
}
</style>

## ContextMenu

A `ContextPopup` holding a `BaseMenu`. Items are buttons, headers or separators, and can take a `tone`, an `icon` and `disabled`.

<Demo :initial="{ shown: false, picked: 'nothing yet' }" v-slot="{ state }">
    <Btn ref="menuAnchor" label="Actions" icon="fas fa-chevron-down" iconPos="right" @click="state.shown = true" />
    <span class="Picked">Picked: {{ state.picked }}</span>
    <ContextMenu
        v-if="state.shown"
        anchorRef="menuAnchor"
        anchorDir="bottom"
        :items="[
            { type: 'header', title: 'Project' },
            { title: 'Rename', icon: 'fas fa-pen', value: 'rename' },
            { title: 'Duplicate', icon: 'far fa-copy', value: 'duplicate' },
            { type: 'separator' },
            { title: 'Archive', icon: 'fas fa-box-archive', value: 'archive', disabled: true },
            { title: 'Delete', icon: 'fas fa-trash-can', value: 'delete', tone: 'danger' },
        ]"
        @activate="item => { state.picked = item.value; state.shown = false; }"
        @hide="state.shown = false" />
</Demo>

<style>
.Picked {
    font-size: var(--font-size-s);
    color: var(--text-subtle);
}
</style>

```ts
const items: MenuItem[] = [
    { type: 'header', title: 'Project' },
    { title: 'Rename', icon: 'fas fa-pen', value: 'rename' },
    { type: 'separator' },
    { title: 'Delete', value: 'delete', tone: 'danger' },
];
```

## BaseMenu

The same menu without the popup, for sidebars and panels. Arrow keys move between items. It takes `size` and `round`; items take `checked`, `disabled`, `tone`, `ghost: false` for a filled item and `outline`.

<Demo dual :initial="{ view: 'grid', sort: 'name' }" v-slot="{ state }">
    <BaseMenu
        size="s"
        class="MenuSample"
        :items="[
            { type: 'header', title: 'View' },
            { title: 'Grid', icon: 'fas fa-table-cells', value: 'grid', checked: state.view === 'grid' },
            { title: 'List', icon: 'fas fa-list', value: 'list', checked: state.view === 'list' },
            { type: 'separator' },
            { title: 'Export', icon: 'fas fa-file-export', value: 'export', disabled: true },
            { title: 'Delete', icon: 'fas fa-trash-can', value: 'delete', tone: 'danger' },
        ]"
        @activate="item => { if (item.value === 'grid' || item.value === 'list') state.view = item.value; }" />
    <BaseMenu
        round
        class="MenuSample"
        :items="[
            { type: 'header', title: 'Sort by' },
            { title: 'Name', value: 'name', tone: 'primary', ghost: state.sort !== 'name' },
            { title: 'Date', value: 'date', tone: 'primary', ghost: state.sort !== 'date' },
            { title: 'Size', value: 'size', tone: 'primary', ghost: state.sort !== 'size' },
        ]"
        @activate="item => { state.sort = item.value; }" />
</Demo>

<style>
.MenuSample {
    width: 180px;
}
</style>

## ModalOverlay

The layer under every popup: a fixed, full-screen element in `--surface-overlay` that emits `hide` on click or <kbd>Esc</kbd>. `overlayShown` controls the scrim, `overlayEnabled` whether it catches clicks at all.
