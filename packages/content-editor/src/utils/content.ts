import type {
    ContentBlockDefinition,
    ContentBlockNode,
    ContentDocument,
    ContentEditorOptions,
    ContentInlineDefinition,
    ContentTextNode,
} from '../types.js';
import { createEmptyDocument } from './defaults.js';

function normalizeTextNode(text: string, marks: string[]): ContentTextNode {
    const normalizedMarks = marks.length ? Array.from(new Set(marks)) : undefined;
    return {
        type: 'text',
        text,
        marks: normalizedMarks,
    };
}

function findInlineTypeByTag(
    inlinesByTag: Map<string, ContentInlineDefinition>,
    element: HTMLElement,
): string | null {
    const tag = element.tagName.toLowerCase();
    const inlineByTag = inlinesByTag.get(tag);
    if (!inlineByTag) {
        return null;
    }
    if (inlineByTag.className && !element.classList.contains(inlineByTag.className)) {
        return null;
    }
    return inlineByTag.type;
}

function collectTextNodes(
    node: Node,
    activeMarks: string[],
    inlinesByTag: Map<string, ContentInlineDefinition>,
    result: ContentTextNode[],
): void {
    if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent ?? '';
        if (text) {
            result.push(normalizeTextNode(text, activeMarks));
        }
        return;
    }
    if (node.nodeType !== Node.ELEMENT_NODE) {
        return;
    }
    const element = node as HTMLElement;
    const inlineType = findInlineTypeByTag(inlinesByTag, element);
    const nextMarks = inlineType ? [...activeMarks, inlineType] : activeMarks;
    Array.from(element.childNodes).forEach(child => {
        collectTextNodes(child, nextMarks, inlinesByTag, result);
    });
}

function normalizeBlockNode(
    node: Node,
    options: ContentEditorOptions,
    inlinesByTag: Map<string, ContentInlineDefinition>,
): ContentBlockNode {
    const blockMap = new Map(options.blocks.map(item => [item.type, item]));
    const element = node.nodeType === Node.ELEMENT_NODE ? (node as HTMLElement) : null;
    const blockType = findBlockTypeForElement(element, options.blocks) ?? options.defaultBlockType ?? options.blocks[0].type;
    const block = blockMap.get(blockType) ?? options.blocks[0];
    const textNodes: ContentTextNode[] = [];
    if (element) {
        Array.from(element.childNodes).forEach(child => {
            collectTextNodes(child, [], inlinesByTag, textNodes);
        });
    } else {
        const text = node.textContent ?? '';
        textNodes.push(normalizeTextNode(text, []));
    }
    return {
        type: block.type,
        children: textNodes.length ? textNodes : [{ type: 'text', text: '' }],
    };
}

export function findBlockTypeForElement(
    element: HTMLElement | null,
    blocks: ContentBlockDefinition[],
): string | null {
    if (!element) {
        return null;
    }
    const tag = element.tagName.toLowerCase();
    const match = blocks.find(block => {
        if (block.tag.toLowerCase() !== tag) {
            return false;
        }
        if (!block.className) {
            return true;
        }
        return element.classList.contains(block.className);
    });
    return match?.type ?? null;
}

export function sanitizeDocument(input: ContentDocument | null | undefined, options: ContentEditorOptions): ContentDocument {
    if (!input || input.type !== 'doc' || !Array.isArray(input.children)) {
        return createEmptyDocument(options);
    }
    const blockMap = new Map(options.blocks.map(item => [item.type, item]));
    const inlineTypes = new Set((options.inlines ?? []).map(item => item.type));
    const children = input.children
        .filter((child): child is ContentBlockNode => !!child && typeof child.type === 'string' && Array.isArray(child.children))
        .map(block => {
            const blockType = blockMap.has(block.type) ? block.type : (options.defaultBlockType ?? options.blocks[0].type);
            const textNodes = block.children
                .filter((child): child is ContentTextNode => child?.type === 'text' && typeof child.text === 'string')
                .map(child => {
                    const marks = (child.marks ?? []).filter(mark => inlineTypes.has(mark));
                    return normalizeTextNode(child.text, marks);
                });
            return {
                type: blockType,
                children: textNodes.length ? textNodes : [{ type: 'text', text: '' }],
            };
        });
    return {
        type: 'doc',
        children: children.length ? children : createEmptyDocument(options).children,
    };
}

export function parseEditorElement(root: HTMLElement, options: ContentEditorOptions): ContentDocument {
    const inlinesByTag = new Map((options.inlines ?? []).map(item => [item.tag.toLowerCase(), item]));
    const blocks: ContentBlockNode[] = [];
    Array.from(root.childNodes).forEach(child => {
        if (child.nodeType === Node.TEXT_NODE) {
            const text = child.textContent ?? '';
            if (!text.trim()) {
                return;
            }
        }
        blocks.push(normalizeBlockNode(child, options, inlinesByTag));
    });
    return sanitizeDocument({ type: 'doc', children: blocks }, options);
}

export function renderDocument(doc: ContentDocument, options: ContentEditorOptions): string {
    const blockMap = new Map(options.blocks.map(item => [item.type, item]));
    const inlineMap = new Map((options.inlines ?? []).map(item => [item.type, item]));
    return doc.children.map(block => {
        const blockDef = blockMap.get(block.type) ?? options.blocks[0];
        const blockElement = document.createElement(blockDef.tag);
        if (blockDef.className) {
            blockElement.className = blockDef.className;
        }
        block.children.forEach(textNode => {
            let currentNode: Node = document.createTextNode(textNode.text);
            (textNode.marks ?? []).forEach(markType => {
                const inlineDef = inlineMap.get(markType);
                if (!inlineDef) {
                    return;
                }
                const inlineElement = document.createElement(inlineDef.tag);
                if (inlineDef.className) {
                    inlineElement.className = inlineDef.className;
                }
                inlineElement.appendChild(currentNode);
                currentNode = inlineElement;
            });
            blockElement.appendChild(currentNode);
        });
        return blockElement.outerHTML;
    }).join('');
}
