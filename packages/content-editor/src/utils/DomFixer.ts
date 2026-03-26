import type { BlockMarkupConfig, ContentBlockType } from '../types.js';

export class DomFixer {

    private defaultBlock: BlockMarkupConfig | undefined;

    constructor(
        private blocks: BlockMarkupConfig[],
        private defaultBlockType: ContentBlockType,
    ) {
        this.defaultBlock = this.blocks.find(block => block.type === this.defaultBlockType);
    }

    fixRoot(root: HTMLElement): void {
        this.stripStyleAttributes(root);
        this.cleanupEmptySpans(root);
        this.normalizeEmptyDivs(root);
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
        const tag = this.defaultBlock?.tag ?? 'p';
        const block = document.createElement(tag);
        if (this.defaultBlock?.className) {
            block.className = this.defaultBlock.className;
        }
        return block;
    }

}
