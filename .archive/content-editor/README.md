# Content editor (archived)

`@nightshadeui/content-editor`: a block editor over a JSON document, with `ContentEditor` (the controller) and a Vue component bound to `v-model`. It was a prototype and never published.

- `package/`: the package as it was in 3.2.0.
- `website/`: its demo view and docs page.

To revive it, move `package/` back to `packages/content-editor`, add it to the root `package.json` dependencies and the website, and restore the page and its `themeConfig` link.
