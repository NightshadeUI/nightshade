import { Event } from 'nanoevent';

import type {
    ContentBlock,
    ContentEditorConfig,
} from './types.js';
import { BlockMap } from './utils/BlockMap.js';
import { BlockParser } from './utils/BlockParser.js';
import { BlockRenderer } from './utils/BlockRenderer.js';
import { BlockSanitizer } from './utils/BlockSanitizer.js';
import { DEFAULT_BLOCKS, DEFAULT_INLINES, SAFE_TYPING_INPUT_TYPES } from './utils/constants.js';
import { DomFixer } from './utils/DomFixer.js';
import { DomSelection } from './utils/DomSelection.js';
import { InlineSanitizer } from './utils/InlineSanitizer.js';

interface EditorListeners {
    onInput: (e: globalThis.Event) => void;
    onBeforeInput: (e: globalThis.InputEvent) => void;
    onSelectionChange: () => void;
}

export class ContentEditorController {

    readonly config: ContentEditorConfig;

    inlineSanitizer: InlineSanitizer;
    blockSanitizer: BlockSanitizer;
    blockParser: BlockParser;
    blockRenderer: BlockRenderer;
    domFixer: DomFixer;
    blockMap: BlockMap;
    domSelection: DomSelection;

    onUpdate = new Event<ContentBlock[]>();

    private rootEl: HTMLElement | null = null;
    private value: ContentBlock[] = [];
    private lastInputType: string | null = null;
    private lastIsComposing = false;

    private listeners!: EditorListeners;

    constructor(
        options?: Partial<ContentEditorConfig>,
    ) {
        this.config = {
            blocks: DEFAULT_BLOCKS,
            inlines: DEFAULT_INLINES,
            defaultBlockType: 'p',
            ...options,
        };
        this.inlineSanitizer = new InlineSanitizer(this);
        this.blockSanitizer = new BlockSanitizer(this);
        this.blockParser = new BlockParser(this);
        this.blockRenderer = new BlockRenderer(this);
        this.domFixer = new DomFixer(this);
        this.blockMap = new BlockMap(this);
        this.domSelection = new DomSelection(this);
    }

    setModelValue(modelValue: ContentBlock[] | null | undefined): void {
        this.value = this.sanitizeContentValue(modelValue);
        this.renderToEditor();
    }

    mount(rootEl: HTMLElement): void {
        this.rootEl = rootEl;
        this.rootEl.setAttribute('contenteditable', 'true');
        this.rootEl.setAttribute('spellcheck', 'true');
        this.renderToEditor();
        this.listeners = {
            onBeforeInput: (e: globalThis.Event) => this.onBeforeInput(e as InputEvent),
            onInput: (e: globalThis.Event) => this.onInput(e as InputEvent),
            onSelectionChange: () => this.onSelectionChanged(),
        };
        this.rootEl.addEventListener('input', this.listeners.onInput);
        this.rootEl.addEventListener('beforeinput', this.listeners.onBeforeInput);
        document.addEventListener('selectionchange', this.listeners.onSelectionChange);
        this.onSelectionChanged();
    }

    unmount(): void {
        if (!this.rootEl) {
            return;
        }
        this.rootEl.removeEventListener('input', this.listeners.onInput);
        this.rootEl.removeEventListener('beforeinput', this.listeners.onBeforeInput);
        document.removeEventListener('selectionchange', this.listeners.onSelectionChange);
        this.rootEl = null;
    }

    getRootElement(): HTMLElement | null {
        return this.rootEl;
    }

    setValue(value: ContentBlock[] | null | undefined): void {
        this.value = this.sanitizeContentValue(value);
        this.renderToEditor();
        this.onSelectionChanged();
    }

    getValue(): ContentBlock[] {
        return this.value;
    }

    onSelectionChanged(): void {
        this.domSelection.onSelectionChanged();
    }

