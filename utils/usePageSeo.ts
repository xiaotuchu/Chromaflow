import { useEffect } from "react";
import type { AlternateLink, SeoPayload } from "./seo";

function ensureMeta(attribute: "name" | "property", value: string): HTMLMetaElement {
  let tag = document.head.querySelector<HTMLMetaElement>(
    `meta[${attribute}="${value}"]`
  );

  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attribute, value);
    document.head.appendChild(tag);
  }

  return tag;
}

function ensureCanonicalLink(): HTMLLinkElement {
  let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');

  if (!link) {
    link = document.createElement("link");
    link.rel = "canonical";
    document.head.appendChild(link);
  }

  return link;
}

function syncAlternateLinks(alternates: AlternateLink[]) {
  const managedSelector = 'link[rel="alternate"][data-seo-managed="true"]';

  document.head.querySelectorAll(managedSelector).forEach((node) => node.remove());

  alternates.forEach(({ hrefLang, href }) => {
    const link = document.createElement("link");
    link.rel = "alternate";
    link.hreflang = hrefLang;
    link.href = href;
    link.dataset.seoManaged = "true";
    document.head.appendChild(link);
  });
}

function syncJsonLd(jsonLd: Record<string, unknown>) {
  const scriptId = "seo-json-ld";
  let script = document.getElementById(scriptId) as HTMLScriptElement | null;

  if (!script) {
    script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = scriptId;
    document.head.appendChild(script);
  }

  script.textContent = JSON.stringify(jsonLd);
}

export function usePageSeo(seo: SeoPayload) {
  useEffect(() => {
    document.title = seo.title;

    ensureMeta("name", "description").content = seo.description;
    ensureMeta("name", "robots").content = seo.robots;
    ensureMeta("property", "og:title").content = seo.title;
    ensureMeta("property", "og:description").content = seo.description;
    ensureMeta("property", "og:url").content = seo.canonical;
    ensureMeta("property", "og:type").content = seo.type;
    ensureMeta("name", "twitter:title").content = seo.title;
    ensureMeta("name", "twitter:description").content = seo.description;

    ensureCanonicalLink().href = seo.canonical;
    syncAlternateLinks(seo.alternates);
    syncJsonLd(seo.jsonLd);
  }, [seo]);
}
