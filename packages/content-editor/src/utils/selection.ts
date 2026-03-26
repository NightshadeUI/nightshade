export interface SelectionOffsets {
    start: number;
    end: number;
}

function createRangeWithOffset(root: HTMLElement, offset: number): { node: Node; offset: number } {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let currentOffset = 0;
    while (walker.nextNode()) {
        const textNode = walker.currentNode;
        const textLength = textNode.textContent?.length ?? 0;
        if (offset <= currentOffset + textLength) {
            return {
                node: textNode,
                offset: Math.max(0, offset - currentOffset),
            };
        }
        currentOffset += textLength;
    }
    return { node: root, offset: root.childNodes.length };
}

export function getSelectionOffsets(root: HTMLElement): SelectionOffsets | null {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
        return null;
    }
    const range = selection.getRangeAt(0);
    if (!root.contains(range.startContainer) || !root.contains(range.endContainer)) {
        return null;
    }
    const preStart = range.cloneRange();
    preStart.selectNodeContents(root);
    preStart.setEnd(range.startContainer, range.startOffset);
    const start = preStart.toString().length;

    const preEnd = range.cloneRange();
    preEnd.selectNodeContents(root);
    preEnd.setEnd(range.endContainer, range.endOffset);
    const end = preEnd.toString().length;
    return { start, end };
}

export function restoreSelectionOffsets(root: HTMLElement, offsets: SelectionOffsets): void {
    const selection = window.getSelection();
    if (!selection) {
        return;
    }
    const startPosition = createRangeWithOffset(root, offsets.start);
    const endPosition = createRangeWithOffset(root, offsets.end);
    const range = document.createRange();
    range.setStart(startPosition.node, startPosition.offset);
    range.setEnd(endPosition.node, endPosition.offset);
    selection.removeAllRanges();
    selection.addRange(range);
}
