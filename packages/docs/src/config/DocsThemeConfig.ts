import { VariableGroup } from '../catalog/variables.js';

export interface DocsPage {
    title: string;
    link: string;
}

export interface DocsSection {
    id: string;
    title: string;
    link: string;
    pages: DocsPage[];
}

export interface DocsBrand {
    /** The name in the header and the footer. */
    name: string;
    /** A logo shown before the name, from the site's public directory (`/logo.svg`). */
    logo?: string;
    /** A short version badge next to the name. */
    version?: string;
}

export interface DocsSocialLink {
    title: string;
    /** A Font Awesome class, such as `fab fa-github`. */
    icon: string;
    link: string;
}

export interface DocsFooter {
    note?: string;
    legal?: string;
}

/**
 * What a documentation site tells the theme: its brand, its navigation tree and its own additions.
 * Set it as `themeConfig` in `.vitepress/config.ts`.
 */
export interface DocsThemeConfig {
    brand: DocsBrand;
    /** The sidebar and footer tree, in reading order. */
    sections: DocsSection[];
    /** The header links. */
    topLinks: DocsPage[];
    social?: DocsSocialLink[];
    footer?: DocsFooter;
    /** The tones to show in tone references. Omitted, they are read from the page's `.tone-*` rules. */
    tones?: string[];
    /** The system's own public tokens, listed in the variable reference next to Nightshade's. */
    variableGroups?: VariableGroup[];
    /**
     * Whom the variable reference speaks to. The default, `usage`, is a system's docs for the apps built on it:
     * the public tokens, their specified values, and when to read them. Nightshade's own site sets
     * `foundation`: authors of a system, with how far each variable is meant to be overridden.
     */
    variableView?: 'foundation' | 'usage';
}
