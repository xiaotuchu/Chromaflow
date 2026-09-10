export const supportedLocales = ["en", "zh"] as const;

export type Locale = (typeof supportedLocales)[number];

export const defaultLocale: Locale = "en";

export function isSupportedLocale(value: string | null | undefined): value is Locale {
  return supportedLocales.includes((value || "").toLowerCase() as Locale);
}

export function normalizeLocale(value: string | null | undefined): Locale {
  const normalized = (value || "").trim().toLowerCase();

  if (isSupportedLocale(normalized)) {
    return normalized;
  }

  const [language] = normalized.split("-");
  return isSupportedLocale(language) ? language : defaultLocale;
}

export function getLocaleFromPath(pathname: string): Locale {
  const segment = pathname.split("/").filter(Boolean)[0];
  return normalizeLocale(segment);
}

export function stripLocalePrefix(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);

  if (!segments.length) {
    return "/";
  }

  if (isSupportedLocale(segments[0])) {
    const next = segments.slice(1).join("/");
    return next ? `/${next}` : "/";
  }

  return pathname.startsWith("/") ? pathname : `/${pathname}`;
}

export function getLocalizedPath(locale: Locale, pathname: string): string {
  const normalizedPath = stripLocalePrefix(pathname);
  return normalizedPath === "/"
    ? `/${locale}`
    : `/${locale}${normalizedPath.startsWith("/") ? normalizedPath : `/${normalizedPath}`}`;
}

export function detectPreferredLocale(
  savedLocale?: string | null,
  browserLanguage?: string | null
): Locale {
  if (savedLocale) {
    return normalizeLocale(savedLocale);
  }

  return normalizeLocale(browserLanguage);
}
