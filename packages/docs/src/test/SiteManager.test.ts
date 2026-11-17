import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { DocsThemeConfig } from '../config/DocsThemeConfig.js';
import { SiteManager } from '../managers/SiteManager.js';

const config: DocsThemeConfig = {
    brand: { name: 'Acme' },
    topLinks: [
        {
            title: 'Styles',
            link: '/styles/',
        },
    ],
    sections: [
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
            ],
        },
    ],
};

describe('SiteManager', () => {

    it('matches config links at the domain root', () => {
        const site = new SiteManager(config);
        site.setPath('/styles/color.html');
        assert.equal(site.path, '/styles/color');
        assert.equal(site.isCurrent('/styles/color'), true);
    });

    it('treats a path under the public base as the same page as the config link', () => {
        const site = new SiteManager(config, '/nightshade/');
        site.setPath('/nightshade/styles/color');
        assert.equal(site.path, '/styles/color');
        assert.equal(site.isCurrent('/styles/color'), true);
        assert.equal(site.currentSection?.id, 'styles');
    });

    it('treats the public base itself as home', () => {
        const site = new SiteManager(config, '/nightshade/');
        site.setPath('/nightshade/');
        assert.equal(site.path, '/');
        site.setPath('/nightshade');
        assert.equal(site.path, '/');
    });

});
