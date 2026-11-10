// Regenerates rules/nightshade.mdc (the Cursor plugin's always-on rule) from AGENTS.md.

import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { Methodology } from '../out/main/index.js';

const packageDir = fileURLToPath(new URL('..', import.meta.url));
const methodology = new Methodology(packageDir, packageDir);
writeFileSync(new URL('../rules/nightshade.mdc', import.meta.url), methodology.renderCursorRule());
