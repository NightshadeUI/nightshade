export interface CanvasConfigSpec {
    autoCenter?: boolean;
    allowMultiSelect?: boolean;
}

export class CanvasConfig {

    autoCenter = true;
    allowMultiSelect = true;

    set(config: Partial<CanvasConfigSpec>) {
        Object.assign(this, config);
    }

}
