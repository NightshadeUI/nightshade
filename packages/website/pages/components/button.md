---
title: Button
---

# Button

<p class="Lead">The primitive everything else follows. A button sets the height, padding, radius and focus ring that the rest of the system matches.</p>

<PlaygroundBar active />

## Tones

<Demo>
    <Btn label="base" />
    <Btn label="inverse" tone="inverse" />
    <Btn label="primary" tone="primary" />
    <Btn label="secondary" tone="secondary" />
    <Btn label="tertiary" tone="tertiary" />
    <Btn label="success" tone="success" />
    <Btn label="warning" tone="warning" />
    <Btn label="danger" tone="danger" />
</Demo>

```html
<Btn label="Save" tone="primary" />
```

## Sizes

<Demo>
    <Btn label="xs" size="xs" tone="primary" />
    <Btn label="s" size="s" tone="primary" />
    <Btn label="m" size="m" tone="primary" />
    <Btn label="l" size="l" tone="primary" />
    <Btn label="xl" size="xl" tone="primary" />
</Demo>

## Styles

<Demo dual>
    <Btn label="Default" tone="primary" />
    <Btn label="Flat" tone="primary" flat />
    <Btn label="Outline" tone="primary" outline />
    <Btn label="Round" tone="primary" round />
    <Btn label="Ghost" tone="primary" ghost />
    <Btn label="Ghost outline" tone="primary" ghost outline />
</Demo>

`ghost` drops the surface and uses the tone's `text` role instead. Combined with `outline`, it's the classic secondary button.

## Icons

`icon` takes the classes of an icon font; `iconPos` puts it on the `left` or `right`. `square` makes an icon-only button.

<Demo>
    <Btn label="Download" icon="fas fa-download" tone="primary" />
    <Btn label="Next" icon="fas fa-arrow-right" iconPos="right" />
    <Btn icon="fas fa-gear" title="Settings" square />
    <Btn icon="fas fa-heart" title="Like" tone="danger" square round />
</Demo>

```html
<Btn label="Next" icon="fas fa-arrow-right" iconPos="right" />
<Btn icon="fas fa-gear" title="Settings" square />
```

## Layout

`block` stretches the button and centers its content. `tagName` renders it as another element, such as a link:

<Demo column>
    <Btn label="Continue" tone="primary" block />
    <Btn tagName="a" href="#layout" label="I am a link" block outline ghost />
</Demo>

## Slots

`before`, the default slot and `after` receive `hover`, `active`, `focus` and `blocked`. The `label` slot replaces only the label.

```html
<Btn tone="primary">
    <template #label>
        Publish <kbd>⌘</kbd><kbd>↵</kbd>
    </template>
</Btn>
```

## RouterBtn

`RouterBtn` is a `Btn` wrapped in Vue Router's `RouterLink`. It takes `to`, and props to apply when the route is active. It needs `vue-router` in your app (an optional peer dependency), so this site, which runs on VitePress's router, shows it as code only:

```html
<RouterBtn
    to="/settings"
    label="Settings"
    ghost
    :activeProps="{ ghost: false, tone: 'primary' }" />
```

## Every tone and size

Every tone your styles define, at every size, in both schemes. The playground bar above switches the looks and the states of all of them at once.

<Demo dual stacked>
<ToneMatrix />
</Demo>

## Variables

| Variable | Default |
|----------|---------|
| `--Btn-size` | `--input-major-height` |
| `--Btn-padding` | `--input-major-padding` |
| `--Btn-gap` | `--input-gap` |
| `--Btn-font-size` | `--input-font-size` |
| `--Btn-radius` | `--radius-m` |
| `--Btn-fill`, `--Btn-fill-top`, `--Btn-fill-bottom` | `--tone-fill`, `--tone-fill-top`, `--tone-fill-bottom` |
| `--Btn-text` | `--tone-fill-text` |
| `--Btn-shadow` | `--tone-shadow` |
