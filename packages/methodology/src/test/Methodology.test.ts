import assert from 'node:assert/strict';
import { existsSync, lstatSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, it } from 'node:test';

import { Methodology } from '../main/Methodology.js';

const POINTER = '[Nightshade] Follow .agents/nightshade/RULES.md';

describe('Methodology', () => {

    let root: string;

    const read = (name: string) => readFileSync(join(root, name), 'utf8');

    beforeEach(() => {
        root = mkdtempSync(join(tmpdir(), 'nightshade-methodology-'));
    });

    afterEach(() => {
        rmSync(root, {
            recursive: true,
            force: true,
        });
    });

    it('installs rules, links, skill and the pointer into an empty project', () => {
        const methodology = new Methodology(root);
        assert.equal(methodology.check().length, 7);
        methodology.sync();
        assert.ok(existsSync(join(root, '.agents/skills/nightshade/SKILL.md')));
        assert.ok(existsSync(join(root, '.claude/skills/nightshade/SKILL.md')));
        assert.match(read('.agents/nightshade/RULES.md'), /# Nightshade methodology/);
        assert.ok(lstatSync(join(root, '.claude/rules/nightshade.md')).isSymbolicLink());
        assert.equal(read('.claude/rules/nightshade.md'), read('.agents/nightshade/RULES.md'));
        assert.equal(read('.cursor/rules/nightshade.mdc'), methodology.renderCursorRule());
        assert.equal(read('AGENTS.md'), `${POINTER}\n`);
        assert.equal(read('CLAUDE.md'), '@AGENTS.md\n');
        assert.deepEqual(methodology.check(), []);
        assert.deepEqual(methodology.sync(), []);
    });

    it('appends the pointer to AGENTS.md and changes nothing else', () => {
        const methodology = new Methodology(root);
        writeFileSync(join(root, 'AGENTS.md'), '# Project\n\nLocal notes.\n\n');
        methodology.sync();
        assert.equal(read('AGENTS.md'), `# Project\n\nLocal notes.\n\n${POINTER}\n`);
    });

    it('keeps the pointer where the project moved it, and next to other pointers', () => {
        const methodology = new Methodology(root);
        writeFileSync(join(root, 'AGENTS.md'), '# Project\n\n[Nightshade] Follow old/path.md\n\nMore notes.\n');
        assert.ok(methodology.check().some(issue => issue.path === 'AGENTS.md'));
        methodology.sync();
        assert.equal(read('AGENTS.md'), `# Project\n\n${POINTER}\n\nMore notes.\n`);
        writeFileSync(join(root, 'AGENTS.md'), '# Project\n\n[Flexent] Follow .agents/flexent/RULES.md\n');
        methodology.sync();
        assert.equal(read('AGENTS.md'), `# Project\n\n[Flexent] Follow .agents/flexent/RULES.md\n${POINTER}\n`);
    });

    it('removes the managed block earlier versions wrote', () => {
        const methodology = new Methodology(root);
        writeFileSync(join(root, 'AGENTS.md'), [
            '<!-- nightshade-methodology:begin -->',
            '# Nightshade methodology',
            '<!-- nightshade-methodology:end -->',
            '',
            '## Project',
            '',
            'Local notes.',
            '',
        ].join('\n'));
        methodology.sync();
        assert.equal(read('AGENTS.md'), `## Project\n\nLocal notes.\n\n${POINTER}\n`);
    });

    it('refreshes stale rules and skill, and leaves an existing CLAUDE.md alone', () => {
        const methodology = new Methodology(root);
        writeFileSync(join(root, 'CLAUDE.md'), 'Project notes\n');
        methodology.sync();
        writeFileSync(join(root, '.agents/skills/nightshade/extra.md'), 'stale');
        writeFileSync(join(root, '.agents/nightshade/RULES.md'), 'old rules');
        const paths = methodology.check().map(issue => issue.path);
        assert.ok(paths.includes('.agents/skills/nightshade'));
        assert.ok(paths.includes('.agents/nightshade/RULES.md'));
        methodology.sync();
        assert.equal(existsSync(join(root, '.agents/skills/nightshade/extra.md')), false);
        assert.match(read('.claude/rules/nightshade.md'), /# Nightshade methodology/);
        assert.equal(read('CLAUDE.md'), 'Project notes\n');
        assert.equal(methodology.check()[0].message, 'does not import @AGENTS.md');
    });

    it('ships a Cursor rule generated from the rules', () => {
        const methodology = new Methodology(root);
        const shipped = readFileSync(join(methodology.packageDir, 'rules/nightshade.mdc'), 'utf8');
        assert.equal(shipped, methodology.renderCursorRule());
    });

});
