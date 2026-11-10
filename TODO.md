# TODO

Nothing open.

- Automate the coverage check between `packages/website/catalog/variables.ts` and the stylesheets (every declared variable is cataloged, nothing undeclared is listed), e.g. as a website test.
- Neutral `Chip` active state is invisible: in `base`, `--tone-fill` and `--tone-tint` are both step 100. Pass `activeTone` for now; consider a neutral fill that differs from the tint.
