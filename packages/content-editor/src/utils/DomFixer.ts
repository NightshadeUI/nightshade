import type { ContentEditor } from './ContentEditor.js';

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
        this.ensureSupportedType(el);
        this.stripStyleAttributes(el);
        this.cleanupEmptySpans(el);
    }

    private stripStyleAttributes(root: HTMLElement): void {
        if (root.hasAttribute('style')) {
            root.removeAttribute('style');
        }
        for (const el of root.querySelectorAll('[style]')) {
            el.removeAttribute('style');
        }
    }

    private cleanupEmptySpans(root: HTMLElement): void {
        const spans = Array.from(root.querySelectorAll('span')).reverse();
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

    private ensureSupportedType(el: HTMLElement): void {
        const blockDef = this.editor.blockParser.findBlockDefinition(el);
        if (!blockDef) {
            const replacementEl = document.createElement(this.editor.config.defaultBlockType);
            replacementEl.innerHTML = el.innerHTML;
            el.parentNode?.replaceChild(replacementEl, el);
        }
    }

}
