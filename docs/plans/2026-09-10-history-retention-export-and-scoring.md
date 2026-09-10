# History Retention, Export, and Scoring Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Keep local practice records reliably, retain the latest 50, export them as CSV, and make color-match scoring more discerning.

**Architecture:** Harden record ID creation so persistence does not depend on the Web Crypto global. Keep storage as the source of truth, expose a pure CSV formatter for reliable export tests, and use a weighted HSV distance with a squared score curve so visible errors carry a stronger penalty.

**Tech Stack:** TypeScript, React 19, Vite, Vitest, browser localStorage and Blob APIs.

---

### Task 1: Storage reliability and retention

**Files:**
- Modify: `src/storage/practiceStorage.ts`
- Modify: `src/storage/practiceStorage.test.ts`

1. Add failing tests for a missing `crypto` global and a 50-record retention limit.
2. Run `npm test -- src/storage/practiceStorage.test.ts` and observe the missing-crypto case fail.
3. Generate a durable ID without assuming Web Crypto exists, then change the limit to 50.
4. Re-run the storage tests.

### Task 2: CSV export

**Files:**
- Create: `src/utils/historyExport.ts`
- Create: `src/utils/historyExport.test.ts`
- Modify: `src/pages/History.tsx`

1. Add failing tests for UTF-8-friendly, escaped CSV rows.
2. Implement the pure CSV formatter and browser download helper.
3. Add a Download records button to the history summary card.
4. Re-run the export and page tests.

### Task 3: Stricter scoring and copy

**Files:**
- Create: `src/utils/colorUtils.test.ts`
- Modify: `src/utils/colorUtils.ts`
- Modify: `src/pages/History.tsx`
- Modify: `src/components/practice/ResultAnalysis.tsx`
- Modify: `src/utils/seo.ts`, `src/i18n/messages.ts`, `src/pages/PrivacyPolicy.tsx`, `src/pages/TermsOfService.tsx`, `README.md`

1. Add failing score-boundary tests for exact, moderate, and opposite-color matches.
2. Replace the arithmetic-mean score with weighted HSV distance and a quadratic penalty.
3. Update all visible and SEO copy from 20 to 50 records.
4. Run the full test suite, typecheck, and production build.
