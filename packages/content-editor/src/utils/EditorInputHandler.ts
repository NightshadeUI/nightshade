import type { ContentBlock } from '../types.js';
import { SAFE_TYPING_INPUT_TYPES } from './constants.js';
import type { ContentEditor } from './ContentEditor.js';

export class EditorInputHandler {

    private lastInputType: string | null = null;
    private lastIsComposing = false;

    constructor(public editor: ContentEditor) {}

    onBeforeInput(e: InputEvent): void {
        this.lastInputType = e.inputType ?? null;
        this.lastIsComposing = e.isComposing ?? false;
    }

    onInput(e: InputEvent): void {
        const _inputType = this.lastInputType ?? e.inputType ?? null;
        const _isComposing = this.lastIsComposing || (e.isComposing ?? false);

        // Reset immediately so we don't reuse stale state
        this.lastInputType = null;
        this.lastIsComposing = false;

        // if (inputType && !isComposing && this.tryApplyTypingFastPath(inputType)) {
        //     return;
        // }

        this.applyEditorDomAsSourceOfTruth();
    }

    applyEditorDomAsSourceOfTruth(): void {
        const rootEl = this.editor.getRootElement();
        if (!rootEl) {
            return;
        }
        this.editor.domFixer.fixRoot(rootEl);
        const parsedBlocks = this.editor.blockParser.parseRoot(rootEl);
        const currentValue = this.editor.getValue();
        const nextValue = this.sanitizeParsedValue(parsedBlocks);
        const renderedNextHtml = this.editor.blockRenderer.render(nextValue);
        const hasChanges = JSON.stringify(nextValue) !== JSON.stringify(currentValue);
        const needsRerender = this.normalizeHtml(rootEl.innerHTML) !== this.normalizeHtml(renderedNextHtml);
        this.editor.assignValue(nextValue);
        if (needsRerender) {
            rootEl.innerHTML = renderedNextHtml;
        }
        if (hasChanges) {
            this.editor.emitUpdate();
        }
        this.editor.domSelection.onSelectionChanged();
    }

    private tryApplyTypingFastPath(inputType: string): boolean {
        const rootEl = this.editor.getRootElement();
        if (!rootEl) {
            return false;
        }
        if (!SAFE_TYPING_INPUT_TYPES.has(inputType)) {
            return false;
        }

        const currentValue = this.editor.getValue();
        if (this.editor.blockMap.size() !== currentValue.length) {
            // Split/merge or unexpected DOM structure: fallback
            return false;
        }

        const caretBlockEl = this.getCaretBlockElement();
        if (!caretBlockEl) {
            return false;
        }

        const caretBlockIndex = this.editor.blockMap.getContentElementIndex(caretBlockEl);
        if (caretBlockIndex === -1) {
            return false;
        }

        const mappedBlockEl = this.editor.blockMap.getContentElementByIndex(caretBlockIndex);
        if (!mappedBlockEl || mappedBlockEl !== caretBlockEl) {
            return false;
        }

        const blockEl = caretBlockEl;
        const blockDef = this.editor.blockParser.findBlockDefinition(blockEl);
        if (!blockDef) {
            return false;
        }

        // Snapshot caret offset so we can restore it if we must patch this block's DOM.
        const caretTextOffset = this.getCaretTextOffset(blockEl);

        // Avoid running fixer/sanitizer on the whole document; limit work to the current block.
        this.editor.domFixer.fixRoot(blockEl);

        const nextBlock = this.sanitizeDomBlock(blockEl, blockDef.type);
        if (!nextBlock) {
            return false;
        }

        const previousBlock = currentValue[caretBlockIndex];
        const hasBlockChange = previousBlock.type !== nextBlock.type || previousBlock.text !== nextBlock.text;
        if (hasBlockChange) {
            currentValue[caretBlockIndex] = nextBlock;
        }

        // Ensure DOM inline markup is canonical. If it already is, we do not touch DOM (caret-safe).
        const expectedInner = nextBlock.text === '' ? '<br>' : nextBlock.text;
        const currentInnerNormalized = this.normalizeHtml(blockEl.innerHTML);
        const expectedInnerNormalized = this.normalizeHtml(expectedInner);
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
            this.editor.emitUpdate();
        }
        return true;
    }

    private sanitizeDomBlock(blockEl: HTMLElement, type: string): ContentBlock | null {
        const sanitized = this.editor.blockSanitizer.sanitizeValue([{ type, text: blockEl.innerHTML }]);
        if (sanitized.length !== 1) {
            return null;
        }
        return sanitized[0];
    }

    private getCaretBlockElement(): HTMLElement | null {
        const rootEl = this.editor.getRootElement();
        if (!rootEl) {
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
            if (node === rootEl) {
                return null;
            }
            const parentNode = node.parentNode as Node | null;
            if (parentNode === rootEl && node.nodeType === Node.ELEMENT_NODE) {
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

    private normalizeHtml(html: string): string {
        return html
            .replaceAll(/>\s+</g, '><')
            .replaceAll(/<br\s*\/?>/g, '<br>')
            .trim();
    }

    private sanitizeParsedValue(blocks: ContentBlock[]): ContentBlock[] {
        return this.editor.blockSanitizer.sanitizeValue(blocks);
    }

}
