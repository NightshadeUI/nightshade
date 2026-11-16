---
title: Depth
---

# Depth

<p class="Lead">Shadows, translucency and overlays: the roles that put one surface above another.</p>

## Shadows

Shadow roles are colors, not full `box-shadow` values, so components decide geometry and the system decides strength.

<TokenTable
    preview="shadow"
    :tokens="[
        { name: '--shadow-light', value: 'black 10% / 20%', note: 'Inset wells, resting controls.' },
        { name: '--shadow-medium', value: 'black 20% / 40%', note: 'Raised controls, cards.' },
        { name: '--shadow-heavy', value: 'black 30% / 60%', note: 'Popovers and overlays.' },
    ]" />

Each tone adds its own tint: a primary button's shadow mixes `--tone-shadow` with `--shadow-medium`.

## Raised surfaces

Two surfaces sit off the page levels. `--surface-raised` (with `--border-raised`) is for things that float above the page: popups, menus, tooltips. In the dark scheme it's a step lighter than the page, so it reads as closer. `--surface-knob` is the moving part of a control, a toggle or slider knob, and stays light in both schemes.

<Demo dual>
    <div class="RaisedSample">Raised</div>
    <Toggle :modelValue="false" />
    <Slider :modelValue="40" style="width: 120px" />
</Demo>

<style>
.RaisedSample {
    padding: var(--sp1) var(--sp2);
    border: 1px solid var(--border-raised);
    border-radius: var(--radius-l);
    background: var(--surface-raised);
    box-shadow: 0 2px 8px var(--shadow-medium);
    font-size: var(--font-size-s);
}
</style>

## Translucency

Translucent controls blend their surface with what's behind them and blur it.

| Variable | Default | Use |
|----------|---------|-----|
| `--translucency-mix-light` | 15% | how much of the background shows through a surface |
| `--translucency-mix-medium` | 50% | |
| `--translucency-mix-heavy` | 75% | |
| `--translucency-blur` | 3px | backdrop blur |
| `--translucency-highlight` | white 50% / 16% | the inner rim light |

<Demo>
    <div class="TranslucentStage">
        <Btn label="Translucent" translucent />
        <Btn label="Primary" tone="primary" translucent />
        <Toggle :modelValue="true" tone="secondary" translucent />
    </div>
</Demo>

<style>
.TranslucentStage {
    display: flex;
    align-items: center;
    gap: var(--sp1-5);
    padding: var(--sp4);
    border-radius: var(--radius-l);
    background:
        radial-gradient(circle at 20% 30%, var(--color-primary-500), transparent 50%),
        radial-gradient(circle at 80% 70%, var(--color-secondary-500), transparent 50%),
        var(--surface-deep);
}
</style>

## Overlay

`--surface-overlay` is the scrim behind modals. [ModalOverlay](/components/overlays) uses it.

## Automatic text shadow

`--text-shadow-auto` is the one shadow that picks its own color: the inverse of the current text color, at 25%. It lifts text off a gradient surface without knowing which tone it's on; filled buttons and checkbox marks use it. Browsers without relative color syntax get no shadow.

```css
.Label {
    text-shadow: 0 1px 1px var(--text-shadow-auto);
}
```
