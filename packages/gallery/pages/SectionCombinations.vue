<template>
    <DualTheme>
        <VGroup>

            <HGroup>
                <InputText
                    modelValue="someText"
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

        </VGroup>
    </DualTheme>
</template>
