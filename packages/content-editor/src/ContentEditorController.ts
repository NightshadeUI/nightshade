export type ContentBlockType = 'p1' | 'p2' | 'p3' | 'h1' | 'h2' | 'h3';
type InlineMarkType = 'strong' | 'em' | 's' | 'code' | 'a';

export interface ContentTextSegment {
    kind: 'text';
    text: string;
}

export interface ContentBreakSegment {
    kind: 'br';
}

export interface ContentMarkSegment {
    kind: 'mark';
    type: InlineMarkType;
    href?: string;
    children: ContentTextSegment[];
}

export type ContentSegment = ContentTextSegment | ContentBreakSegment | ContentMarkSegment;

export interface ContentNode {
    id: string;
    type: ContentBlockType;
    content: ContentSegment[];
}

export interface ContentDocument {
    nodes: ContentNode[];
}

type ChangeListener = (doc: ContentDocument) => void;
type FocusListener = (node: ContentNode | null) => void;

const BLOCK_TAGS: Record<ContentBlockType, 'p' | 'h1' | 'h2' | 'h3'> = {
    p1: 'p',
    p2: 'p',
    p3: 'p',
    h1: 'h1',
    h2: 'h2',
    h3: 'h3',
};

const ALLOWED_MARK_TAGS = ['STRONG', 'EM', 'S', 'CODE', 'A', 'BR'];
const ALLOWED_BLOCK_TAGS = ['P', 'H1', 'H2', 'H3'];

export class ContentEditorController {

    el: HTMLElement | null = null;
    isApplyingExternalUpdate = false;

    onChange: ChangeListener | null = null;
    onFocusChange: FocusListener | null = null;

    constructor(public doc: ContentDocument = ContentEditorController.createEmptyDocument()) {}

    static createEmptyDocument(): ContentDocument {
        return {
            nodes: [{
                id: ContentEditorController.createNodeId(),
                type: 'p1',
                content: [{ kind: 'text', text: '' }],
            }],
        };
    }

    static createNodeId(): string {
        return `cn_${Math.random().toString(36).slice(2, 10)}`;
    }

    mount(el: HTMLElement) {
        this.el = el;
        this.render();
    }

    unmount() {
        this.el = null;
    }

    setDocument(doc: ContentDocument) {
        this.doc = this.normalizeDocument(doc);
        this.render();
    }

    handleInput() {
        if (!this.el) {
            return;
        }
        const sanitized = this.sanitizeHtml(this.el.innerHTML);
        this.doc = this.deserializeHtml(sanitized);
        this.render();
        this.emitChange();
        this.emitFocusedNode();
    }

    handleFocusChange() {
        this.emitFocusedNode();
    }

    changeFocusedBlockType(newType: ContentBlockType): boolean {
        const nodeId = this.getFocusedNodeId();
        if (!nodeId) {
            return false;
        }
        return this.changeNodeType(nodeId, newType);
    }

    changeNodeType(nodeId: string, newType: ContentBlockType): boolean {
        const node = this.doc.nodes.find(n => n.id === nodeId);
        if (!node) {
            return false;
        }
        node.type = newType;
        this.render();
        this.emitChange();
        this.emitFocusedNode();
        return true;
    }

    getFocusedNode(): ContentNode | null {
        const nodeId = this.getFocusedNodeId();
        if (!nodeId) {
            return null;
        }
        return this.doc.nodes.find(n => n.id === nodeId) ?? null;
    }

    private emitChange() {
        if (this.onChange) {
            this.onChange(this.cloneDocument(this.doc));
        }
    }

    private emitFocusedNode() {
        if (this.onFocusChange) {
            this.onFocusChange(this.getFocusedNode());
        }
    }

    private getFocusedNodeId(): string | null {
        if (!this.el) {
            return null;
        }
        const sel = window.getSelection();
        if (!sel || sel.rangeCount === 0) {
            return null;
        }
        const anchor = sel.anchorNode;
        const el = anchor instanceof HTMLElement ? anchor : anchor?.parentElement;
        const nodeEl = el?.closest('[data-content-node-id]');
        return nodeEl?.getAttribute('data-content-node-id') ?? null;
    }

