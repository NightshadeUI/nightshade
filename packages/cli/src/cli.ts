#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { generatePaletteCss, PaletteSpec, PaletteSpecSchema } from '@nightshadeui/palette-generator';
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
    .description('Emit OKLCH color ramps and one tone context per ramp')
    .option('-f, --file <path>', 'read JSON palette spec from file (stdin if "-")')
    .option('-o, --output <path>', 'write to file instead of stdout')
    .option('-s, --selector <selector>', 'selector that holds the ramps', ':root')
    .option('--raw', 'emit bare ramp declarations, without a selector or tone contexts')
    .action((opts: { file?: string; output?: string; selector: string; raw?: boolean }) => {
        let palette: PaletteSpec = {};
        if (opts.file) {
            const raw =
                opts.file === '-' ?
                    readFileSync(0, 'utf8') :
                    readFileSync(opts.file, 'utf8');
            palette = PaletteSpecSchema.decode(JSON.parse(raw));
        }
        const css = generatePaletteCss(palette, opts.raw ? null : opts.selector);
        if (opts.output) {
            writeFileSync(opts.output, `${css}\n`, 'utf8');
        } else {
            process.stdout.write(`${css}\n`);
        }
    });

program.parse();
