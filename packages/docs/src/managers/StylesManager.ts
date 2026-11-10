import { requiredTones } from '../helpers/commons.js';

const TONE_SELECTOR = /^\.tone-([\w-]+)$/;
const RAMP_PROPERTY = /^--color-([\w-]+)-500$/;

/**
 * What the page's styles define, read from the loaded stylesheets:
 * the tones (one `.tone-*` context each) and the color ramps. References render from these,
 * so a documentation site shows its own palette without listing it.
 */
export class StylesManager {

    tones: string[];
    ramps: string[] = [];

    constructor(private configuredTones?: string[]) {
        this.tones = configuredTones ?? requiredTones;
    }

    load() {
        const tones = new Set<string>(requiredTones);
        const ramps = new Set<string>();
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
            }
        }
        this.tones = this.configuredTones ?? [...tones];
        this.ramps = [...ramps];
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
