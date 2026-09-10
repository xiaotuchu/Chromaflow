import { getLocalizedPath, type Locale } from "./i18n/config";

export const routes = {
  home: "/",
  practice: "/practice",
  profile: "/profile",
  privacy: "/privacy",
  terms: "/terms",
  contact: "/contact",
  knowledgeBase: "/knowledge-base",
  knowledgeBaseArticle: "/knowledge-base/:slug",
} as const;

type RouteKey = keyof typeof routes;
type RouteParams = Record<string, string | number>;

export function getRoutePath(
  locale: Locale,
  route: RouteKey,
  params?: RouteParams
): string {
  let path: string = routes[route];

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      path = path.replace(`:${key}`, String(value));
    }
  }

  return getLocalizedPath(locale, path);
}