    private render() {
        if (!this.el) {
            return;
        }
        const html = this.serializeHtml(this.doc);
        if (this.el.innerHTML !== html) {
            this.isApplyingExternalUpdate = true;
            this.el.innerHTML = html;
            this.isApplyingExternalUpdate = false;
        }
    }

    private serializeHtml(doc: ContentDocument): string {
        return doc.nodes.map(node => {
            const tag = BLOCK_TAGS[node.type];
            const attrs = `data-content-node-id="${this.escapeAttr(node.id)}" data-content-node-type="${node.type}"`;
            const content = this.serializeSegments(node.content);
            return `<${tag} ${attrs}>${content || '<br>'}</${tag}>`;
        }).join('');
    }

    private serializeSegments(segments: ContentSegment[]): string {
        return segments.map(segment => {
            if (segment.kind === 'text') {
                return this.escapeHtml(segment.text);
            }
            if (segment.kind === 'br') {
                return '<br>';
            }
            const inner = segment.children.map(child => this.escapeHtml(child.text)).join('');
            if (segment.type === 'a') {
                const href = this.escapeAttr(segment.href || '#');
                return `<a href="${href}">${inner}</a>`;
            }
            return `<${segment.type}>${inner}</${segment.type}>`;
        }).join('');
    }

    private deserializeHtml(html: string): ContentDocument {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const nodes: ContentNode[] = [];
        const blocks = Array.from(doc.body.children)
            .filter(el => ALLOWED_BLOCK_TAGS.includes(el.tagName));

        for (const blockEl of blocks) {
            const explicitType = blockEl.getAttribute('data-content-node-type') as ContentBlockType | null;
            const fallbackType = this.tagToType(blockEl.tagName);
            const type = explicitType && this.isContentBlockType(explicitType) ? explicitType : fallbackType;
            const id = blockEl.getAttribute('data-content-node-id') || ContentEditorController.createNodeId();
            const content = this.parseInlineSegments(blockEl);
            nodes.push({ id, type, content });
        }

        if (nodes.length === 0) {
            return ContentEditorController.createEmptyDocument();
        }

        return { nodes };
    }

    private parseInlineSegments(blockEl: Element): ContentSegment[] {
        const segments: ContentSegment[] = [];

        for (const child of Array.from(blockEl.childNodes)) {
            if (child.nodeType === Node.TEXT_NODE) {
                segments.push({ kind: 'text', text: child.textContent || '' });
                continue;
            }
            if (child.nodeType !== Node.ELEMENT_NODE) {
                continue;
            }
            const el = child as HTMLElement;
            if (el.tagName === 'BR') {
                segments.push({ kind: 'br' });
                continue;
            }
            if (ALLOWED_MARK_TAGS.includes(el.tagName)) {
                if (el.tagName === 'A') {
                    segments.push({
                        kind: 'mark',
                        type: 'a',
                        href: this.sanitizeHref(el.getAttribute('href')),
                        children: [{ kind: 'text', text: el.textContent || '' }],
                    });
                } else {
                    segments.push({
                        kind: 'mark',
                        type: el.tagName.toLowerCase() as InlineMarkType,
                        children: [{ kind: 'text', text: el.textContent || '' }],
                    });
                }
                continue;
            }
            segments.push({ kind: 'text', text: el.textContent || '' });
        }

        return this.normalizeSegments(segments);
    }

