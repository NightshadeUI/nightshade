import type { InlineMarkupConfig } from '../types.js';
import { removeNode, unwrap } from './dom.js';

const DEFAULT_FORBIDDEN_TAGS = [
    'script',
    'style',
    'iframe',
    'object',
    'embed',
    'noscript',
    'template',
];

export class HtmlInlineSanitizer {

    constructor(
        public inlines: InlineMarkupConfig[],
        public forbiddenTags = DEFAULT_FORBIDDEN_TAGS,
    ) {}

    sanitizeHtml(input: string): string {
        const template = document.createElement('template');
        template.innerHTML = input;
        for (const node of Array.from(template.content.childNodes)) {
            this.sanitizeNodeInPlace(node);
        }
        const root = document.createElement('div');
        root.appendChild(template.content.cloneNode(true));
        return root.innerHTML;
    }

    private sanitizeNodeInPlace(node: Node): void {
        if (node.nodeType === Node.TEXT_NODE) {
            return;
        }
        const removed = this.removeUnsupported(node);
        if (removed) {
            return;
        }
        const el = node as HTMLElement;
        for (const child of [...el.childNodes]) {
            this.sanitizeNodeInPlace(child);
        }
        const inlineDef = this.findInlineDefinition(el);
        if (!inlineDef) {
            unwrap(el);
            return;
        }
        this.sanitizeSupportedEl(el, inlineDef);
    }

    private sanitizeSupportedEl(el: HTMLElement, inlineDef: InlineMarkupConfig): void {
        while (el.attributes.length > 0) {
            el.removeAttribute(el.attributes[0].name);
        }
        el.className = inlineDef.className ?? '';
    }

    private removeUnsupported(node: Node): boolean {
        if (node.nodeType !== Node.ELEMENT_NODE) {
            removeNode(node);
            return true;
        }
        const el = node as HTMLElement;
        if (el.namespaceURI !== 'http://www.w3.org/1999/xhtml') {
            removeNode(el);
            return true;
        }
        const tagName = el.tagName.toLowerCase();
        if (this.forbiddenTags.includes(tagName)) {
            removeNode(el);
            return true;
        }
        return false;
    }

    private findInlineDefinition(element: HTMLElement): InlineMarkupConfig | null {
        const tag = element.tagName.toLowerCase();
        const classList = [...element.classList];
        for (const inlineDef of this.inlines) {
            if (inlineDef.tag.toLowerCase() !== tag) {
                continue;
            }
            if (inlineDef.className && !classList.includes(inlineDef.className)) {
                continue;
            }
            return inlineDef;
        }
        return null;
    }

}
