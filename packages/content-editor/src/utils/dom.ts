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

export function hasEqualAttributes(left: Element, right: Element): boolean {
    if (left.tagName !== right.tagName) {
        return false;
    }
    if (left.attributes.length !== right.attributes.length) {
        return false;
    }
    for (const { name, value } of [...left.attributes]) {
        if (right.getAttribute(name) !== value) {
            return false;
        }
    }
    return true;
}
