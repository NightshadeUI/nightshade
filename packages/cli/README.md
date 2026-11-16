# @nightshadeui/cli

`nightshade palette` turns a palette spec into `palette.css`: one scheme-aware OKLCH ramp and one `.tone-<name>` context per ramp.

```bash
npm i -D @nightshadeui/cli
npx nightshade palette -f palette.json -o src/palette.css
```

| Option | Does |
|--------|------|
| `-f, --file <path>` | read the spec from a file, or from stdin with `-` |
| `-o, --output <path>` | write to a file instead of stdout |
| `-s, --selector <selector>` | the selector that holds the ramps; `:root` by default |
| `--raw` | emit bare ramp declarations, without a selector or tone contexts |

Without `-f`, it prints the starter palette. The spec must keep the `base`, `primary` and `secondary` ramps. Needs Node 22.12 or later.
