import { useEffect, useRef } from "react";

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogType?: "website" | "article";
  twitterCard?: "summary" | "summary_large_image";
}

export function useSEO(props: SEOProps): void {
  const {
    title,
    description,
    canonical,
    ogTitle = props.title,
    ogDescription = props.description,
    ogType = "website",
    twitterCard = "summary_large_image",
  } = props;

  const addedTags = useRef<HTMLElement[]>([]);

  useEffect(() => {
    // Set document title
    document.title = title;

    const setTag = (tagType: 'meta' | 'link', attrs: Record<string, string>) => {
      // Find existing
      let existing: HTMLElement | null = null;
      if (tagType === 'meta') {
        const nameAttr = attrs.name ? `name="${attrs.name}"` : `property="${attrs.property}"`;
        existing = document.querySelector(`meta[${nameAttr}]`);
      } else if (tagType === 'link') {
        existing = document.querySelector(`link[rel="${attrs.rel}"]`);
      }

      if (existing) {
        // Update
        if (tagType === 'meta') {
          existing.setAttribute('content', attrs.content);
        } else if (tagType === 'link') {
          existing.setAttribute('href', attrs.href);
        }
      } else {
        // Create
        const el = document.createElement(tagType);
        Object.entries(attrs).forEach(([key, value]) => {
          el.setAttribute(key, value);
        });
        document.head.appendChild(el);
        addedTags.current.push(el);
      }
    };

    setTag('meta', { name: 'description', content: description });
    setTag('meta', { property: 'og:title', content: ogTitle });
    setTag('meta', { property: 'og:description', content: ogDescription });
    setTag('meta', { property: 'og:type', content: ogType });
    setTag('meta', { property: 'og:site_name', content: 'AI Prompt Studio' });
    setTag('meta', { name: 'twitter:card', content: twitterCard });
    setTag('meta', { name: 'twitter:title', content: ogTitle });
    setTag('meta', { name: 'twitter:description', content: ogDescription });

    if (canonical) {
      setTag('link', { rel: 'canonical', href: canonical });
    }

    return () => {
      document.title = "AI Prompt Studio";
      addedTags.current.forEach(el => {
        if (el.parentNode) {
          el.parentNode.removeChild(el);
        }
      });
      addedTags.current = [];
    };
  }, [title, description, canonical, ogTitle, ogDescription, ogType, twitterCard]);
}
