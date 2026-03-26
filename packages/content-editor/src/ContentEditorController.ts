import { Event } from 'nanoevent';

import type {
    BlockMarkupConfig,
    ContentBlock,
    ContentEditorOptions,
} from './types.js';
import { parseEditorElement, renderContentValue, sanitizeContentValue } from './utils/content.js';
import { getSelectionOffsets, restoreSelectionOffsets } from './utils/selection.js';

export class ContentEditorController {

    static readonly DEFAULT_BLOCKS: BlockMarkupConfig[] = [
        { type: 'p', tag: 'p', label: 'Paragraph' },
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
        const offsets = getSelectionOffsets(this.rootEl);
        const nextValue = parseEditorElement(this.rootEl, this.options);
        const hasChanges = JSON.stringify(nextValue) !== JSON.stringify(this.value);
        this.value = nextValue;
        if (hasChanges) {
            this.renderToEditor();
        }
        if (offsets) {
            restoreSelectionOffsets(this.rootEl, offsets);
        }
        this.emitModel();
    }

    private emitModel(): void {
        this.onUpdate.emit(this.value);
    }

    private onInput(): void {
        this.applyEditorDomAsSourceOfTruth();
    }

    private normalizeOptions(options?: Partial<ContentEditorOptions>): ContentEditorOptions {
        const blocks = options?.blocks?.length ? options.blocks : ContentEditorController.DEFAULT_BLOCKS;
        const defaultBlockType = options?.defaultBlockType ?? 'p';
        return {
            blocks,
            defaultBlockType,
        };
    }

}
