import { Event } from 'nanoevent';

import {
    ContentBlock,
    ContentEditorConfig,
} from '../types.js';
import { BlockMap } from './BlockMap.js';
import { BlockParser } from './BlockParser.js';
import { BlockRenderer } from './BlockRenderer.js';
import { BlockSanitizer } from './BlockSanitizer.js';
import { deepEquals } from './compare.js';
import { DEFAULT_BLOCKS, DEFAULT_INLINES } from './constants.js';
import { DomFixer } from './DomFixer.js';
import { DomSelection } from './DomSelection.js';
import { EditorInputHandler } from './EditorInputHandler.js';
import { InlineSanitizer } from './InlineSanitizer.js';

interface EditorListeners {
    onInput: (e: globalThis.Event) => void;
    onBeforeInput: (e: globalThis.InputEvent) => void;
    onSelectionChange: () => void;
}

export class ContentEditor {

    readonly config: ContentEditorConfig;

    inlineSanitizer: InlineSanitizer;
    blockSanitizer: BlockSanitizer;
    blockParser: BlockParser;
    blockRenderer: BlockRenderer;
    domFixer: DomFixer;
    blockMap: BlockMap;
    domSelection: DomSelection;
    editorInputHandler: EditorInputHandler;

    onUpdate = new Event<ContentBlock[]>();

    private rootEl: HTMLElement | null = null;
    private value: ContentBlock[] = [];

    private listeners!: EditorListeners;

    constructor(
        options?: Partial<ContentEditorConfig>,
    ) {
        this.config = {
            blocks: DEFAULT_BLOCKS,
            inlines: DEFAULT_INLINES,
            defaultBlockType: 'p',
            ...options,
        };
        this.inlineSanitizer = new InlineSanitizer(this);
        this.blockSanitizer = new BlockSanitizer(this);
        this.blockParser = new BlockParser(this);
        this.blockRenderer = new BlockRenderer(this);
        this.domFixer = new DomFixer(this);
        this.blockMap = new BlockMap(this);
        this.domSelection = new DomSelection(this);
        this.editorInputHandler = new EditorInputHandler(this);
    }

    mount(rootEl: HTMLElement): void {
        this.rootEl = rootEl;
        this.rootEl.setAttribute('contenteditable', 'true');
        this.rootEl.setAttribute('spellcheck', 'true');
        this.renderToEditor();
        this.listeners = {
            onBeforeInput: (e: globalThis.Event) => this.editorInputHandler.onBeforeInput(e as InputEvent),
            onInput: (e: globalThis.Event) => this.editorInputHandler.onInput(e as InputEvent),
            onSelectionChange: () => this.domSelection.onSelectionChanged(),
        };
        this.rootEl.addEventListener('input', this.listeners.onInput);
        this.rootEl.addEventListener('beforeinput', this.listeners.onBeforeInput);
        document.addEventListener('selectionchange', this.listeners.onSelectionChange);
        this.domSelection.onSelectionChanged();
    }

    unmount(): void {
        if (!this.rootEl) {
            return;
        }
        this.rootEl.removeEventListener('input', this.listeners.onInput);
        this.rootEl.removeEventListener('beforeinput', this.listeners.onBeforeInput);
        document.removeEventListener('selectionchange', this.listeners.onSelectionChange);
        this.rootEl = null;
    }

    getRootElement(): HTMLElement | null {
        return this.rootEl;
    }

    getValue(): ContentBlock[] {
        return this.value;
    }

    setModelValue(value: ContentBlock[] | null | undefined) {
        this.value = this.sanitizeInputBlocks(value);
        this.renderToEditor();
        this.domSelection.onSelectionChanged();
    }

    assignValue(value: ContentBlock[]) {
        const hasChanges = !deepEquals(value, this.value);
        if (hasChanges) {
            this.value = value;
            this.emitUpdate();
        }
    }

    emitUpdate() {
        this.onUpdate.emit(this.value);
    }

    private sanitizeInputBlocks(input: unknown): ContentBlock[] {
        const blocks = this.blockSanitizer.sanitizeInputBlocks(input);
        return blocks.length ?
            blocks :
            [
                {
                    type: this.config.defaultBlockType,
                    text: '',
                },
            ];
    }

    private renderToEditor(): void {
        if (!this.rootEl) {
            return;
        }
        this.rootEl.innerHTML = this.blockRenderer.render(this.value);
    }

}
