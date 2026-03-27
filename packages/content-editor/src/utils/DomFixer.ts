import type { ContentEditor } from './ContentEditor.js';

export class DomFixer {

    constructor(public editor: ContentEditor) {}

    fixElement(el: HTMLElement): void {
        this.stripStyleAttributes(el);
        this.cleanupEmptySpans(el);
        this.normalizeEmptyDivs(el);
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

    // <div><br></div> is inserted by browser when user presses Enter in non-paragraph
    private normalizeEmptyDivs(root: HTMLElement): void {
        const divs = Array.from(root.querySelectorAll('div'));
        for (const div of divs) {
            const childNodes = Array.from(div.childNodes);
            if (childNodes.length !== 1) {
                continue;
            }
            const onlyChild = childNodes[0];
            if (onlyChild.nodeType !== Node.ELEMENT_NODE) {
                continue;
            }
            const onlyElement = onlyChild as HTMLElement;
            if (onlyElement.tagName !== 'BR') {
                continue;
            }
            const replacement = this.createDefaultBlockElement();
            replacement.innerHTML = '<BR/>';
            if (div.parentNode) {
                div.parentNode.replaceChild(replacement, div);
            }
        }
    }

    private createDefaultBlockElement(): HTMLElement {
        const defaultBlockType = this.editor.config.defaultBlockType;
        const defaultBlock = this.editor.config.blocks
            .find(block => block.type === defaultBlockType);
        const tag = defaultBlock?.tag ?? 'p';
        const block = document.createElement(tag);
        if (defaultBlock?.className) {
            block.className = defaultBlock.className;
        }
        return block;
    }

}
