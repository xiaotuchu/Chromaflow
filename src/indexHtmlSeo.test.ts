import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const indexHtml = readFileSync(resolve(__dirname, "../index.html"), "utf8");

describe("frontend index.html SEO", () => {
  it("includes core metadata for search and sharing", () => {
    expect(indexHtml).toContain('name="description"');
    expect(indexHtml).toContain('property="og:title"');
    expect(indexHtml).toContain('name="twitter:card"');
    // Route metadata is populated by usePageSeo, without PHP substitutions.
    expect(indexHtml).not.toContain('__REQUEST_');
    expect(indexHtml).not.toContain('googletagmanager.com');
    expect(indexHtml).not.toContain('type="importmap"');
    expect(indexHtml).toContain('<html lang="en">');
  });
});