    private renderToEditor(): void {
        if (!this.rootEl) {
            return;
        }
        this.rootEl.innerHTML = this.blockRenderer.render(this.value);
    }

    private applyEditorDomAsSourceOfTruth(): void {
        if (!this.rootEl) {
            return;
        }
        this.domFixer.fixRoot(this.rootEl);
        const parsedBlocks = this.blockParser.parseRoot(this.rootEl);
        const nextValue = this.sanitizeParsedValue(parsedBlocks);
        const renderedNextHtml = this.blockRenderer.render(nextValue);
        const hasChanges = JSON.stringify(nextValue) !== JSON.stringify(this.value);
        const needsRerender = ContentEditorController.normalizeEditorHtml(this.rootEl.innerHTML) !== ContentEditorController.normalizeEditorHtml(renderedNextHtml);
        this.value = nextValue;
        if (needsRerender) {
            this.rootEl.innerHTML = renderedNextHtml;
        }
        if (hasChanges) {
            this.emitModel();
        }
        this.onSelectionChanged();
    }

    private emitModel(): void {
        this.onUpdate.emit(this.value);
    }

    private onBeforeInput(e: InputEvent): void {
        this.lastInputType = e.inputType ?? null;
        this.lastIsComposing = e.isComposing ?? false;
    }

    private onInput(e: InputEvent): void {
        const inputType = this.lastInputType ?? e.inputType ?? null;
        const isComposing = this.lastIsComposing || (e.isComposing ?? false);

        // Reset immediately so we don't reuse stale classification.
        this.lastInputType = null;
        this.lastIsComposing = false;

        // if (inputType && !isComposing && this.tryApplyTypingFastPath(inputType)) {
        //     return;
        // }

        this.applyEditorDomAsSourceOfTruth();
    }

    private tryApplyTypingFastPath(inputType: string): boolean {
        if (!this.rootEl) {
            return false;
        }
        if (!SAFE_TYPING_INPUT_TYPES.has(inputType)) {
            return false;
        }

        if (this.blockMap.size() !== this.value.length) {
            // Split/merge or unexpected DOM structure: fallback.
            return false;
        }

        const caretBlockEl = this.getCaretBlockElement();
        if (!caretBlockEl) {
            return false;
        }

        const caretBlockIndex = this.blockMap.getContentElementIndex(caretBlockEl);
        if (caretBlockIndex === -1) {
            return false;
        }

        const mappedBlockEl = this.blockMap.getContentElementByIndex(caretBlockIndex);
        if (!mappedBlockEl || mappedBlockEl !== caretBlockEl) {
            return false;
        }

        const blockEl = caretBlockEl;
        const blockDef = this.blockParser.findBlockDefinition(blockEl);
        if (!blockDef) {
            return false;
        }

        // Snapshot caret offset so we can restore it if we must patch this block's DOM.
        const caretTextOffset = this.getCaretTextOffset(blockEl);

        // Avoid running fixer/sanitizer on the whole document; limit work to the current block.
        this.domFixer.fixRoot(blockEl);

        const nextBlock = this.sanitizeDomBlock(blockEl, blockDef.type);
        if (!nextBlock) {
            return false;
        }

        const previousBlock = this.value[caretBlockIndex];
        const hasBlockChange = previousBlock.type !== nextBlock.type || previousBlock.text !== nextBlock.text;
        if (hasBlockChange) {
            this.value[caretBlockIndex] = nextBlock;
        }

        // Ensure DOM inline markup is canonical. If it already is, we do not touch DOM (caret-safe).
        const expectedInner = nextBlock.text === '' ? '<br>' : nextBlock.text;
        const currentInnerNormalized = ContentEditorController.normalizeEditorHtml(blockEl.innerHTML);
        const expectedInnerNormalized = ContentEditorController.normalizeEditorHtml(expectedInner);
        if (currentInnerNormalized !== expectedInnerNormalized) {
            // Only patch if the textual content stays the same (caret offset mapping safety).
            const currentText = blockEl.textContent ?? '';
            const expectedText = this.extractTextContentFromHtml(expectedInner);
            if (currentText !== expectedText) {
                return false;
            }

            blockEl.innerHTML = expectedInner;
            this.restoreCaretTextOffset(blockEl, caretTextOffset);
        }

        if (hasBlockChange) {
            this.emitModel();
        }
        return true;
    }

