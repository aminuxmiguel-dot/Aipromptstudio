import { useEffect } from "react";

interface TrackOptions {
  eventType: "page_view" | "tool_generation" | "favorite_saved";
  toolSlug?: string;
  mode?: string;
  sessionId?: string;
}

export function usePageAnalytics(options: TrackOptions): void {
  useEffect(() => {
    const track = async () => {
      try {
        const baseUrl = import.meta.env.BASE_URL.replace(/\/$/, '');
        const endpoint = `${baseUrl}/api/analytics/track`;
        
        await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ...options,
            referrer: document.referrer
          })
        });
      } catch (err) {
        // Swallow errors silently - tracking must never break the page
      }
    };

    track();
  }, [options.eventType, options.toolSlug]);
}
