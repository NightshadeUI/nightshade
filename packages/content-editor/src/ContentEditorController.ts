import { Event } from 'nanoevent';

import type {
    ContentEditorOptions,
    ContentInlineType,
    ContentValue,
    ToolbarState,
} from './types.js';
import { parseEditorElement, renderContentValue, sanitizeContentValue } from './utils/content.js';
import { normalizeOptions } from './utils/defaults.js';
import { getSelectionOffsets, restoreSelectionOffsets } from './utils/selection.js';

export class ContentEditorController {

    public isApplyingExternalUpdate = false;

    private rootEl: HTMLElement | null = null;
    private options: ContentEditorOptions;
    private value: ContentValue;
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

    public onUpdate = new Event<ContentValue>();
    public onToolbar = new Event<ToolbarState>();

    constructor(
        modelValue: ContentValue | null | undefined,
        options: Partial<ContentEditorOptions> | undefined,
    ) {
        this.options = normalizeOptions(options);
        this.value = sanitizeContentValue(modelValue, this.options);
    }

    public getOptions(): ContentEditorOptions {
        return this.options;
    }

    public getToolbarState(): ToolbarState {
        return this.toolbarState;
    }

    public mount(rootEl: HTMLElement): void {
        this.rootEl = rootEl;
        this.isMounted = true;
        this.rootEl.setAttribute('contenteditable', 'true');
        this.rootEl.setAttribute('spellcheck', 'true');
        this.renderToEditor();
        this.rootEl.addEventListener('input', this.onInput);
        this.rootEl.addEventListener('focusin', this.onFocusIn);
        this.rootEl.addEventListener('focusout', this.onFocusOut);
        this.rootEl.addEventListener('keyup', this.onSelectionRelevantEvent);
        this.rootEl.addEventListener('mouseup', this.onSelectionRelevantEvent);
        document.addEventListener('selectionchange', this.onSelectionChange);
    }

    public unmount(): void {
        if (!this.rootEl) {
            return;
        }
        this.isMounted = false;
        this.rootEl.removeEventListener('input', this.onInput);
        this.rootEl.removeEventListener('focusin', this.onFocusIn);
        this.rootEl.removeEventListener('focusout', this.onFocusOut);
        this.rootEl.removeEventListener('keyup', this.onSelectionRelevantEvent);
        this.rootEl.removeEventListener('mouseup', this.onSelectionRelevantEvent);
        document.removeEventListener('selectionchange', this.onSelectionChange);
        this.rootEl = null;
    }

    public setValue(value: ContentValue | null | undefined): void {
        this.isApplyingExternalUpdate = true;
        this.value = sanitizeContentValue(value, this.options);
        this.renderToEditor();
        this.syncToolbar();
        this.isApplyingExternalUpdate = false;
    }

    public applyBlockType(type: string): void {
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

    public applyInlineType(type: ContentInlineType): void {
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

    private onInput = (): void => {
        this.applyEditorDomAsSourceOfTruth();
    };

    private onFocusIn = (): void => {
        this.hasEditorFocus = true;
        this.syncToolbar();
    };

    private onFocusOut = (): void => {
        window.setTimeout(() => {
            if (!this.rootEl) {
                return;
            }
            const activeElement = document.activeElement;
            this.hasEditorFocus = !!activeElement && this.rootEl.contains(activeElement);
            this.syncToolbar();
        }, 0);
    };

    private onSelectionRelevantEvent = (): void => {
        this.syncToolbar();
    };

    private onSelectionChange = (): void => {
        this.syncToolbar();
    };

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

}