    private sanitizeHtml(html: string): string {
        const parser = new DOMParser();
        const parsed = parser.parseFromString(html, 'text/html');
        const elements = Array.from(parsed.body.querySelectorAll('*')).reverse();

        for (const el of elements) {
            if (el === parsed.body) {
                continue;
            }
            const isAllowedBlock = ALLOWED_BLOCK_TAGS.includes(el.tagName);
            const isAllowedMark = ALLOWED_MARK_TAGS.includes(el.tagName);
            const isAllowed = isAllowedBlock || isAllowedMark;
            if (!isAllowed) {
                this.unwrapElement(el);
                continue;
            }

            if (el.tagName === 'A') {
                const href = this.sanitizeHref(el.getAttribute('href'));
                if (href) {
                    el.setAttribute('href', href);
                } else {
                    el.removeAttribute('href');
                }
            }
        }

        this.normalizeToBlocks(parsed.body);
        return parsed.body.innerHTML;
    }

    private normalizeToBlocks(root: HTMLElement) {
        const nodes = Array.from(root.childNodes);
        let currentParagraph: HTMLElement | null = null;

        for (const node of nodes) {
            if (node.nodeType === Node.ELEMENT_NODE && ALLOWED_BLOCK_TAGS.includes((node as HTMLElement).tagName)) {
                currentParagraph = null;
                continue;
            }
            if (!currentParagraph) {
                currentParagraph = root.ownerDocument.createElement('p');
                root.insertBefore(currentParagraph, node);
            }
            currentParagraph.appendChild(node);
        }

        if (root.children.length === 0) {
            root.appendChild(root.ownerDocument.createElement('p'));
        }
    }

    private unwrapElement(el: Element) {
        const parent = el.parentNode;
        if (!parent) {
            return;
        }
        while (el.firstChild) {
            parent.insertBefore(el.firstChild, el);
        }
        parent.removeChild(el);
    }

    private normalizeDocument(doc: ContentDocument): ContentDocument {
        const nodes = (doc.nodes || []).map(node => ({
            id: node.id || ContentEditorController.createNodeId(),
            type: this.isContentBlockType(node.type) ? node.type : 'p1',
            content: this.normalizeSegments(node.content || []),
        }));
        if (nodes.length === 0) {
            return ContentEditorController.createEmptyDocument();
        }
        return { nodes };
    }

    private normalizeSegments(segments: ContentSegment[]): ContentSegment[] {
        const normalized: ContentSegment[] = [];
        let textBuffer = '';

        const pushTextBuffer = () => {
            if (textBuffer) {
                normalized.push({ kind: 'text', text: textBuffer });
                textBuffer = '';
            }
        };

        for (const segment of segments) {
            if (segment.kind === 'text') {
                textBuffer += segment.text;
                continue;
            }
            pushTextBuffer();
            if (segment.kind === 'br') {
                normalized.push({ kind: 'br' });
                continue;
            }
            const markText = segment.children.map(child => child.text).join('');
            normalized.push({
                kind: 'mark',
                type: segment.type,
                href: segment.type === 'a' ? this.sanitizeHref(segment.href) : undefined,
                children: [{ kind: 'text', text: markText }],
            });
        }

        pushTextBuffer();
        return normalized;
    }

    private tagToType(tagName: string): ContentBlockType {
        switch (tagName.toUpperCase()) {
            case 'H1': return 'h1';
            case 'H2': return 'h2';
            case 'H3': return 'h3';
            default: return 'p1';
        }
    }

    private isContentBlockType(type: string): type is ContentBlockType {
        return ['p1', 'p2', 'p3', 'h1', 'h2', 'h3'].includes(type);
    }

    private sanitizeHref(href: string | null | undefined): string | undefined {
        if (!href) {
            return undefined;
        }
        const clean = href.trim();
        if (!clean) {
            return undefined;
        }
        if (clean.startsWith('http://') || clean.startsWith('https://') || clean.startsWith('/')) {
            return clean;
        }
        return undefined;
    }

    private cloneDocument(doc: ContentDocument): ContentDocument {
        return JSON.parse(JSON.stringify(doc)) as ContentDocument;
    }

    private escapeHtml(text: string): string {
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }

    private escapeAttr(text: string): string {
        return this.escapeHtml(text).replace(/"/g, '&quot;');
    }

}
