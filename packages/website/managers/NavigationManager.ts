export interface NavPage {
    title: string;
    link: string;
}

export interface NavSection {
    id: string;
    title: string;
    link: string;
    pages: NavPage[];
}

/**
 * The site tree, in model order, and where the reader is in it.
 */
export class NavigationManager {

    path = '/';

    readonly sections: NavSection[] = [
        {
            id: 'philosophy',
            title: 'Philosophy',
            link: '/philosophy/',
            pages: [
                {
                    title: 'The seed',
                    link: '/philosophy/',
                },
                {
                    title: 'The model',
                    link: '/philosophy/layers',
                },
                {
                    title: 'Growing your own',
                    link: '/philosophy/ownership',
                },
            ],
        },
        {
            id: 'styles',
            title: 'Styles',
            link: '/styles/',
            pages: [
                {
                    title: 'Tokens',
                    link: '/styles/',
                },
                {
                    title: 'Color',
                    link: '/styles/color',
                },
                {
                    title: 'Tones and roles',
                    link: '/styles/tones',
                },
                {
                    title: 'Space and sizing',
                    link: '/styles/sizing',
                },
                {
                    title: 'Typography',
                    link: '/styles/typography',
                },
                {
                    title: 'Depth',
                    link: '/styles/depth',
                },
                {
                    title: 'Base and utilities',
                    link: '/styles/base',
                },
                {
                    title: 'Palette and CLI',
                    link: '/styles/palette',
                },
            ],
        },
        {
            id: 'components',
            title: 'Components',
            link: '/components/',
            pages: [
                {
                    title: 'Control grammar',
                    link: '/components/',
                },
                {
                    title: 'Button',
                    link: '/components/button',
                },
                {
                    title: 'Chip',
                    link: '/components/chip',
                },
                {
                    title: 'Text inputs',
                    link: '/components/inputs',
                },
                {
                    title: 'Toggle and checkbox',
                    link: '/components/toggle',
                },
                {
                    title: 'Slider',
                    link: '/components/slider',
                },
                {
                    title: 'Layout',
                    link: '/components/layout',
                },
                {
                    title: 'Overlays and menus',
                    link: '/components/overlays',
                },
            ],
        },
        {
            id: 'opt-ins',
            title: 'Opt-ins',
            link: '/opt-ins/',
            pages: [
                {
                    title: 'Overview',
                    link: '/opt-ins/',
                },
                {
                    title: 'Canvas',
                    link: '/opt-ins/canvas',
                },
                {
                    title: 'Particle system',
                    link: '/opt-ins/particles',
                },
                {
                    title: 'Scroller',
                    link: '/opt-ins/scroller',
                },
                {
                    title: 'Content editor',
                    link: '/opt-ins/content-editor',
                },
            ],
        },
        {
            id: 'release',
            title: 'Release',
            link: '/migration',
            pages: [
                {
                    title: 'Migrating to 3.0',
                    link: '/migration',
                },
            ],
        },
    ];

    /** The header links: the docs a reader starts from, the variable reference and the studio. */
    readonly topLinks: NavPage[] = [
        {
            title: 'Philosophy',
            link: '/philosophy/',
        },
        {
            title: 'Styles',
            link: '/styles/',
        },
        {
            title: 'Variables',
            link: '/variables',
        },
        {
            title: 'Components',
            link: '/components/',
        },
        {
            title: 'Palette Studio',
            link: '/studio',
        },
    ];

    get pages() {
        return this.sections.flatMap(section => section.pages);
    }

    get currentSection() {
        return this.sections.find(section => section.pages.some(page => this.isCurrent(page.link)));
    }

    get currentIndex() {
        return this.pages.findIndex(page => this.isCurrent(page.link));
    }

    get prevPage() {
        return this.pages[this.currentIndex - 1];
    }

    get nextPage() {
        return this.currentIndex < 0 ? undefined : this.pages[this.currentIndex + 1];
    }

    setPath(href: string) {
        const path = new URL(href, 'http://localhost').pathname;
        this.path = path.replace(/\.html$/, '').replace(/\/index$/, '/');
    }

    isCurrent(link: string) {
        return this.path === link;
    }

    isInSection(section: NavSection) {
        return this.currentSection?.id === section.id;
    }

    isActiveTopLink(link: NavPage) {
        return this.path === link.link || this.currentSection?.link === link.link;
    }

}
