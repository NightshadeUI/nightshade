---
title: Overlays and menus
---

# Overlays and menus

<p class="Lead">A bubble, a popup that positions one next to an anchor, the overlay that catches outside clicks, and a menu built from buttons.</p>

Overlays teleport into an element with `id="overlays"`. Put one at the end of your app's root.

```html
<div id="overlays" />
```

## Bubble

A surface with an arrow. `dir` is the side the bubble opens towards; `align` is `start`, `center` or `end`.

<Demo>
    <div class="BubbleAnchor">
        <Bubble dir="top" align="center">
            <div class="BubbleContent">Top, centered</div>
        </Bubble>
    </div>
    <div class="BubbleAnchor">
        <Bubble dir="bottom" align="start">
            <div class="BubbleContent">Bottom, start</div>
        </Bubble>
    </div>
</Demo>

Every side and alignment:

<Demo dual>
    <div class="BubbleMatrix">
        <template v-for="dir in ['top', 'bottom', 'left', 'right']" :key="dir">
            <Bubble v-for="align in ['start', 'center', 'end']" :key="align" :dir="dir" :align="align">
                <div class="BubbleContent">{{ dir }} · {{ align }}</div>
            </Bubble>
        </template>
    </div>
</Demo>

<style>
.BubbleMatrix {
    display: grid;
    grid-template-columns: repeat(3, auto);
    gap: var(--sp3);
    padding: var(--sp1);
}

.BubbleAnchor {
    position: relative;
    width: 160px;
    height: 72px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.BubbleAnchor:first-child {
    align-items: flex-end;
}

.BubbleAnchor:last-child {
    align-items: flex-start;
}

.BubbleContent {
    padding: var(--sp1) var(--sp1-5);
    font-size: var(--font-size-s);
    white-space: nowrap;
}
</style>

## ContextPopup

Shows a bubble next to an anchor, picking the side with more room when `dir` is `v` or `h`. It emits `hide` on an outside click or <kbd>Esc</kbd>.

<Demo :initial="{ shown: false }" v-slot="{ state }">
    <Btn ref="popupAnchor" label="Open popup" tone="primary" @click="state.shown = true" />
    <ContextPopup v-if="state.shown" anchorRef="popupAnchor" anchorDir="bottom" @hide="state.shown = false">
        <div class="PopupContent">
            <strong>Popups are positioned</strong>
            <span>next to their anchor, on the side with more room.</span>
            <Btn label="Got it" size="s" tone="primary" @click="state.shown = false" />
        </div>
    </ContextPopup>
</Demo>

```html
<Btn ref="anchor" label="Open" @click="shown = true" />
<ContextPopup
    v-if="shown"
    anchorRef="anchor"
    anchorDir="bottom"
    @hide="shown = false">
    …
</ContextPopup>
```

<style>
.PopupContent {
    display: flex;
    flex-flow: column;
    align-items: flex-start;
    gap: var(--sp1);
    max-width: 240px;
    padding: var(--sp2);
    font-size: var(--font-size-s);
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
