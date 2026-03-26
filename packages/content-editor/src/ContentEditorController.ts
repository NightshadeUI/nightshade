import { Event } from 'nanoevent';

import type {
    BlockMarkupConfig,
    ContentBlock,
    ContentEditorOptions,
    InlineMarkupConfig,
} from './types.js';
import { fixEditorElementDom, normalizeEditorHtml, parseEditorElement, renderContentValue, sanitizeContentValue } from './utils/content.js';

export class ContentEditorController {

    static readonly DEFAULT_BLOCKS: BlockMarkupConfig[] = [
        { type: 'h1', tag: 'h1', label: 'Page Title' },
        { type: 'h2', tag: 'h2', label: 'Section Header' },
        { type: 'h3', tag: 'h3', label: 'Subsection Header' },
        { type: 'h4', tag: 'h4', label: 'Minor Header' },
        { type: 'h5', tag: 'h5', label: 'Caption' },
        { type: 'h6', tag: 'h6', label: 'Small Caption' },
        { type: 'p', tag: 'p', label: 'Paragraph' },
        { type: 'kicker', tag: 'p', label: 'Kicker', className: 'kicker' },
        { type: 'callout', tag: 'p', label: 'Callout', className: 'callout' },
        { type: 'small', tag: 'p', label: 'Small Text', className: 'small' },
        { type: 'fine', tag: 'p', label: 'Fine Print', className: 'fine' },
    ];

    static readonly DEFAULT_INLINES: InlineMarkupConfig[] = [
        { type: 'strong', tag: 'strong', label: 'Strong' },
        { type: 'em', tag: 'em', label: 'Emphasis' },
        { type: 's', tag: 's', label: 'Strikethrough' },
        { type: 'code', tag: 'code', label: 'Code' },
        { type: 'a', tag: 'a', label: 'Link' },
    ];

    private rootEl: HTMLElement | null = null;
    private options: ContentEditorOptions;
    private value: ContentBlock[];

    onUpdate = new Event<ContentBlock[]>();

    private listeners = {
        onInput: () => this.onInput(),
    };

    constructor(
        modelValue: ContentBlock[] | null | undefined,
        options: Partial<ContentEditorOptions> | undefined,
    ) {
        this.options = this.normalizeOptions(options);
        this.value = sanitizeContentValue(modelValue, this.options);
    }

    getOptions(): ContentEditorOptions {
        return this.options;
    }

    mount(rootEl: HTMLElement): void {
        this.rootEl = rootEl;
        this.rootEl.setAttribute('contenteditable', 'true');
        this.rootEl.setAttribute('spellcheck', 'true');
        this.renderToEditor();
        this.rootEl.addEventListener('input', this.listeners.onInput);
    }

    unmount(): void {
        if (!this.rootEl) {
            return;
        }
        this.rootEl.removeEventListener('input', this.listeners.onInput);
        this.rootEl = null;
    }

    setValue(value: ContentBlock[] | null | undefined): void {
        this.value = sanitizeContentValue(value, this.options);
        this.renderToEditor();
    }

    private renderToEditor(): void {
        if (!this.rootEl) {
            return;
        }
        this.rootEl.innerHTML = renderContentValue(this.value, this.options);
    }

    private applyEditorDomAsSourceOfTruth(): void {
        if (!this.rootEl) {
            return;
        }
        fixEditorElementDom(this.rootEl, this.options);
        const nextValue = parseEditorElement(this.rootEl, this.options);
        const renderedNextHtml = renderContentValue(nextValue, this.options);
        const hasChanges = JSON.stringify(nextValue) !== JSON.stringify(this.value);
        const needsRerender = normalizeEditorHtml(this.rootEl.innerHTML) !== normalizeEditorHtml(renderedNextHtml);
        this.value = nextValue;
        if (needsRerender) {
            console.log('NEEDS RERENDER', this.rootEl.innerHTML, renderedNextHtml);
            this.rootEl.innerHTML = renderedNextHtml;
        }
        if (hasChanges) {
            this.emitModel();
        }
    }

    private emitModel(): void {
        this.onUpdate.emit(this.value);
    }

    private onInput(): void {
        this.applyEditorDomAsSourceOfTruth();
    }

    private normalizeOptions(options?: Partial<ContentEditorOptions>): ContentEditorOptions {
        const blocks = options?.blocks?.length ? options.blocks : ContentEditorController.DEFAULT_BLOCKS;
        const inlines = options?.inlines?.length ? options.inlines : ContentEditorController.DEFAULT_INLINES;
        const defaultBlockType = options?.defaultBlockType ?? 'p';
        return {
            blocks,
            inlines,
            defaultBlockType,
        };
    }

}
