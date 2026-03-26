import { Event } from 'nanoevent';

import type {
    BlockMarkupConfig,
    ContentBlock,
    ContentEditorOptions,
    InlineMarkupConfig,
} from './types.js';
import { BlockParser } from './utils/BlockParser.js';
import { BlockRenderer } from './utils/BlockRenderer.js';
import { DomFixer } from './utils/DomFixer.js';
import { HtmlBlockSanitizer } from './utils/HtmlBlockSanitizer.js';
import { HtmlInlineSanitizer } from './utils/HtmlInlineSanitizer.js';

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
        { type: 'strong', tag: 'strong', label: 'Strong' },
        { type: 'em', tag: 'em', label: 'Emphasis' },
        { type: 's', tag: 's', label: 'Strikethrough' },
        { type: 'code', tag: 'code', label: 'Code' },
        { type: 'a', tag: 'a', label: 'Link' },
    ];

    private rootEl: HTMLElement | null = null;
    private options: ContentEditorOptions;
    private value: ContentBlock[];

    private inlineSanitizer: HtmlInlineSanitizer;
    private blockSanitizer: HtmlBlockSanitizer;
    private parser: BlockParser;
    private renderer: BlockRenderer;
    private domFixer: DomFixer;

    onUpdate = new Event<ContentBlock[]>();

    private listeners = {
        onInput: () => this.onInput(),
    };

    constructor(
        modelValue: ContentBlock[] | null | undefined,
        options: Partial<ContentEditorOptions> | undefined,
    ) {
        this.options = this.normalizeOptions(options);
        this.inlineSanitizer = new HtmlInlineSanitizer(this.options.inlines ?? []);
        this.blockSanitizer = new HtmlBlockSanitizer(this.options.blocks, this.inlineSanitizer);
        this.parser = new BlockParser(this.options.blocks, this.options.defaultBlockType);
        this.renderer = new BlockRenderer(this.options.blocks);
        this.domFixer = new DomFixer(this.options.blocks, this.options.defaultBlockType);

        this.value = this.sanitizeContentValue(modelValue);
    }

    getOptions(): ContentEditorOptions {
        return this.options;
    }

    mount(rootEl: HTMLElement): void {
        this.rootEl = rootEl;
        this.rootEl.setAttribute('contenteditable', 'true');
        this.rootEl.setAttribute('spellcheck', 'true');
        this.renderToEditor();
        this.rootEl.addEventListener('input', this.listeners.onInput);
    }

    unmount(): void {
        if (!this.rootEl) {
            return;
        }
        this.rootEl.removeEventListener('input', this.listeners.onInput);
        this.rootEl = null;
    }

    setValue(value: ContentBlock[] | null | undefined): void {
        this.value = this.sanitizeContentValue(value);
        this.renderToEditor();
    }

    private renderToEditor(): void {
        if (!this.rootEl) {
            return;
        }
        this.rootEl.innerHTML = this.renderer.render(this.value);
    }

    private applyEditorDomAsSourceOfTruth(): void {
        if (!this.rootEl) {
            return;
        }
        this.domFixer.fixRoot(this.rootEl);
        const parsedBlocks = this.parser.parseRoot(this.rootEl);
        const nextValue = this.sanitizeParsedValue(parsedBlocks);
        const renderedNextHtml = this.renderer.render(nextValue);
        const hasChanges = JSON.stringify(nextValue) !== JSON.stringify(this.value);
        const needsRerender = ContentEditorController.normalizeEditorHtml(this.rootEl.innerHTML) !== ContentEditorController.normalizeEditorHtml(renderedNextHtml);
        this.value = nextValue;
        if (needsRerender) {
            this.rootEl.innerHTML = renderedNextHtml;
        }
        if (hasChanges) {
            this.emitModel();
        }
    }

    private emitModel(): void {
        this.onUpdate.emit(this.value);
    }

    private onInput(): void {
        this.applyEditorDomAsSourceOfTruth();
    }

    private sanitizeContentValue(input: unknown): ContentBlock[] {
        const blocks = this.blockSanitizer.sanitizeValue(input);
        return blocks.length ? blocks : this.createEmptyValue();
    }

    private sanitizeParsedValue(blocks: ContentBlock[]): ContentBlock[] {
        // BlockParser returns ContentBlock items, but inline HTML inside `text` may still contain unsupported markup.
        // BlockSanitizer sanitizes inline HTML into the canonical form we store as the source of truth.
        const sanitized = this.blockSanitizer.sanitizeValue(blocks);
        return sanitized.length ? sanitized : this.createEmptyValue();
    }

    private createEmptyValue(): ContentBlock[] {
        return [
            {
                type: this.options.defaultBlockType,
                text: '',
            },
        ];
    }

    private static normalizeEditorHtml(html: string): string {
        return html
            .replaceAll(/>\s+</g, '><')
            .replaceAll(/<br\s*\/?>/g, '<br>')
            .trim();
    }

    private normalizeOptions(options?: Partial<ContentEditorOptions>): ContentEditorOptions {
        const blocks = options?.blocks?.length ? options.blocks : ContentEditorController.DEFAULT_BLOCKS;
        const inlines = options?.inlines?.length ? options.inlines : ContentEditorController.DEFAULT_INLINES;
        const defaultBlockType = options?.defaultBlockType ?? 'p';
        return {
            blocks,
            inlines,
            defaultBlockType,
        };
    }

}
