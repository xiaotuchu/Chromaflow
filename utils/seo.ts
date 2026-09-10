import type { Locale } from "../i18n/config";
import { getLocalizedPath } from "../i18n/config";
import type { KnowledgeBaseArticle } from "../pages/knowledge-base/knowledgeBaseData";

export const SITE_URL = typeof window === "undefined" ? "https://chromaflow.xiaotu.asia" : `${window.location.origin}${window.location.pathname}#`;

const hrefLangByLocale: Record<Locale, string> = {
  en: "en",
  zh: "zh-Hans",
};

type PageSeoKey =
  | "home"
  | "practice"
  | "privacy"
  | "terms"
  | "contact"
  | "knowledgeBase";

type SeoDefinition = {
  title: string;
  description: string;
  path: string;
};

export type AlternateLink = {
  hrefLang: string;
  href: string;
};

export type SeoPayload = {
  title: string;
  description: string;
  canonical: string;
  robots: string;
  type: "website" | "article";
  alternates: AlternateLink[];
  jsonLd: Record<string, unknown>;
};

const pageSeoDefinitions: Record<Locale, Record<PageSeoKey, SeoDefinition>> = {
  en: {
    home: {
      title: "Color Practice for Beginners | Chromaflow",
      description:
        "Practice color matching, hue, saturation, and value with Chromaflow. Built for beginner painters, drawing learners, designers, and anyone training color judgment.",
      path: "/",
    },
    practice: {
      title: "Color Matching Practice and HSV Exercise | Chromaflow",
      description:
        "Use interactive sliders to practice color matching, hue, saturation, and value. A color training tool for beginner painters, drawing practice, and visual learning.",
      path: "/practice",
    },
    privacy: {
      title: "Privacy Policy | Chromaflow",
      description:
        "Learn how Chromaflow keeps the latest 20 practice records in your browser and processes images locally.",
      path: "/privacy",
    },
    terms: {
      title: "Terms of Service | Chromaflow",
      description:
        "Read about Chromaflow's free color exercises, browser storage limits, and local image processing.",
      path: "/terms",
    },
    contact: {
      title: "Contact Chromaflow",
      description:
        "Get in touch with Chromaflow for product questions, technical support, and feedback from the creative community.",
      path: "/contact",
    },
    knowledgeBase: {
      title: "Color Theory Knowledge Base | Chromaflow",
      description:
        "Explore Chromaflow's bilingual color theory knowledge base covering hue, value, harmony, temperature, mood, and practical design decisions.",
      path: "/knowledge-base",
    },
  },
  zh: {
    home: {
      title: "HSV 色彩练习与配色训练 | Chromaflow",
      description:
        "用 Chromaflow 进行 HSV 色彩练习，系统训练色相、饱和度与明度匹配能力，适合设计师、插画师与所有想提升色彩判断的人。",
      path: "/",
    },
    practice: {
      title: "HSV 色彩练习工具 | 色相饱和度明度匹配 | Chromaflow",
      description:
        "通过交互式 HSV 滑杆练习色相、饱和度和明度匹配，提升配色判断、色彩观察与色彩练习效率。",
      path: "/practice",
    },
    privacy: {
      title: "隐私政策 | Chromaflow",
      description:
        "了解 Chromaflow 如何在浏览器本地保存最近 20 条练习记录，以及如何在本机处理图片。",
      path: "/privacy",
    },
    terms: {
      title: "服务条款 | Chromaflow",
      description:
        "了解 Chromaflow 的免费色彩练习、本地记录限制和图片使用说明。",
      path: "/terms",
    },
    contact: {
      title: "联系 Chromaflow",
      description:
        "联系 Chromaflow 获取产品咨询、技术支持，或提交你对色彩训练体验的反馈。",
      path: "/contact",
    },
    knowledgeBase: {
      title: "色彩理论知识库 | Chromaflow",
      description:
        "浏览 Chromaflow 的双语色彩理论知识库，涵盖色相、明度、和谐、冷暖、情绪与设计实践。",
      path: "/knowledge-base",
    },
  },
};

function toAbsoluteUrl(path: string): string {
  return `${SITE_URL}${path}`;
}

function toLocalizedAbsoluteUrl(locale: Locale, path: string): string {
  return toAbsoluteUrl(getLocalizedPath(locale, path));
}

export function buildAlternateLinks(path: string): AlternateLink[] {
  return [
    {
      hrefLang: hrefLangByLocale.en,
      href: toLocalizedAbsoluteUrl("en", path),
    },
    {
      hrefLang: hrefLangByLocale.zh,
      href: toLocalizedAbsoluteUrl("zh", path),
    },
    {
      hrefLang: "x-default",
      href: toLocalizedAbsoluteUrl("en", path),
    },
  ];
}

type PageSeoOverride = Partial<Pick<SeoPayload, "robots">> & {
  title?: string;
  description?: string;
  path?: string;
};

function getPageTopics(page: PageSeoKey): string[] | undefined {
  if (page === "home" || page === "practice") {
    return [
      "color practice",
      "HSV training",
      "hue saturation value",
      "color matching exercise",
    ];
  }

  return undefined;
}

export function createPageSeo(
  locale: Locale,
  page: PageSeoKey,
  override?: PageSeoOverride
): SeoPayload {
  const definition = pageSeoDefinitions[locale][page];
  const localizedPath = override?.path ?? definition.path;
  const title = override?.title ?? definition.title;
  const description = override?.description ?? definition.description;

  return {
    title,
    description,
    canonical: toLocalizedAbsoluteUrl(locale, localizedPath),
    robots: override?.robots ?? "index,follow,max-image-preview:large",
    type: "website",
    alternates: buildAlternateLinks(localizedPath),
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: title,
      description,
      url: toLocalizedAbsoluteUrl(locale, localizedPath),
      inLanguage: locale,
      about: getPageTopics(page),
      isPartOf: {
        "@type": "WebSite",
        name: "Chromaflow",
        url: SITE_URL,
      },
    },
  };
}

export function createArticleSeo(
  locale: Locale,
  article: KnowledgeBaseArticle
): SeoPayload {
  const articlePath = `/knowledge-base/${article.slug}`;
  const title =
    locale === "zh"
      ? `${article.title} | Chromaflow 知识库`
      : `${article.title} | Chromaflow Knowledge Base`;
  const description = article.summary;

  return {
    title,
    description,
    canonical: toLocalizedAbsoluteUrl(locale, articlePath),
    robots: "index,follow,max-image-preview:large",
    type: "article",
    alternates: buildAlternateLinks(articlePath),
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: article.title,
      description,
      url: toLocalizedAbsoluteUrl(locale, articlePath),
      inLanguage: locale,
      author: {
        "@type": "Organization",
        name: "Chromaflow",
      },
      publisher: {
        "@type": "Organization",
        name: "Chromaflow",
      },
    },
  };
}
