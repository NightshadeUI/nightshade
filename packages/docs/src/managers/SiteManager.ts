import { DocsPage, DocsSection, DocsThemeConfig } from '../config/DocsThemeConfig.js';

/**
 * The site as its config describes it, and where the reader is in it.
 */
export class SiteManager {

    path = '/';

    constructor(
        readonly config: DocsThemeConfig,
        readonly base = '/',
    ) {}

    get brand() {
        return this.config.brand;
    }

    get sections() {
        return this.config.sections;
    }

    get topLinks() {
        return this.config.topLinks;
    }

    get social() {
        return this.config.social ?? [];
    }

    get footer() {
        return this.config.footer ?? {};
    }

    get pages() {
        return this.sections.flatMap(section => section.pages);
    }

    get currentSection() {
        return this.sections.find(section => {
            return this.isCurrent(section.link) || section.pages.some(page => this.isCurrent(page.link));
        });
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
        const pathname = new URL(href, 'http://localhost').pathname;
        this.path = this.normalizePath(this.stripBase(pathname));
    }

    isCurrent(link: string) {
        return this.path === this.normalizePath(link);
    }

    isInSection(section: DocsSection) {
        return this.currentSection?.id === section.id;
    }

    /** The top link to this page, or else the one to its section. */
    isActiveTopLink(link: DocsPage) {
        const exact = this.topLinks.some(topLink => this.isCurrent(topLink.link));
        return exact ? this.isCurrent(link.link) : this.currentSection?.link === link.link;
    }

    /** `/nightshade/` and `/nightshade/styles` are `/` and `/styles` when the site's base is `/nightshade/`. */
    private stripBase(pathname: string) {
        const root = this.base.slice(0, -1);
        if (pathname === root) {
            return '/';
        }
        return pathname.startsWith(this.base) ? pathname.slice(root.length) : pathname;
    }

    /** `/styles/index.html`, `/styles/index`, `/styles/` and `/styles` are one page. */
    private normalizePath(path: string) {
        return path.replace(/\.html$/, '').replace(/\/index$/, '/').replace(/(.)\/$/, '$1');
    }

}
