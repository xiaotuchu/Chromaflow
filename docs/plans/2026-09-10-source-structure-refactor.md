# Source Structure Refactor Implementation Plan

> **For Codex:** REQUIRED SUB-SKILL: Use `test-driven-development` while making the refactor.

**Goal:** Move Chromaflow2 application code into `src/` and align directories with their actual responsibilities without changing user-visible behavior or browser-stored data.

**Architecture:** Keep the Vite project root, HTML entry, build configuration, HashRouter paths and localStorage keys unchanged. Relocate React source, content, types and tests to the documented structure; update only imports and configuration paths needed for the new layout.

**Tech Stack:** TypeScript, React 19, Vite 7, Tailwind CSS 3, Vitest.

---

### Task 1: Protect the public contracts

**Files:**
- Modify: `tests/integration/localPages.test.tsx`
- Test: `tests/integration/localPages.test.tsx`

1. Add assertions for the public `/#/:locale/profile` history path and the two unchanged localStorage keys.
2. Run the test before moving code; it fails because the contract check does not yet exist.
3. Keep the existing behavior and make the test pass after the moved imports resolve.

### Task 2: Centralize application source

**Files:**
- Move: root application entry, pages, components, i18n, content, utilities, routes, storage and configuration into `src/`.
- Modify: `index.html`, `tailwind.config.cjs`, `tsconfig.json`, `vite.config.ts`, `vitest.config.mjs`.

1. Move source as a structural change only.
2. Point `index.html` to `/src/main.tsx`; import global CSS from `src/main.tsx`.
3. Restrict Tailwind scanning to `index.html` and `src/**/*.{ts,tsx}`.
4. Make `@/*` consistently resolve to `src/*` in TypeScript, Vite and Vitest.

### Task 3: Clarify domain responsibilities

**Files:**
- Move/Rename: `pages/profile.tsx` to `src/pages/History.tsx`; `components/profile/` to `src/components/history/`.
- Create: `src/types/color.ts`, `src/types/history.ts`, `src/types/knowledgeBase.ts`.
- Move: `services/practiceStorage.ts` to `src/storage/practiceStorage.ts`; `services/appConfig.ts` to `src/config/app.ts`; `utils/usePageSeo.ts` to `src/hooks/usePageSeo.ts`; knowledge base data to `src/data/knowledgeBaseData.ts`.

1. Extract only the existing shared types and retain component-local Props locally.
2. Preserve the current `profile` route key and URL to avoid breaking links.
3. Preserve `chromaflow2.history.v1`, `chromaflow2.locale`, record fields and 20-record limit.

### Task 4: Place tests and declarations deliberately

**Files:**
- Move: storage and utility tests beside their modules; HTML test to `tests/indexHtmlSeo.test.ts`; page integration test to `tests/integration/localPages.test.tsx`.
- Move/Merge: environment declarations to `src/vite-env.d.ts`.

1. Remove the unused API-base environment declaration.
2. Update test imports and HTML file lookup paths.
3. Keep the Markdown raw-import and ColorThief declarations.

### Task 5: Validate the migrated project

**Files:**
- Modify: `README.md` only if its source path references are inaccurate.

1. Run `npm test`, `npm run typecheck` and `npm run build`.
2. Search the project root for obsolete application directories and duplicate declarations.
3. Confirm the production build includes CSS, favicon and the ColorThief chunk.
