<template>
    <DualTheme>
        <VGroup>

            <HGroup align="end">
                <InputText
                    modelValue="someText"
                    label="What is your name?"
                    labelStyle="text"
                    class="flex-1"
                    shadow />
                <Btn
                    label="Submit"
                    kind="primary"
                    shadow />
            </HGroup>

            <VGroup gap="s">
                <InputTextarea
                    label="Comment"
                    labelStyle="tab"
                    kind="secondary"
                    modelValue="Some text"
                    round
                    class="flex-1" />
                <HGroup justify="end">
                    <Btn
                        label="Submit"
                        kind="secondary"
                        flat
                        outline
                        round />
                </HGroup>
            </VGroup>

            <HGroup
                justify="space-between"
                wrap>
                <InputGroup>
                    <Btn
                        label="Option one"
                        kind="primary"
                        flat
                        outline
                        round />
                    <Btn
                        label="Option two"
                        flat
                        outline
                        round />
                    <Btn
                        label="Option three"
                        flat
                        outline
                        round />
                </InputGroup>
                <Toggle
                    :modelValue="true"
                    kind="primary"
                    flat
                    outline
                    round />
            </HGroup>

            <HGroup class="text-s color-subtle">
                <strong>ProTip™</strong>
                <span>Press <kbd>⌘</kbd>+<kbd>Enter</kbd> to submit the form.</span>
            </HGroup>

        </VGroup>
    </DualTheme>
</template>
