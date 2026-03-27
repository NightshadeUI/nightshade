import type { ContentBlock } from '../types.js';
import { FAST_UPDATE_INPUT_TYPES } from './constants.js';
import type { ContentEditor } from './ContentEditor.js';

export class EditorInputHandler {

    private lastInputType: string | null = null;

    constructor(public editor: ContentEditor) {}

    onBeforeInput(e: InputEvent): void {
        this.lastInputType = e.inputType ?? null;
    }

    onInput(e: InputEvent): void {
        const inputType = this.lastInputType ?? e.inputType ?? null;
        this.lastInputType = null;
        if (FAST_UPDATE_INPUT_TYPES.has(inputType)) {
            const applied = this.tryFastUpdate();
            if (applied) {
                return;
            }
        }
        this.applyEditorDomAsSourceOfTruth();
    }

    applyEditorDomAsSourceOfTruth() {
        const rootEl = this.editor.getRootElement();
        if (!rootEl) {
            return;
        }
        this.editor.domFixer.fixRoot(rootEl);
        const parsedBlocks = this.editor.blockParser.parseRoot(rootEl);
        const nextValue = this.sanitizeParsedValue(parsedBlocks);
        const renderedNextHtml = this.editor.blockRenderer.render(nextValue);
        const needsRerender = this.normalizeHtml(rootEl.innerHTML) !== this.normalizeHtml(renderedNextHtml);
        this.editor.assignValue(nextValue);
        if (needsRerender) {
            // eslint-disable-next-line no-console
            console.debug('Rerender', {
                before: this.normalizeHtml(rootEl.innerHTML),
                after: this.normalizeHtml(renderedNextHtml),
            });
            rootEl.innerHTML = renderedNextHtml;
        }
        this.editor.domSelection.onSelectionChanged();
    }

    /**
     * Applies fast update by sanitizing inline content from a single selected block.
     * Pre-conditions:
     * - only allowed update types (i.e. typing text, deleting forward/backward, composing text)
     * - number of blocks match
     * - single block selected
     */
    private tryFastUpdate(): boolean {
        const rootEl = this.editor.getRootElement();
        if (!rootEl) {
            return false;
        }
        const currentBlocks = this.editor.getValue();
        if (this.editor.blockMap.size() !== currentBlocks.length) {
            return false;
        }
        const selectedIndexes = this.editor.domSelection.getSelectedBlockIndexes();
        if (selectedIndexes.length !== 1) {
            return false;
        }
        const selectedEl = this.editor.blockMap.getContentElementByIndex(selectedIndexes[0]);
        const selectedBlock = this.editor.blockMap.getContentBlockByIndex(selectedIndexes[0]);
        if (!selectedEl || !selectedBlock) {
            return false;
        }
        this.editor.domFixer.fixBlockElement(selectedEl);
        const blockContent = this.editor.inlineSanitizer.sanitizeHtml(selectedEl.innerHTML);
        selectedBlock.text = blockContent;
        this.editor.emitUpdate();
        return true;
    }

    private normalizeHtml(html: string): string {
        return html
            .replaceAll(/>\s+</g, '><')
            .replaceAll(/<br\s*\/?>/g, '<br>')
            .trim();
    }

    private sanitizeParsedValue(blocks: ContentBlock[]): ContentBlock[] {
        return this.editor.blockSanitizer.sanitizeInputBlocks(blocks);
    }

}
