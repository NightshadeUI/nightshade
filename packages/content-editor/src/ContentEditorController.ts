import { Event } from 'nanoevent';

import type {
    BlockMarkupConfig,
    ContentBlock,
    ContentEditorOptions,
    ContentInlineType,
    InlineMarkupConfig,
    ToolbarState,
} from './types.js';
import { parseEditorElement, renderContentValue, sanitizeContentValue } from './utils/content.js';
import { getSelectionOffsets, restoreSelectionOffsets } from './utils/selection.js';

export class ContentEditorController {

    static readonly DEFAULT_BLOCKS: BlockMarkupConfig[] = [
        { type: 'h1', tag: 'h1', label: 'Page Title' },
        { type: 'h2', tag: 'h2', label: 'Section Header' },
        { type: 'h3', tag: 'h3', label: 'Subsection Header' },
        { type: 'h4', tag: 'h4', label: 'Minor Header' },
        { type: 'h5', tag: 'h5', label: 'Caption' },
        { type: 'h6', tag: 'h6', label: 'Small Caption' },
        { type: 'p', tag: 'p', label: 'Paragraph' },
        { type: 'kicker', tag: 'p', label: 'Kicker', className: 'kicker' },
        { type: 'callout', tag: 'p', label: 'Callout', className: 'callout' },
        { type: 'small', tag: 'p', label: 'Small Text', className: 'small' },
        { type: 'fine', tag: 'p', label: 'Fine Print', className: 'fine' },
    ];

    static readonly DEFAULT_INLINES: InlineMarkupConfig[] = [
        { type: 'bold', tag: 'strong', label: 'Bold' },
        { type: 'italic', tag: 'em', label: 'Italic' },
        { type: 'underline', tag: 'u', label: 'Underline' },
    ];

    isApplyingExternalUpdate = false;

    private rootEl: HTMLElement | null = null;
    private options: ContentEditorOptions;
    private value: ContentBlock[];
    private hasEditorFocus = false;
    private isMounted = false;
    private toolbarState: ToolbarState = {
        visible: false,
        x: 0,
        y: 0,
        activeBlockType: null,
        activeInlineTypes: [],
        hasSelection: false,
    };

    onUpdate = new Event<ContentBlock[]>();
    onToolbar = new Event<ToolbarState>();

    private listeners = {
        onInput: () => this.onInput(),
        onFocusIn: () => this.onFocusIn(),
        onFocusOut: () => this.onFocusOut(),
        onSelectionRelevantEvent: () => this.onSelectionRelevantEvent(),
        onSelectionChange: () => this.onSelectionChange(),
    };

    constructor(
        modelValue: ContentBlock[] | null | undefined,
        options: Partial<ContentEditorOptions> | undefined,
    ) {
        this.options = this.normalizeOptions(options);
        this.value = sanitizeContentValue(modelValue, this.options);
    }

    getOptions(): ContentEditorOptions {
        return this.options;
    }

    getToolbarState(): ToolbarState {
        return this.toolbarState;
    }

    mount(rootEl: HTMLElement): void {
        this.rootEl = rootEl;
        this.isMounted = true;
        this.rootEl.setAttribute('contenteditable', 'true');
        this.rootEl.setAttribute('spellcheck', 'true');
        this.renderToEditor();
        this.rootEl.addEventListener('input', this.listeners.onInput);
        this.rootEl.addEventListener('focusin', this.listeners.onFocusIn);
        this.rootEl.addEventListener('focusout', this.listeners.onFocusOut);
        this.rootEl.addEventListener('keyup', this.listeners.onSelectionRelevantEvent);
        this.rootEl.addEventListener('mouseup', this.listeners.onSelectionRelevantEvent);
        document.addEventListener('selectionchange', this.listeners.onSelectionChange);
    }

    unmount(): void {
        if (!this.rootEl) {
            return;
        }
        this.isMounted = false;
        this.rootEl.removeEventListener('input', this.listeners.onInput);
        this.rootEl.removeEventListener('focusin', this.listeners.onFocusIn);
        this.rootEl.removeEventListener('focusout', this.listeners.onFocusOut);
        this.rootEl.removeEventListener('keyup', this.listeners.onSelectionRelevantEvent);
        this.rootEl.removeEventListener('mouseup', this.listeners.onSelectionRelevantEvent);
        document.removeEventListener('selectionchange', this.listeners.onSelectionChange);
        this.rootEl = null;
    }

    setValue(value: ContentBlock[] | null | undefined): void {
        this.isApplyingExternalUpdate = true;
        this.value = sanitizeContentValue(value, this.options);
        this.renderToEditor();
        this.syncToolbar();
        this.isApplyingExternalUpdate = false;
    }

    applyBlockType(type: string): void {
        if (!this.rootEl) {
            return;
        }
        const activeBlock = this.getActiveBlockElement();
        if (!activeBlock) {
            return;
        }
        const blockIndex = Array.from(this.rootEl.children).indexOf(activeBlock);
        if (blockIndex < 0 || !this.value[blockIndex]) {
            return;
        }
        this.value[blockIndex].type = type;
        const offsets = getSelectionOffsets(this.rootEl);
        this.renderToEditor();
        if (offsets) {
            restoreSelectionOffsets(this.rootEl, offsets);
        }
        this.emitModel();
        this.syncToolbar();
    }

