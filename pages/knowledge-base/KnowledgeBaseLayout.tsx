import React, { useEffect, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Link } from "react-router-dom";
import { marked } from "marked";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";
import { getKnowledgeBaseArticles } from "./knowledgeBaseData";
import { getRoutePath } from "../../routes";
import type { KnowledgeBaseArticle } from "./knowledgeBaseData";
import { useLocale } from "../../i18n/LocaleProvider";

type KnowledgeBaseLayoutProps = {
  article?: KnowledgeBaseArticle;
};

const KnowledgeBaseLayout: React.FC<KnowledgeBaseLayoutProps> = ({
  article,
}) => {
  const { locale, messages } = useLocale();
  const [renderedContent, setRenderedContent] = useState<string>("");
  const [isMobileArticleListOpen, setIsMobileArticleListOpen] = useState(false);
  const articles = getKnowledgeBaseArticles(locale);

  useEffect(() => {
    if (article) {
      const parseContent = async () => {
        try {
          const content = await marked.parse(article.content);
          setRenderedContent(content);
        } catch (error) {
          console.error("Markdown parsing failed:", error);
        }
      };
      parseContent();
    }
  }, [article]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <main className="flex-grow pt-28 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
            <aside className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm h-fit lg:sticky lg:top-28">
              <div className="flex items-center justify-between gap-3">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
                  {messages.knowledgeBase.articleList}
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setIsMobileArticleListOpen((currentOpen) => !currentOpen)
                  }
                  className="lg:hidden inline-flex items-center gap-1 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600"
                  aria-expanded={isMobileArticleListOpen}
                >
                  {isMobileArticleListOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
              </div>
              <nav
                className={`flex flex-col gap-2 transition-all duration-200 lg:mt-4 ${
                  isMobileArticleListOpen
                    ? "max-h-[70vh] overflow-y-auto pt-4"
                    : "max-h-0 overflow-hidden opacity-0 pointer-events-none"
                } lg:max-h-none lg:overflow-visible lg:opacity-100 lg:pointer-events-auto`}
              >
                {articles.map((item, index) => {
                  const isActive = item.slug === article?.slug;
                  return (
                    <Link
                      key={item.slug}
                      to={getRoutePath(locale, "knowledgeBaseArticle", {
                        slug: item.slug,
                      })}
                      className={`rounded-xl px-3 py-3 text-sm transition-colors ${
                        isActive
                          ? "bg-indigo-50 text-indigo-700 font-semibold"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      <div className="font-semibold">
                        {index + 1}. {item.title}
                      </div>
                      <div className="text-xs text-slate-400 mt-1">
                        {item.readingTime}
                      </div>
                    </Link>
                  );
                })}
              </nav>
            </aside>

            <section className="bg-white border border-slate-100 rounded-2xl p-8 sm:p-12 shadow-sm">
              {article ? (
                <>
                  <div className="flex flex-wrap gap-3 text-xs text-slate-500 items-center mb-6">
                    <span className="px-2 py-1 bg-slate-100 rounded-full font-medium">
                      {article.readingTime}
                    </span>
                    {article.tags.map((tag) => (
                      <span
                        key={`${article.slug}-${tag}`}
                        className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded-full font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                    {article.aiGenerated && (
                      <span className="ml-auto px-2 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-md flex items-center gap-1 font-medium shadow-sm">
                        <svg
                          className="w-3.5 h-3.5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M21.928 11.607c-.202-.488-.635-.605-.928-.633V8c0-1.103-.897-2-2-2h-6V4.61c.305-.274.5-.668.5-1.11a1.5 1.5 0 0 0-3 0c0 .442.195.836.5 1.11V6H5c-1.103 0-2 .897-2 2v2.997l-.082.006A1 1 0 0 0 2 12v2a1 1 0 0 0 1 1h.005l.046.002L3 18v2c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2v-5l.004-.002h.101a1 1 0 0 0 1-1v-2a1.002 1.002 0 0 0-.177-.393zM19 18H5v-4h14v4zM5 8h14l.001 4H5V8z" />
                        </svg>
                        {messages.knowledgeBase.aiGenerated}
                      </span>
                    )}
                  </div>

                  <div className="pb-8 mb-10 border-b border-slate-200/80">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-[1.3] tracking-tight">
                      {article.title}
                    </h2>
                    <div className="mt-6 border-l-4 border-indigo-500 pl-5 py-1">
                      <p className="text-lg text-slate-600 leading-relaxed font-medium">
                        {article.summary}
                      </p>
                    </div>
                  </div>

                  <div className="kb-markdown prose prose-slate prose-lg max-w-none prose-headings:font-bold prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6 prose-p:leading-relaxed prose-a:text-indigo-600">
                    {renderedContent.split("<h2").map((section, index) => (
                      <React.Fragment key={index}>
                        {index > 0 && <hr className="my-8 border-slate-200" />}
                        <div
                          dangerouslySetInnerHTML={{
                            __html: index === 0 ? section : `<h2${section}`,
                          }}
                        />
                      </React.Fragment>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-10">
                  <h2 className="text-2xl font-bold text-slate-900">
                    {messages.knowledgeBase.articleNotFound}
                  </h2>
                  <p className="text-slate-600 mt-3">
                    {messages.knowledgeBase.articleNotFoundDescription}
                  </p>
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default KnowledgeBaseLayout;
