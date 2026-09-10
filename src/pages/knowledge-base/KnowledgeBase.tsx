import React from "react";
import { useParams } from "react-router-dom";
import KnowledgeBaseLayout from "./KnowledgeBaseLayout";
import { getKnowledgeBaseArticle } from "@/data/knowledgeBaseData";
import { useLocale } from "../../i18n/LocaleProvider";
import { createArticleSeo, createPageSeo } from "../../utils/seo";
import { usePageSeo } from "@/hooks/usePageSeo";

const KnowledgeBase: React.FC = () => {
  const { locale } = useLocale();
  const { slug } = useParams<{ slug?: string }>();
  const article = getKnowledgeBaseArticle(locale, slug);
  const seo =
    slug && article
      ? createArticleSeo(locale, article)
      : slug
        ? createPageSeo(locale, "knowledgeBase", {
            title:
              locale === "zh"
                ? "文章未找到 | Chromaflow 知识库"
                : "Article Not Found | Chromaflow Knowledge Base",
            description:
              locale === "zh"
                ? "你访问的知识库文章不存在。请返回 Chromaflow 知识库浏览其他内容。"
                : "The requested knowledge base article could not be found. Browse other Chromaflow knowledge base content instead.",
            path: `/knowledge-base/${slug}`,
            robots: "noindex,follow,max-image-preview:large",
          })
        : createPageSeo(locale, "knowledgeBase");

  usePageSeo(seo);

  return <KnowledgeBaseLayout article={article} />;
};

export default KnowledgeBase;
