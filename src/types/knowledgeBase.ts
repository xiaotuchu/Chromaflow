export type ArticleCategory = 'fundamentals' | 'expression' | 'harmony';
export type ArticleDifficulty = 'beginner' | 'intermediate' | 'advanced';

export type KnowledgeBaseArticle = {
  slug: string;
  title: string;
  summary: string;
  category: ArticleCategory;
  difficulty: ArticleDifficulty;
  readingTime: string;
  tags: string[];
  content: string;
  aiGenerated?: boolean;
};
