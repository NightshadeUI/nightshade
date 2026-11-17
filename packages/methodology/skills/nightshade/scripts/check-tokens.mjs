#!/usr/bin/env node
// Nightshade methodology token check: flags CSS that breaks the variable grammar or picks a scheme by hand.
// Ramp steps (`--color-*`) are not flagged: single-tone components may read them,
// and only you know which components are multi-tone.
// Usage: node check-tokens.mjs [root=.]   Exit code 1 when anything is flagged.
// Reads .css, .scss and the <style> blocks of .vue files. Generated `palette.css` files are skipped.
import { readdirSync, readFileSync } from 'node:fs';
import { extname, join, relative } from 'node:path';

const SKIP_DIRS = new Set([
    'node_modules',
    'out',
    'dist',
    'build',
    'coverage',
    'cache',
    '.git',
    '.vitepress',
]);
const EXTENSIONS = new Set(['.css', '.scss', '.vue']);
/** Scale, context and role variables: the tiers that may pick a scheme. */
const TIER_PROPERTY = /^--(color|tone|surface|border|text|shadow|translucency|input|sp|radius|font|gr|vgr|line)-/;
const DECLARATION = /(?<![\w.#&-])(--[\w-]+|[a-z-]+)\s*:\s*([^;{}]*?)\s*(?=[;}])/g;
const LEGACY = new RegExp([
    '--ui-',
    '--sphalf\\b',
    '--sp-x*[sml]\\b',
    '--border-radius\\b',
    '--text-color\\b',
    '--base-color\\b',
    '--overlay-surface\\b',
    '--color-[a-z-]+-text\\b',
].join('|'));
const root = process.argv[2] ?? '.';
const findings = [];

function walk(dir) {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
        const path = join(dir, entry.name);
        if (entry.isDirectory() && !SKIP_DIRS.has(entry.name)) {
            walk(path);
        } else if (entry.isFile() && EXTENSIONS.has(extname(entry.name)) && entry.name !== 'palette.css') {
            checkFile(path);
        }
    }
}

function checkFile(file) {
    const source = readFileSync(file, 'utf8');
    for (const { css, offset } of extractStyles(file, source)) {
        for (const match of css.matchAll(DECLARATION)) {
            const line = source.slice(0, offset + match.index).split('\n').length;
            checkDeclaration(`${relative(root, file)}:${line}`, match[1], match[2]);
        }
    }
}

/** The CSS of a file, with comments blanked out so that offsets still map to lines. */
function extractStyles(file, source) {
    const blank = text => text.replace(/\/\*[\s\S]*?\*\//g, comment => comment.replace(/[^\n]/g, ' '));
    if (!file.endsWith('.vue')) {
        return [{
            css: blank(source),
            offset: 0,
        }];
    }
    return [...source.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map(match => ({
        css: blank(match[1]),
        offset: match.index + match[0].indexOf('>') + 1,
    }));
}

function checkDeclaration(at, property, value) {
    const isTier = TIER_PROPERTY.test(property);
    if (!isTier && /light-dark\(/.test(value)) {
        report(at, `${property} picks a scheme with light-dark(): ramps and roles already do`);
    }
    if (/var\(--[A-Z][\w-]*\s*,/.test(value)) {
        report(at, `${property} reads a component variable with a fallback: default it on the root class instead`);
    }
    const suffixed = [property, ...[...value.matchAll(/var\((--[\w-]+)/g)].map(match => match[1])]
        .filter(name => /^--[\w-]+-(color|surface)$/.test(name));
    for (const name of new Set(suffixed)) {
        report(at, `${name}: no -color or -surface suffix (a role name holds a color, a property name a full value)`);
    }
    if (/^--(text|surface|border|shadow|fill|line)$/.test(property)) {
        report(at, `${property} is a one-word role: role names are two words or more`);
    }
    if (LEGACY.test(property) || LEGACY.test(value)) {
        report(at, `${property} uses a 2.x variable: see the migration reference`);
    }
    if (property !== 'letter-spacing' && /(?:^|[^\w-])(\d*\.?\d+)(r?em)\b/.test(value)) {
        report(at, `${property} uses em/rem: only letter-spacing may; font sizes are --font-size-*, every other length a token`);
    }
    if (/calc\([^)]*-\s*1px\b/.test(value)) {
        report(at, `${property} subtracts 1px: don't. box-sizing: border-box already includes the border on a sized box`);
    }
}

function report(at, message) {
    findings.push(`${at}: ${message}`);
}

walk(root);
for (const finding of findings) {
    console.info(finding);
}
console.info(findings.length ? `\n${findings.length} finding(s)` : 'No token drift found.');
process.exit(findings.length ? 1 : 0);
