import { describe, expect, it } from "vitest";
import { getKnowledgeBaseArticle } from "../data/knowledgeBaseData";
import {
  buildAlternateLinks,
  createArticleSeo,
  createPageSeo,
} from "./seo";

describe("seo helpers", () => {
  it("builds localized alternates for a page path", () => {
    expect(buildAlternateLinks("/privacy")).toEqual([
      { hrefLang: "en", href: "https://chromaflow.xiaotu.asia/en/privacy" },
      { hrefLang: "zh-Hans", href: "https://chromaflow.xiaotu.asia/zh/privacy" },
      {
        hrefLang: "x-default",
        href: "https://chromaflow.xiaotu.asia/en/privacy",
      },
    ]);
  });

  it("creates localized metadata for standard pages", () => {
    const seo = createPageSeo("en", "home");

    expect(seo.title).toBe(
      "Color Practice for Beginners | Chromaflow"
    );
    expect(seo.canonical).toBe("https://chromaflow.xiaotu.asia/en");
    expect(seo.description).toContain("color matching");
  });

  it("creates article metadata from knowledge base content", () => {
    const article = getKnowledgeBaseArticle("en", "art-color-anatomy");

    expect(article).toBeDefined();

    const seo = createArticleSeo("en", article!);

    expect(seo.title).toContain(article!.title);
    expect(seo.canonical).toBe(
      "https://chromaflow.xiaotu.asia/en/knowledge-base/art-color-anatomy"
    );
    expect(seo.alternates[1].href).toBe(
      "https://chromaflow.xiaotu.asia/zh/knowledge-base/art-color-anatomy"
    );
  });
});
