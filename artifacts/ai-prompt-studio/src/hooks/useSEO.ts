import { useEffect, useRef } from "react";

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  ogType?: "website" | "article";
  twitterCard?: "summary" | "summary_large_image";
  structuredData?: Record<string, unknown>;
}

export function useSEO(props: SEOProps): void {
  const {
    title,
    description,
    canonical,
    ogTitle = props.title,
    ogDescription = props.description,
    ogImage,
    ogUrl,
    ogType = "website",
    twitterCard = "summary_large_image",
    structuredData,
  } = props;

  const addedTags = useRef<HTMLElement[]>([]);

  useEffect(() => {
    document.title = title;

    const setMeta = (key: "name" | "property", keyValue: string, content: string) => {
      let el = document.querySelector<HTMLMetaElement>(`meta[${key}="${keyValue}"]`);
      if (el) {
        el.setAttribute("content", content);
      } else {
        el = document.createElement("meta");
        el.setAttribute(key, keyValue);
        el.setAttribute("content", content);
        document.head.appendChild(el);
        addedTags.current.push(el);
      }
    };

    const setLink = (rel: string, href: string) => {
      let el = document.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
      if (el) {
        el.setAttribute("href", href);
      } else {
        el = document.createElement("link");
        el.setAttribute("rel", rel);
        el.setAttribute("href", href);
        document.head.appendChild(el);
        addedTags.current.push(el);
      }
    };

    // Core
    setMeta("name", "description", description);

    // Open Graph
    setMeta("property", "og:title", ogTitle);
    setMeta("property", "og:description", ogDescription);
    setMeta("property", "og:type", ogType);
    setMeta("property", "og:site_name", "AI Prompt Studio");
    if (ogImage) setMeta("property", "og:image", ogImage);
    if (ogUrl) setMeta("property", "og:url", ogUrl);

    // Twitter / X Cards
    setMeta("name", "twitter:card", twitterCard);
    setMeta("name", "twitter:title", ogTitle);
    setMeta("name", "twitter:description", ogDescription);
    if (ogImage) setMeta("name", "twitter:image", ogImage);

    // Canonical
    if (canonical) setLink("canonical", canonical);

    // JSON-LD structured data
    const existingScript = document.head.querySelector("script[data-seo-ld]");
    if (structuredData) {
      if (existingScript) {
        existingScript.textContent = JSON.stringify(structuredData);
      } else {
        const script = document.createElement("script");
        script.type = "application/ld+json";
        script.setAttribute("data-seo-ld", "true");
        script.textContent = JSON.stringify(structuredData);
        document.head.appendChild(script);
        addedTags.current.push(script);
      }
    } else if (existingScript) {
      existingScript.remove();
    }

    return () => {
      document.title = "AI Prompt Studio";
      addedTags.current.forEach((el) => el.parentNode?.removeChild(el));
      addedTags.current = [];
    };
  }, [title, description, canonical, ogTitle, ogDescription, ogImage, ogUrl, ogType, twitterCard, structuredData]);
}
