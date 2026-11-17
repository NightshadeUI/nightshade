import { requiredTones } from '../helpers/commons.js';

const TONE_SELECTOR = /^\.tone-([\w-]+)$/;
const RAMP_PROPERTY = /^--color-([\w-]+)-500$/;
const ROOT_SELECTOR = /^:(root|host)$|^html$/;

export type VariableSource = 'nightshade' | 'specified';

/**
 * What the page's styles define, read from the loaded stylesheets:
 * the tones (one `.tone-*` context each), the color ramps, and the specified
 * custom properties on :root. References render from these, so a documentation
 * site shows its own palette and values without listing them.
 */
export class StylesManager {

    tones: string[];
    ramps: string[] = [];
    loaded = false;
    /** Last write in the `nightshade` layer: Nightshade's own definitions. */
    nightshadeValues: Record<string, string> = {};
    /** Last write on :root: the winning specified value, the system's. */
    specifiedValues: Record<string, string> = {};

    constructor(private configuredTones?: string[]) {
        this.tones = configuredTones ?? requiredTones;
    }

    load() {
        const tones = new Set<string>(requiredTones);
        const ramps = new Set<string>();
        const nightshade: Record<string, string> = {};
        const specified: Record<string, string> = {};
        for (const rule of this.readStyleRules()) {
            const tone = rule.selectorText.match(TONE_SELECTOR)?.[1];
            if (tone) {
                tones.add(tone);
            }
            for (const property of Array.from(rule.style)) {
                const ramp = property.match(RAMP_PROPERTY)?.[1];
                if (ramp) {
                    ramps.add(ramp);
                }
                if (property.startsWith('--') && this.matchesRoot(rule.selectorText)) {
                    const value = rule.style.getPropertyValue(property).trim();
                    if (!value) {
                        continue;
                    }
                    specified[property] = value;
                    if (this.layerOf(rule) === 'nightshade') {
                        nightshade[property] = value;
                    } else if (nightshade[property] == null) {
                        nightshade[property] = value;
                    }
                }
            }
        }
        this.tones = this.configuredTones ?? [...tones];
        this.ramps = [...ramps];
        this.nightshadeValues = nightshade;
        this.specifiedValues = specified;
        this.loaded = true;
    }

    /**
     * The specified value of a custom property on :root.
     * `nightshade` is what the seed defines; `specified` is what this page uses.
     * Falls back to the computed style when the sheets didn't declare it.
     */
    readVariable(name: string, source: VariableSource) {
        const declared = source === 'nightshade' ? this.nightshadeValues[name] : this.specifiedValues[name];
        if (declared) {
            return declared;
        }
        if (!this.loaded) {
            return '';
        }
        return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    }

    private matchesRoot(selector: string) {
        return selector.split(',').some(part => ROOT_SELECTOR.test(part.trim()));
    }

    private layerOf(rule: CSSRule) {
        let current: CSSRule | null = rule.parentRule;
        while (current) {
            if (typeof CSSLayerBlockRule !== 'undefined' && current instanceof CSSLayerBlockRule) {
                return current.name;
            }
            current = current.parentRule;
        }
        return null;
    }

    private readStyleRules() {
        const rules: CSSStyleRule[] = [];
        const visit = (list: CSSRuleList) => {
            for (const rule of Array.from(list)) {
                if (rule instanceof CSSStyleRule) {
                    rules.push(rule);
                } else if ('cssRules' in rule) {
                    visit((rule as CSSGroupingRule).cssRules);
                }
            }
        };
        for (const sheet of Array.from(document.styleSheets)) {
            try {
                visit(sheet.cssRules);
            } catch {
                // A cross-origin sheet (web fonts) can't be read, and defines no tones.
            }
        }
        return rules;
    }

}
