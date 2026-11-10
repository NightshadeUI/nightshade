#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import { relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { Methodology } from '../out/main/index.js';

const USAGE = `Usage: nightshade-methodology <command> [dir]

Commands:
  sync [root]        Install or refresh the rules and skill in a project (default: current directory)
  check [root]       Exit with 1 if the installed rules or skill are missing or stale
  tokens [dir]       Report CSS that breaks the variable grammar or picks a scheme by hand`;

const [command, target = '.'] = process.argv.slice(2);
const root = resolve(target);
const methodology = new Methodology(root);

if (command === 'sync') {
    const touched = methodology.sync();
    const lines = touched.map(path => `  updated ${relative(root, path)}`);
    console.info(lines.length ? lines.join('\n') : 'Nightshade methodology is up to date.');
} else if (command === 'check') {
    const issues = methodology.check();
    for (const issue of issues) {
        console.error(`${issue.path}: ${issue.message}`);
    }
    const summary = issues.length ?
        'Run `npx nightshade-methodology sync` to fix.' :
        'Nightshade methodology is up to date.';
    console.info(summary);
    process.exitCode = issues.length ? 1 : 0;
} else if (command === 'tokens') {
    const script = fileURLToPath(new URL('../skills/nightshade/scripts/check-tokens.mjs', import.meta.url));
    process.exitCode = spawnSync(process.execPath, [script, resolve(target)], { stdio: 'inherit' }).status ?? 1;
} else {
    console.info(USAGE);
    process.exitCode = command ? 1 : 0;
}
