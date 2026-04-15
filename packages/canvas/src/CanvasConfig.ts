export interface CanvasConfigSpec {
    autoCenter?: boolean;
}

export class CanvasConfig {

    autoCenter = true;

    set(config: Partial<CanvasConfigSpec>) {
        Object.assign(this, config);
    }

}