    applyInlineType(type: ContentInlineType): void {
        if (!this.rootEl) {
            return;
        }
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
            return;
        }
        const range = selection.getRangeAt(0);
        if (!this.rootEl.contains(range.commonAncestorContainer)) {
            return;
        }
        const inlineDef = this.options.inlines?.find(inline => inline.type === type);
        if (!inlineDef) {
            return;
        }
        const wrapper = document.createElement(inlineDef.tag);
        if (inlineDef.className) {
            wrapper.className = inlineDef.className;
        }
        try {
            range.surroundContents(wrapper);
        } catch (_err) {
            const fragment = range.extractContents();
            wrapper.appendChild(fragment);
            range.insertNode(wrapper);
        }
        this.applyEditorDomAsSourceOfTruth();
    }

    private renderToEditor(): void {
        if (!this.rootEl) {
            return;
        }
        this.rootEl.innerHTML = renderContentValue(this.value, this.options);
    }

    private applyEditorDomAsSourceOfTruth(): void {
        if (!this.rootEl) {
            return;
        }
        const offsets = getSelectionOffsets(this.rootEl);
        const nextValue = parseEditorElement(this.rootEl, this.options);
        const hasChanges = JSON.stringify(nextValue) !== JSON.stringify(this.value);
        this.value = nextValue;
        if (hasChanges) {
            this.renderToEditor();
        }
        if (offsets) {
            restoreSelectionOffsets(this.rootEl, offsets);
        }
        this.emitModel();
        this.syncToolbar();
    }

    private emitModel(): void {
        this.onUpdate.emit(this.value);
    }

    private onInput(): void {
        this.applyEditorDomAsSourceOfTruth();
    }

    private onFocusIn(): void {
        this.hasEditorFocus = true;
        this.syncToolbar();
    }

    private onFocusOut(): void {
        window.setTimeout(() => {
            if (!this.rootEl) {
                return;
            }
            const activeElement = document.activeElement;
            this.hasEditorFocus = !!activeElement && this.rootEl.contains(activeElement);
            this.syncToolbar();
        }, 0);
    }

    private onSelectionRelevantEvent(): void {
        this.syncToolbar();
    }

    private onSelectionChange(): void {
        this.syncToolbar();
    }

    private getActiveBlockElement(): HTMLElement | null {
        if (!this.rootEl) {
            return null;
        }
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) {
            return null;
        }
        const range = selection.getRangeAt(0);
        const container = range.startContainer.nodeType === Node.ELEMENT_NODE ?
            range.startContainer as HTMLElement :
            range.startContainer.parentElement;
        if (!container || !this.rootEl.contains(container)) {
            return null;
        }
        let current: HTMLElement | null = container;
        while (current && current.parentElement !== this.rootEl) {
            current = current.parentElement;
        }
        return current && current.parentElement === this.rootEl ? current : null;
    }

    private syncToolbar(): void {
        if (!this.rootEl || !this.hasEditorFocus) {
            this.updateToolbar({
                visible: false,
                x: 0,
                y: 0,
                activeBlockType: null,
                activeInlineTypes: [],
                hasSelection: false,
            });
            return;
        }
        const selection = window.getSelection();
        const blockEl = this.getActiveBlockElement();
        if (!selection || selection.rangeCount === 0 || !blockEl) {
            this.updateToolbar({
                visible: false,
                x: 0,
                y: 0,
                activeBlockType: null,
                activeInlineTypes: [],
                hasSelection: false,
            });
            return;
        }
        const range = selection.getRangeAt(0);
        const editorRect = this.rootEl.getBoundingClientRect();
        const anchorRect = !selection.isCollapsed ? range.getBoundingClientRect() : blockEl.getBoundingClientRect();
        const activeBlockType = this.options.blocks.find(block => {
            if (block.tag.toLowerCase() !== blockEl.tagName.toLowerCase()) {
                return false;
            }
            return !block.className || blockEl.classList.contains(block.className);
        })?.type ?? null;
        this.updateToolbar({
            visible: true,
            x: anchorRect.left - editorRect.left,
            y: anchorRect.top - editorRect.top - 12,
            activeBlockType,
            activeInlineTypes: this.getActiveInlineTypes(),
            hasSelection: !selection.isCollapsed,
        });
    }

    private getActiveInlineTypes(): string[] {
        if (!this.rootEl) {
            return [];
        }
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) {
            return [];
        }
        let element: HTMLElement | null = selection.anchorNode?.nodeType === Node.ELEMENT_NODE ?
            selection.anchorNode as HTMLElement :
            selection.anchorNode?.parentElement ?? null;
        if (!element || !this.rootEl.contains(element)) {
            return [];
        }
        const active = new Set<string>();
        while (element && element !== this.rootEl) {
            const match = this.options.inlines?.find(inline => {
                if (inline.tag.toLowerCase() !== element?.tagName.toLowerCase()) {
                    return false;
                }
                return !inline.className || element?.classList.contains(inline.className);
            });
            if (match) {
                active.add(match.type);
            }
            element = element.parentElement;
        }
        return Array.from(active);
    }

    private updateToolbar(next: ToolbarState): void {
        this.toolbarState = next;
        if (!this.isMounted) {
            return;
        }
        this.onToolbar.emit(this.toolbarState);
    }

    private normalizeOptions(options?: Partial<ContentEditorOptions>): ContentEditorOptions {
        const blocks = options?.blocks?.length ? options.blocks : ContentEditorController.DEFAULT_BLOCKS;
        const inlines = options?.inlines?.length ? options.inlines : ContentEditorController.DEFAULT_INLINES;
        const defaultBlockType = options?.defaultBlockType ?? blocks[0].type;
        return {
            blocks,
            inlines,
            defaultBlockType,
        };
    }

}
