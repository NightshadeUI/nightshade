import { dependency } from 'mesh-ioc';

import { CanvasEvents } from './CanvasEvents.js';

export class CanvasSelection {

    selectedIds = new Set<string>();

    private events = dependency(this, CanvasEvents);

    get size() {
        return this.selectedIds.size;
    }

    getSelectedIds() {
        return [...this.selectedIds];
    }

    getFirst() {
        return [...this.selectedIds][0] ?? null;
    }

    isSelected(id: string) {
        return this.selectedIds.has(id);
    }

    isSingleSelected(id: string) {
        return this.selectedIds.size === 1 && this.selectedIds.has(id);
    }

    setSelectedIds(ids: Iterable<string>) {
        const previousIds = new Set(this.selectedIds);
        this.selectedIds = new Set(ids);
        this.notifySelectionChanged(previousIds);
    }

    selectSingle(id: string) {
        if (this.isSingleSelected(id)) {
            return;
        }
        const previousIds = new Set(this.selectedIds);
        this.selectedIds.clear();
        this.selectedIds.add(id);
        this.notifySelectionChanged(previousIds);
    }

    addToSelection(...ids: string[]) {
        const previousIds = new Set(this.selectedIds);
        for (const id of ids) {
            this.selectedIds.add(id);
        }
        this.notifySelectionChanged(previousIds);
    }

    removeFromSelection(...ids: string[]) {
        const previousIds = new Set(this.selectedIds);
        for (const id of ids) {
            this.selectedIds.delete(id);
        }
        this.notifySelectionChanged(previousIds);
    }

    toggleSelection(id: string) {
        if (this.isSelected(id)) {
            this.removeFromSelection(id);
            return;
        }
        this.addToSelection(id);
    }

    deselectAll() {
        if (this.selectedIds.size === 0) {
            return;
        }
        const previousIds = new Set(this.selectedIds);
        this.selectedIds.clear();
        this.notifySelectionChanged(previousIds);
    }

    private notifySelectionChanged(previousIds: Set<string>) {
        if (previousIds.size === this.selectedIds.size) {
            let hasChanges = false;
            for (const id of previousIds) {
                if (!this.selectedIds.has(id)) {
                    hasChanges = true;
                    break;
                }
            }
            if (!hasChanges) {
                return;
            }
        }
        this.events.selectionChanged.emit(this.getSelectedIds());
    }

    setSelected(id: string, isSelected: boolean) {
        if (isSelected) {
            this.addToSelection(id);
            return;
        }
        this.removeFromSelection(id);
    }

}
