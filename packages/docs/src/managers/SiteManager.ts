import { DocsPage, DocsSection, DocsThemeConfig } from '../config/DocsThemeConfig.js';

/**
 * The site as its config describes it, and where the reader is in it.
 */
export class SiteManager {

    path = '/';

    constructor(readonly config: DocsThemeConfig) {}

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

    isInSection(section: DocsSection) {
        return this.currentSection?.id === section.id;
    }

    /** The top link to this page, or else the one to its section. */
    isActiveTopLink(link: DocsPage) {
        const exact = this.topLinks.some(topLink => topLink.link === this.path);
        return exact ? this.path === link.link : this.currentSection?.link === link.link;
    }

}
