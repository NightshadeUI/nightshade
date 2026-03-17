# AGENTS Guide: @nightshadeui/gallery

## Purpose

`@nightshadeui/gallery` is the documentation/showcase app for Nightshade components and token behavior. It demonstrates patterns; it is not a production component package.

## Existing Architecture

- Tooling: VitePress (`vitepress dev/build/preview`).
- Main page: `pages/index.md` composes section components.
- Sections: `pages/Section*.vue`.
- Shared demo constants: `utils/commons.ts` (`uiTokens`, `paletteScale`, `inputSizes`).
- Small helper utilities in `utils/`.

## Conventions

- Section components use Vue Options API.
- Demo components rely on injected `commonOptions` toggles for shared knobs (`round`, `flat`, `outline`, `disabled`, `force*`).
- Reuse shared arrays from `utils/commons.ts` instead of duplicating option lists.
- Keep examples focused on Nightshade primitives and token-driven styles.
- Import local TS modules with `.js` extension in SFC scripts (current project convention under NodeNext).

## Adding/Updating Showcase Content

- Add a new section as `pages/SectionX.vue`.
- Register it in `pages/index.md` (`<script setup>` import + template placement).
- Keep section structure consistent:
  - headline
  - optional control row
  - themed demo content (`DualTheme`, `HGroup`, `VGroup`, etc.)
- Prefer concise examples that highlight one convention at a time.

## Do / Don’t

- Do keep gallery code easy to scan and teaching-oriented.
- Do demonstrate token classes (`ui-*`, `input-size-*`) and component props.
- Don’t introduce app-specific business logic.
- Don’t duplicate component behavior that should live in `@nightshadeui/core`.

## Useful Commands

- Dev: `npm run dev -w @nightshadeui/gallery`
- Build: `npm run build -w @nightshadeui/gallery`
