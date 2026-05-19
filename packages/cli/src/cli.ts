#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { generatePaletteCss, PaletteSpec } from '@nightshadeui/palette-generator';
import { Command } from 'commander';

const pkgPath = fileURLToPath(new URL('../package.json', import.meta.url));
const { version } = JSON.parse(readFileSync(pkgPath, 'utf8')) as { version: string };

const program = new Command();

program
    .name('nightshade')
    .description('Nightshade UI tools')
    .version(version);

program
    .command('palette')
    .description('Emit OKLCH palette as CSS custom properties')
    .option('-f, --file <path>', 'read JSON palette spec from file (stdin if "-")')
    .option('-o, --output <path>', 'write to file instead of stdout')
    .option('--raw', 'emit property lines only (no :root wrapper)')
    .action((opts: { file?: string; output?: string; raw?: boolean }) => {
        let palette: PaletteSpec = {};
        if (opts.file) {
            const raw =
                opts.file === '-' ?
                    readFileSync(0, 'utf8') :
                    readFileSync(opts.file, 'utf8');
            palette = JSON.parse(raw) as PaletteSpec;
        }
        const css = generatePaletteCss({
            ...palette,
            cssSelector: opts.raw ? false : ':root',
        });
        if (opts.output) {
            writeFileSync(opts.output, css, 'utf8');
        } else {
            process.stdout.write(`${css}\n`);
        }
    });

program.parse();
