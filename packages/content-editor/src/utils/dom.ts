export function unwrap(el: Element): void {
    const parent = el.parentNode;
    if (!parent) {
        return;
    }
    while (el.firstChild) {
        parent.insertBefore(el.firstChild, el);
    }
    parent.removeChild(el);
}

export function removeNode(node: Node): void {
    const parent = node.parentNode;
    if (!parent) {
        return;
    }
    parent.removeChild(node);
}
