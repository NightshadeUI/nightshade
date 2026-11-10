---
title: Space and sizing
---

# Space and sizing

<p class="Lead">One grid unit, multiplied. Spacing, control sizes and radii all come from it, so a 22px gap can only appear if someone adds it on purpose.</p>

## Spacing scale

`--sp` is the grid unit, `8px` by default. Every other step is a multiple: `--sp0-5` is half a unit, `--sp2-5` is two and a half.

<SpacingScale />

Change the grid of the whole system with one variable:

```css
:root {
    --sp: 6px;
}
```

## Input sizes

Buttons and inputs set the rhythm of an interface, so they get their own scale: five sizes, each mapping grid units to the few metrics a control needs.

| Metric | Means |
|--------|-------|
| `major-height` | the height of the control itself: a button, a text field |
| `minor-height` | the height of an element inside or beside it: a toggle, a checkbox, a slider knob |
| `major-padding` | horizontal padding of the control |
| `minor-padding` | the inset of inner elements |
| `font-size` | text size inside the control |
| `gap` | space between icon and label |

Single-line controls use a fixed **height**, never vertical padding, and every control is `border-box`. That's what lets a row of mixed controls snap onto the grid:

<InputSizes />

### Size context

Like tones, sizes have context. An `.input-size-*` class sets the generic `--input-*` slots for a subtree; `:root` is `m`. Components inherit it unless you pass `size`:

<Demo>
    <div class="input-size-s SizeContext">
        <InputText placeholder="Search" />
        <Btn label="Go" tone="primary" />
        <Checkbox :modelValue="true" />
    </div>
    <div class="input-size-l SizeContext">
        <InputText placeholder="Search" />
        <Btn label="Go" tone="primary" />
        <Checkbox :modelValue="true" />
    </div>
</Demo>

<style>
.SizeContext {
    display: flex;
    align-items: center;
    gap: var(--input-gap);
}
</style>

The scale is for **controls**. It doesn't change body text or layout spacing; that's what `--font-size-*` and `--sp*` are for.

## Radius

Three steps, all derived from `--radius-m`:

<TokenTable
    preview="radius"
    :tokens="[
        { name: '--radius-s', value: 'calc(0.5 * var(--radius-m))', note: 'Inner elements, small chips.' },
        { name: '--radius-m', value: '4px', note: 'Controls. The one to override.' },
        { name: '--radius-l', value: 'calc(2 * var(--radius-m))', note: 'Cards, panels, popovers.' },
    ]" />

Round controls don't use the scale. A `round` control's radius is always half its own height, so it's a perfect pill at every size.

## Grid fractions

For layouts on a 12-column grid: `--gr1` to `--gr12` are fractions of the container, `--vgr1` to `--vgr12` fractions of the viewport width.

```css
.Sidebar {
    width: var(--gr3);
}
```
