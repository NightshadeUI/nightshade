import type { ContentEditor } from '../ContentEditor.js';

export class DomSelection {

    selectedBlockIndexes: number[] = [];

    constructor(public editor: ContentEditor) {}

    onSelectionChanged() {
        this.selectedBlockIndexes = this.computeSelectedBlockIndexes();
    }

    getSelectedBlockIndexes(): number[] {
        return [...this.selectedBlockIndexes];
    }

    private computeSelectedBlockIndexes(): number[] {
        const rootEl = this.editor.getRootElement();
        const selection = window.getSelection();
        if (!rootEl || !selection || selection.rangeCount === 0) {
            return [];
        }
        const range = selection.getRangeAt(0);
        const startContentElement = this.getTopLevelContentElement(range.startContainer, rootEl);
        if (!startContentElement) {
            return [];
        }
        const startIdx = this.editor.blockMap.getContentElementIndex(startContentElement);
        if (startIdx === -1) {
            return [];
        }

        if (range.collapsed) {
            return [startIdx];
        }
        const endContentElement = this.getTopLevelContentElement(range.endContainer, rootEl);
        if (!endContentElement) {
            return [startIdx];
        }
        const endIdx = this.editor.blockMap.getContentElementIndex(endContentElement);
        if (endIdx === -1) {
            return [startIdx];
        }
        const minIdx = Math.min(startIdx, endIdx);
        const maxIdx = Math.max(startIdx, endIdx);
        const indexes: number[] = [];
        for (let idx = minIdx; idx <= maxIdx; idx += 1) {
            indexes.push(idx);
        }
        return indexes;
    }

    private getTopLevelContentElement(node: Node, rootEl: HTMLElement): HTMLElement | null {
        let current: Node | null = node;
        while (current) {
            if (current === rootEl) {
                return null;
            }
            const parentNode: Node | null = current.parentNode;
            if (parentNode === rootEl && current.nodeType === Node.ELEMENT_NODE) {
                return current as HTMLElement;
            }
            current = parentNode;
        }
        return null;
    }

}
