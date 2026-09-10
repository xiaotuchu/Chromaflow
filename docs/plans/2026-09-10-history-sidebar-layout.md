# History Sidebar Layout Implementation Plan

> **For Codex:** REQUIRED SUB-SKILL: Use `test-driven-development` to implement this plan task-by-task.

**Goal:** Place the practice-history summary in the desktop right sidebar above Filters while preserving history actions and responsive access.

**Architecture:** `History.tsx` owns the existing summary content and composes it inside the sidebar. The left column remains solely responsible for rendered history records; the sidebar stacks the summary and filters at the `lg` breakpoint, then flows in a useful reading order on smaller screens.

**Tech Stack:** React 19, TypeScript, Tailwind CSS, Vitest.

---

### Task 1: Capture the intended hierarchy

**Files:**
- Modify: `tests/integration/localPages.test.tsx`
- Test: `tests/integration/localPages.test.tsx`

1. Add a failing assertion for the summary sidebar landmark and its ordering before filters.
2. Run the focused test and confirm it fails because the current summary is a full-width top section.

### Task 2: Compose the responsive sidebar

**Files:**
- Modify: `src/pages/History.tsx`

1. Move the current title, explanatory text, counts and actions into a semantic summary card inside the right column.
2. Stack the summary above `SidebarFilters` on large screens.
3. Use a single-column mobile order of summary, filters and history. Keep all existing filter callbacks and clear-history error feedback.

### Task 3: Validate presentation behavior

**Files:**
- Test: `tests/integration/localPages.test.tsx`

1. Run the focused test and confirm it passes.
2. Run `npm test`, `npm run typecheck` and `npm run build`.
