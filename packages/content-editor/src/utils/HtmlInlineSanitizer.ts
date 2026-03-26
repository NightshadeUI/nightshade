import type { InlineMarkupConfig } from '../types.js';

export class HtmlInlineSanitizer {

    private readonly inlines: InlineMarkupConfig[];

    constructor(config: InlineMarkupConfig[] | undefined) {
        this.inlines = config ?? [];
    }

    public sanitizeHtml(input: string): string {
        const template = document.createElement('template');
        template.innerHTML = input;
        const root = document.createElement('div');
        Array.from(template.content.childNodes).forEach(node => {
            const sanitized = this.sanitizeNode(node);
            if (sanitized) {
                root.appendChild(sanitized);
            }
        });
        return root.innerHTML;
    }

    public sanitizeNode(node: Node): Node | null {
        if (node.nodeType === Node.TEXT_NODE) {
            return document.createTextNode(node.textContent ?? '');
        }
        if (node.nodeType !== Node.ELEMENT_NODE) {
            return null;
        }
        const element = node as HTMLElement;
        const fragment = document.createDocumentFragment();
        Array.from(element.childNodes).forEach(child => {
            const sanitizedChild = this.sanitizeNode(child);
            if (sanitizedChild) {
                fragment.appendChild(sanitizedChild);
            }
        });
        const inline = this.findInlineDefinitionForElement(element);
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

    private findInlineDefinitionForElement(element: HTMLElement): InlineMarkupConfig | null {
        const tag = element.tagName.toLowerCase();
        const classList = Array.from(element.classList);
        const matching = this.inlines.filter(inline => inline.tag.toLowerCase() === tag);
        if (!matching.length) {
            return null;
        }
        const strictClassMatch = matching.find(inline => inline.className && element.classList.contains(inline.className));
        if (strictClassMatch) {
            return strictClassMatch;
        }
        if (classList.length > 0) {
            return null;
        }
        return matching.find(inline => !inline.className) ?? null;
    }

}
