import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';

import { readExampleNames, VARIABLE_GROUPS } from '../catalog/variables.js';

const STYLESHEETS = join(dirname(fileURLToPath(import.meta.url)), '../../../stylesheets');

describe('variable catalog', () => {

    const declared = readDeclaredVariables(readImportedFiles('index.css'));
    const generated = readDeclaredVariables(['palette.css']);
    const cataloged = readCatalogedVariables();

    it('lists every variable the styles declare', () => {
        const missing = [...declared].filter(name => !cataloged.has(name));
        assert.deepEqual(missing, [], 'declared in @nightshadeui/stylesheets, missing from the catalog');
    });

    it('lists only variables the styles or the generated palette declare', () => {
        const unknown = [...cataloged].filter(name => !declared.has(name) && !generated.has(name));
        assert.deepEqual(unknown, [], 'in the catalog, declared nowhere');
    });

    it('keeps examples inside the family they illustrate', () => {
        const stray: string[] = [];
        for (const group of VARIABLE_GROUPS) {
            for (const entry of group.entries) {
                const known = new Set(entry.members ?? [entry.name]);
                for (const name of readExampleNames(entry)) {
                    if (!known.has(name)) {
                        stray.push(`${entry.name} example ${name}`);
                    }
                }
            }
        }
        assert.deepEqual(stray, []);
    });

});

/** The files `index.css` imports, in order: the styles without the palette. */
function readImportedFiles(entry: string) {
    const source = readFileSync(join(STYLESHEETS, entry), 'utf8');
    return [...source.matchAll(/@import '\.\/([^']+)'/g)].map(match => match[1]!);
}

function readDeclaredVariables(files: string[]) {
    const names = new Set<string>();
    for (const file of files) {
        const source = readFileSync(join(STYLESHEETS, file), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
        for (const match of source.matchAll(/(--[\w-]+)\s*:/g)) {
            names.add(match[1]!);
        }
    }
    return names;
}

/** Every variable the catalog names: an entry's own name unless it's a pattern, and its members. */
function readCatalogedVariables() {
    const names = new Set<string>();
    for (const group of VARIABLE_GROUPS) {
        for (const entry of group.entries) {
            if (!entry.name.includes('<')) {
                names.add(entry.name);
            }
            for (const member of entry.members ?? []) {
                names.add(member);
            }
        }
    }
    return names;
}
