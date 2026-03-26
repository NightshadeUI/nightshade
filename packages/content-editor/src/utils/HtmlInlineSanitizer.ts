import type { InlineMarkupConfig } from '../types.js';

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
        const root = document.createElement('div');
        for (const node of template.content.childNodes) {
            const sanitized = this.sanitizeNode(node);
            if (sanitized) {
                root.appendChild(sanitized);
            }
        }
        return root.innerHTML;
    }

    sanitizeNode(node: Node): Node | null {
        if (node.nodeType === Node.TEXT_NODE) {
            return document.createTextNode(node.textContent ?? '');
        }
        if (node.nodeType !== Node.ELEMENT_NODE) {
            return null;
        }
        const el = node as HTMLElement;
        if (el.namespaceURI !== 'http://www.w3.org/1999/xhtml') {
            return null;
        }
        const tagName = el.tagName.toLowerCase();
        if (this.forbiddenTags.includes(tagName)) {
            return null;
        }
        const fragment = document.createDocumentFragment();
        for (const child of el.childNodes) {
            const sanitizedChild = this.sanitizeNode(child);
            if (sanitizedChild) {
                fragment.appendChild(sanitizedChild);
            }
        }
        const inline = this.findInlineDefinition(el);
        if (!inline) {
            return fragment;
        }
        const safeElement = document.createElement(inline.tag);
        if (inline.className) {
            safeElement.className = inline.className;
        }
        safeElement.appendChild(fragment);
        return safeElement;
    }

    private findInlineDefinition(element: HTMLElement): InlineMarkupConfig | null {
        const tag = element.tagName.toLowerCase();
        const classList = Array.from(element.classList);
        for (const inline of this.inlines) {
            if (inline.tag.toLowerCase() !== tag) {
                continue;
            }
            if (inline.className && !classList.includes(inline.className)) {
                continue;
            }
            return inline;
        }
        return null;
    }

}
