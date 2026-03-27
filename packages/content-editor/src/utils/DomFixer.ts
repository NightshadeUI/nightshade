import type { ContentEditor } from './ContentEditor.js';
import { hasEqualAttributes } from './dom.js';

export class DomFixer {

    constructor(public editor: ContentEditor) {}

    fixRoot(root: HTMLElement): void {
        for (const node of [...root.childNodes]) {
            if (node.nodeType !== Node.ELEMENT_NODE) {
                root.removeChild(node);
                continue;
            }
            const el = node as HTMLElement;
            this.fixBlockElement(el);
        }
    }

    fixBlockElement(el: HTMLElement): void {
        this.normalizeEmpty(el);
        this.ensureSupportedBlockType(el);
        this.stripStyleAttributes(el);
        this.cleanupEmptySpans(el);
        this.mergeAdjacentInlineMarkup(el);
    }

    private stripStyleAttributes(el: HTMLElement): void {
        if (el.hasAttribute('style')) {
            el.removeAttribute('style');
        }
        for (const child of el.querySelectorAll('[style]')) {
            child.removeAttribute('style');
        }
    }

    private cleanupEmptySpans(el: HTMLElement): void {
        const spans = Array.from(el.querySelectorAll('span')).reverse();
        for (const span of spans) {
            if (span.attributes.length > 0) {
                continue;
            }
            const parent = span.parentNode;
            if (!parent) {
                continue;
            }
            while (span.firstChild) {
                parent.insertBefore(span.firstChild, span);
            }
            parent.removeChild(span);
        }
    }

    private mergeAdjacentInlineMarkup(node: Node): void {
        let current: ChildNode | null = node.firstChild;
        while (current) {
            if (current.nodeType === Node.ELEMENT_NODE) {
                this.mergeAdjacentInlineMarkup(current);
            }
            const next = current.nextSibling;
            if (this.canMergeAdjacentInlineElements(current, next)) {
                this.mergeSiblingElements(current as HTMLElement, next as HTMLElement);
                continue;
            }
            current = next;
        }
    }

    private canMergeAdjacentInlineElements(
        left: ChildNode | null,
        right: ChildNode | null,
    ): boolean {
        if (left?.nodeType !== Node.ELEMENT_NODE || right?.nodeType !== Node.ELEMENT_NODE) {
            return false;
        }
        const leftEl = left as HTMLElement;
        const rightEl = right as HTMLElement;
        return hasEqualAttributes(leftEl, rightEl);
    }

    private mergeSiblingElements(left: HTMLElement, right: HTMLElement): void {
        while (right.firstChild) {
            left.appendChild(right.firstChild);
        }
        right.remove();
    }

    /**
     * <div><br></div> is inserted by browser when user presses Enter in non-paragraph.
     * Additionally, if split is done inside inline markup like <strong>,
     * the next empty block will contain something like <p><strong><br/></strong></p> which
     * we normalize to <p><br/></p>
     */
    private normalizeEmpty(el: HTMLElement): void {
        const text = el.textContent ?? '';
        if (text.trim() === '') {
            el.innerHTML = '<br>';
        }
    }

    private ensureSupportedBlockType(el: HTMLElement): void {
        const blockDef = this.editor.blockParser.findBlockDefinition(el);
        if (!blockDef) {
            const replacementEl = document.createElement(this.editor.config.defaultBlockType);
            replacementEl.innerHTML = el.innerHTML;
            el.parentNode?.replaceChild(replacementEl, el);
        }
    }

}
