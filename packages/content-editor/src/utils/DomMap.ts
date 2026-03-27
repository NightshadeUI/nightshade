export class DomMap {

    private indexByElement = new WeakMap<Element, number>();
    private elements: HTMLElement[] = [];

    rebuild(root: HTMLElement): void {
        this.elements = Array.from(root.childNodes).filter(
            node => node.nodeType === Node.ELEMENT_NODE,
        ) as HTMLElement[];

        this.indexByElement = new WeakMap<Element, number>();
        for (let i = 0; i < this.elements.length; i++) {
            this.indexByElement.set(this.elements[i], i);
        }
    }

    size(): number {
        return this.elements.length;
    }

    getBlockIndex(el: Element): number | null {
        return this.indexByElement.get(el) ?? null;
    }

    getElementByBlock(index: number): HTMLElement | null {
        return this.elements[index] ?? null;
    }

}
