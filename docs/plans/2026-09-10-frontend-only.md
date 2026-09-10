# Chromaflow2 Implementation Plan

**Goal:** Preserve Chromaflow color practice as an independent frontend-only application.
**Architecture:** React UI with browser-local history (latest 20 records); no accounts, PHP, database, SMTP, or API keys. Hash routing works on static hosts without rewrite rules.
**Tech Stack:** TypeScript, React 19, Vite 7, Tailwind CSS 3, Vitest.

1. Copy frontend sources and dependency lockfile into chromaflow2; exclude environments, build output and dependencies.
2. Test local history retention, reloads, malformed data, unavailable storage, filtering, clearing and tab updates. Implement services/practiceStorage.ts.
3. Remove authentication and remote services. Adapt App.tsx, Navbar.tsx, Practice.tsx and profile.tsx. Reuse existing matching, analysis, history cards and filters.
4. Keep bilingual home, knowledge articles and local image tools. Replace contact form with email link. Align privacy and terms with actual local behavior.
5. Remove server HTML substitutions, analytics and API-key injection. Use hash routes and relative build assets. Document static deployment and local data limits.
6. Run npm test, npm run typecheck and npm run build. Smoke-test practice, history persistence, mobile navigation and knowledge articles in a browser if available.
