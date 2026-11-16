import { readStored, writeStored } from '@nightshadeui/util/src';

const STORAGE_KEY = 'nightshade-look';

export type PlaygroundOption = keyof PlaygroundManager['options'];

export interface PlaygroundOptionInfo {
    key: PlaygroundOption;
    label: string;
}

/** Options that change how controls look. They apply site-wide. */
export const LOOK_OPTIONS: PlaygroundOptionInfo[] = [
    {
        key: 'flat',
        label: 'Flat',
    },
    {
        key: 'round',
        label: 'Round',
    },
    {
        key: 'outline',
        label: 'Outline',
    },
    {
        key: 'translucent',
        label: 'Translucent',
    },
];

/** Options that force a state. They apply inside demos only. */
export const STATE_OPTIONS: PlaygroundOptionInfo[] = [
    {
        key: 'disabled',
        label: 'Disabled',
    },
    {
        key: 'forceHover',
        label: 'Hover',
    },
    {
        key: 'forceFocus',
        label: 'Focus',
    },
    {
        key: 'forceActive',
        label: 'Active',
    },
];

/**
 * Control options, applied as `$nightshade.defaults`.
 * The site provides the look options to every component and remembers them; demos add the state options.
 */
export class PlaygroundManager {

    options = this.createDefaultOptions();
    lookOptions = LOOK_OPTIONS;
    stateOptions = STATE_OPTIONS;

    get modified() {
        return JSON.stringify(this.options) !== JSON.stringify(this.createDefaultOptions());
    }

    get lookDefaults() {
        return this.pickOptions(LOOK_OPTIONS);
    }

    load() {
        const stored = readStored<unknown>(STORAGE_KEY, {});
        const look = (stored && typeof stored === 'object' ? stored : {}) as Record<string, unknown>;
        for (const { key } of LOOK_OPTIONS) {
            const value = look[key];
            if (typeof value === 'boolean') {
                this.options[key] = value;
            }
        }
    }

    toggleOption(key: PlaygroundOption) {
        this.options[key] = !this.options[key];
        this.saveLook();
    }

    clearOption(key: PlaygroundOption) {
        if (this.options[key]) {
            this.toggleOption(key);
        }
    }

    reset() {
        this.options = this.createDefaultOptions();
        this.saveLook();
    }

    private saveLook() {
        writeStored(STORAGE_KEY, this.lookDefaults);
    }

    private pickOptions(infos: PlaygroundOptionInfo[]) {
        return Object.fromEntries(infos.map(({ key }) => [key, this.options[key]]));
    }

    private createDefaultOptions() {
        return {
            round: false,
            flat: true,
            outline: false,
            translucent: false,
            disabled: false,
            forceFocus: false,
            forceHover: false,
            forceActive: false,
        };
    }

}
