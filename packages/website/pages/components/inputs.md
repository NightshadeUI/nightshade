---
title: Text inputs
---

# Text inputs

<p class="Lead">One frame, three fields. <code>InputBase</code> draws the box, the label and the focus ring; <code>InputText</code>, <code>InputTextarea</code> and <code>InputSelect</code> put a native control inside it.</p>

<PlaygroundBar />

## InputText

<Demo
    column
    :initial="{ name: 'Ada Lovelace', email: '' }"
    v-slot="{ state }">
    <InputText v-model="state.name" label="Name" />
    <InputText v-model="state.email" label="Email" placeholder="ada@example.com" type="email" />
</Demo>

```html
<InputText v-model="name" label="Name" />
```

`type`, `placeholder`, `min`, `max`, `step`, `readonly` and `autoFocus` pass through to the native input.

## Labels

`labelStyle` places the label: `inline` sits on the border, `text` above the field, `tab` in a tab above it.

<Demo
    column
    :initial="{ value: 'Nightshade' }"
    v-slot="{ state }">
    <InputText v-model="state.value" label="Inline label" />
    <InputText v-model="state.value" label="Text label" labelStyle="text" />
    <InputText v-model="state.value" label="Tab label" labelStyle="tab" tone="primary" />
</Demo>

## Validation through context

There's no `error` prop. A field in the `danger` tone is an error, because that's what the tone means:

<Demo
    column
    :initial="{ email: 'not an email' }"
    v-slot="{ state }">
    <div class="tone-danger FieldWithHint">
        <InputText v-model="state.email" label="Email" />
        <span class="Hint">Enter a full address, like ada@example.com.</span>
    </div>
</Demo>

```html
<div :class="{ 'tone-danger': !valid }">
    <InputText v-model="email" label="Email" />
</div>
```

<style>
.FieldWithHint {
    display: flex;
    flex-flow: column;
    gap: var(--sp0-5);
}

.FieldWithHint .Hint {
    font-size: var(--font-size-xs);
    color: var(--tone-text);
}
</style>

## Slots

`before` and `after` put content inside the frame, next to the input:

<Demo
    column
    :initial="{ query: '' }"
    v-slot="{ state }">
    <InputText v-model="state.query" placeholder="Search components">
        <template #before>
            <i class="fas fa-magnifying-glass" />
        </template>
        <template #after>
            <kbd>⌘K</kbd>
        </template>
    </InputText>
</Demo>

## InputTextarea

Grows with its content when `autoSize` is on, which is the default.

<Demo
    column
    :initial="{ text: 'Seeds grow.\nSo do design systems.' }"
    v-slot="{ state }">
    <InputTextarea v-model="state.text" label="Notes" />
</Demo>

## InputSelect

A native `select` in the same frame. Options with a `group` are grouped.

<Demo
    column
    :initial="{
        tone: 'primary',
        options: [
            { value: 'primary', label: 'Primary', group: 'Accents' },
            { value: 'secondary', label: 'Secondary', group: 'Accents' },
            { value: 'success', label: 'Success', group: 'Status' },
            { value: 'danger', label: 'Danger', group: 'Status' },
        ],
    }"
    v-slot="{ state }">
    <InputSelect v-model="state.tone" label="Tone" :options="state.options" />
</Demo>

## InputGroup

Joins adjacent controls into one: inner radii drop, and a hairline gap of `--input-border-size` separates them.

<Demo :initial="{ amount: '42' }" v-slot="{ state }">
    <InputGroup>
        <Btn label="−" square />
        <InputText v-model="state.amount" style="width: 96px" />
        <Btn label="+" square />
    </InputGroup>
    <InputGroup>
        <InputText v-model="state.amount" placeholder="Amount" />
        <Btn label="Apply" tone="primary" />
    </InputGroup>
</Demo>

```html
<InputGroup>
    <InputText v-model="amount" />
    <Btn label="Apply" tone="primary" />
</InputGroup>
```

Sizes come from the context, so one class sizes a whole group. Inputs keep their joined edges inside it too:

<Demo column :initial="{ query: '', view: 'grid' }" v-slot="{ state }">
    <InputGroup v-for="size in ['s', 'm', 'l']" :key="size" :class="`input-size-${size}`">
        <Btn icon="fas fa-magnifying-glass" square />
        <InputText v-model="state.query" placeholder="Search" class="flex-1" />
        <Btn label="Go" tone="primary" />
    </InputGroup>
    <InputGroup>
        <Btn label="Grid" icon="fas fa-table-cells" :tone="state.view === 'grid' ? 'primary' : undefined" class="flex-1" @click="state.view = 'grid'" />
        <Btn label="List" icon="fas fa-list" :tone="state.view === 'list' ? 'primary' : undefined" class="flex-1" @click="state.view = 'list'" />
        <Btn label="Board" icon="fas fa-table-columns" :tone="state.view === 'board' ? 'primary' : undefined" class="flex-1" @click="state.view = 'board'" />
    </InputGroup>
</Demo>

## Every tone and size

Every tone your styles define, at every size, in both schemes. The playground bar above switches the looks and the states of all of them at once.

<Demo dual stacked>
<ToneMatrix v-slot="{ tone, size }">
    <InputText :tone="tone" :size="size" placeholder="Text" style="width: calc(2.5 * var(--input-major-height))" />
</ToneMatrix>
</Demo>

## Variables

Defaulted on `.InputBase` from roles and the size context, the same way every control is written.

| Variable | Default |
|----------|---------|
| `--InputBase-size` | `--input-major-height` |
| `--InputBase-padding-x`, `--InputBase-padding-y` | `--input-major-padding`, `--input-minor-padding` |
| `--InputBase-background` | `--surface-base` |
| `--InputBase-text` | `--text-base` |
| `--InputBase-border` | `--tone-border` |
| `--InputBase-radius` | `--radius-m` |