    private sanitizeDomBlock(blockEl: HTMLElement, type: string): ContentBlock | null {
        const sanitized = this.blockSanitizer.sanitizeValue([{ type, text: blockEl.innerHTML }]);
        if (sanitized.length !== 1) {
            return null;
        }
        return sanitized[0];
    }

    private getCaretBlockElement(): HTMLElement | null {
        if (!this.rootEl) {
            return null;
        }
        const sel = window.getSelection();
        if (!sel || sel.rangeCount === 0) {
            return null;
        }

        const anchorNode = sel.anchorNode ?? sel.focusNode;
        if (!anchorNode) {
            return null;
        }

        let node: Node | null = anchorNode;
        if (node.nodeType === Node.TEXT_NODE) {
            node = node.parentNode;
        }

        while (node) {
            if (node === this.rootEl) {
                return null;
            }
            const parentNode = node.parentNode as Node | null;
            if (parentNode === this.rootEl && node.nodeType === Node.ELEMENT_NODE) {
                return node as HTMLElement;
            }
            node = parentNode;
        }

        return null;
    }

    private getCaretTextOffset(blockEl: HTMLElement): number {
        const sel = window.getSelection();
        if (!sel || sel.rangeCount === 0) {
            return 0;
        }
        const range = sel.getRangeAt(0);
        if (!blockEl.contains(range.startContainer)) {
            return 0;
        }

        // Character offset in plain text inside the block.
        const pre = document.createRange();
        pre.setStart(blockEl, 0);
        pre.setEnd(range.startContainer, range.startOffset);
        return pre.toString().length;
    }

    private restoreCaretTextOffset(blockEl: HTMLElement, offset: number): void {
        const sel = window.getSelection();
        if (!sel) {
            return;
        }

        const walker = document.createTreeWalker(blockEl, NodeFilter.SHOW_TEXT);
        let current = 0;
        for (let node = walker.nextNode(); node; node = walker.nextNode()) {
            const len = (node.nodeValue ?? '').length;
            const next = current + len;
            if (offset <= next) {
                const range = document.createRange();
                range.setStart(node, Math.max(0, offset - current));
                range.collapse(true);
                sel.removeAllRanges();
                sel.addRange(range);
                return;
            }
            current = next;
        }

        const range = document.createRange();
        range.selectNodeContents(blockEl);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
    }

    private extractTextContentFromHtml(html: string): string {
        const el = document.createElement('div');
        el.innerHTML = html;
        return el.textContent ?? '';
    }

    private sanitizeContentValue(input: unknown): ContentBlock[] {
        const blocks = this.blockSanitizer.sanitizeValue(input);
        return blocks.length ? blocks : this.createEmptyValue();
    }

    private sanitizeParsedValue(blocks: ContentBlock[]): ContentBlock[] {
        // BlockParser returns ContentBlock items, but inline HTML inside `text` may still contain unsupported markup.
        // BlockSanitizer sanitizes inline HTML into the canonical form we store as the source of truth.
        const sanitized = this.blockSanitizer.sanitizeValue(blocks);
        return sanitized.length ? sanitized : this.createEmptyValue();
    }

    private createEmptyValue(): ContentBlock[] {
        return [
            {
                type: this.config.defaultBlockType,
                text: '',
            },
        ];
    }

    private static normalizeEditorHtml(html: string): string {
        return html
            .replaceAll(/>\s+</g, '><')
            .replaceAll(/<br\s*\/?>/g, '<br>')
            .trim();
    }

}
