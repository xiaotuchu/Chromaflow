import colorAnatomyEn from "@/content/en/art-color-anatomy.md?raw";
import lightVsPigmentEn from "@/content/en/light-vs-pigment.md?raw";
import temperDepthEn from "@/content/en/color-temperature-depth.md?raw";
import psychMoodEn from "@/content/en/color-psychology-mood.md?raw";
import classicHarmoniesEn from "@/content/en/classic-color-harmonies.md?raw";
import masteringNeutralsEn from "@/content/en/mastering-neutrals.md?raw";
import colorAnatomyZh from "@/content/zh/art-color-anatomy.md?raw";
import lightVsPigmentZh from "@/content/zh/light-vs-pigment.md?raw";
import temperDepthZh from "@/content/zh/color-temperature-depth.md?raw";
import psychMoodZh from "@/content/zh/color-psychology-mood.md?raw";
import classicHarmoniesZh from "@/content/zh/classic-color-harmonies.md?raw";
import masteringNeutralsZh from "@/content/zh/mastering-neutrals.md?raw";
import type { Locale } from "@/i18n/config";
import type { ArticleCategory, ArticleDifficulty, KnowledgeBaseArticle } from "@/types/knowledgeBase";

export type { ArticleCategory, ArticleDifficulty, KnowledgeBaseArticle } from "@/types/knowledgeBase";

const parseArticle = (
  slug: string,
  category: ArticleCategory,
  difficulty: ArticleDifficulty,
  readingTime: string,
  tags: string[],
  rawMd: string
): KnowledgeBaseArticle => {
  const titleMatch = rawMd.match(/title:\s*["'](.+?)["']/);
  const summaryMatch = rawMd.match(/summary:\s*["'](.+?)["']/);
  
  const title = titleMatch ? titleMatch[1] : "";
  const summary = summaryMatch ? summaryMatch[1] : "";
  
  // Remove frontmatter completely so it doesn't render in the UI
  const content = rawMd.replace(/^---[\s\S]*?---\n*/, "");

  return {
    slug,
    title,
    summary,
    category,
    difficulty,
    readingTime,
    tags,
    content,
    aiGenerated: true,
  };
};

const articleDefinitions = [
  {
    slug: "art-color-anatomy",
    category: "fundamentals" as const,
    difficulty: "beginner" as const,
    readingTime: { en: "3-5 mins", zh: "3-5 分钟" },
    tags: {
      en: ["Fundamentals", "Cognition", "Structure"],
      zh: ["基础", "认知", "结构"],
    },
    raw: { en: colorAnatomyEn, zh: colorAnatomyZh },
  },
  {
    slug: "light-vs-pigment",
    category: "fundamentals" as const,
    difficulty: "intermediate" as const,
    readingTime: { en: "5-6 mins", zh: "5-6 分钟" },
    tags: {
      en: ["Mixing", "Mediums", "Pitfalls"],
      zh: ["调色", "媒介", "误区"],
    },
    raw: { en: lightVsPigmentEn, zh: lightVsPigmentZh },
  },
  {
    slug: "color-temperature-depth",
    category: "expression" as const,
    difficulty: "advanced" as const,
    readingTime: { en: "4-5 mins", zh: "4-5 分钟" },
    tags: {
      en: ["Atmospheric", "Volume", "Temperature"],
      zh: ["氛围", "体积", "冷暖"],
    },
    raw: { en: temperDepthEn, zh: temperDepthZh },
  },
  {
    slug: "color-psychology-mood",
    category: "expression" as const,
    difficulty: "intermediate" as const,
    readingTime: { en: "4-6 mins", zh: "4-6 分钟" },
    tags: {
      en: ["Storytelling", "Mood Board", "Psychology"],
      zh: ["叙事", "情绪板", "心理学"],
    },
    raw: { en: psychMoodEn, zh: psychMoodZh },
  },
  {
    slug: "classic-color-harmonies",
    category: "harmony" as const,
    difficulty: "beginner" as const,
    readingTime: { en: "5-6 mins", zh: "5-6 分钟" },
    tags: {
      en: ["Formulas", "Color Wheel", "Proportions"],
      zh: ["公式", "色轮", "比例"],
    },
    raw: { en: classicHarmoniesEn, zh: classicHarmoniesZh },
  },
  {
    slug: "mastering-neutrals",
    category: "harmony" as const,
    difficulty: "intermediate" as const,
    readingTime: { en: "4-5 mins", zh: "4-5 分钟" },
    tags: {
      en: ["Neutrals", "Visual Rest", "Restraint"],
      zh: ["中性色", "视觉呼吸", "克制"],
    },
    raw: { en: masteringNeutralsEn, zh: masteringNeutralsZh },
  },
];

export function getKnowledgeBaseArticles(locale: Locale): KnowledgeBaseArticle[] {
  return articleDefinitions.map((definition) =>
    parseArticle(
      definition.slug,
      definition.category,
      definition.difficulty,
      definition.readingTime[locale],
      definition.tags[locale],
      definition.raw[locale]
    )
  );
}

export function getKnowledgeBaseArticle(
  locale: Locale,
  slug?: string
): KnowledgeBaseArticle | undefined {
  const articles = getKnowledgeBaseArticles(locale);
  return slug
    ? articles.find((item) => item.slug === slug)
    : articles[0];
}

export const knowledgeBaseArticles: KnowledgeBaseArticle[] =
  getKnowledgeBaseArticles("en");

