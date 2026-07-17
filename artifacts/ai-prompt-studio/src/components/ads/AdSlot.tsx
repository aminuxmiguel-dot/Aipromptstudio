import { useEffect, useRef } from "react";

type AdFormat = "auto" | "rectangle" | "leaderboard" | "banner" | "vertical";

interface AdSlotProps {
  slotId: string;
  format?: AdFormat;
  className?: string;
  /** Set to true for responsive ads that stretch to their container */
  responsive?: boolean;
}

const PUBLISHER_ID = import.meta.env.VITE_ADSENSE_PUBLISHER_ID as string | undefined;
const IS_PRODUCTION = import.meta.env.PROD;

const FORMAT_SIZES: Record<AdFormat, { width: number; height: number }> = {
  auto:        { width: 0,   height: 0   },
  rectangle:   { width: 300, height: 250 },
  leaderboard: { width: 728, height: 90  },
  banner:      { width: 468, height: 60  },
  vertical:    { width: 160, height: 600 },
};

/** Lazily injects the AdSense script once per page load */
function injectAdSenseScript(pubId: string) {
  const scriptId = "adsense-script";
  if (document.getElementById(scriptId)) return;
  const script = document.createElement("script");
  script.id = scriptId;
  script.async = true;
  script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${pubId}`;
  script.crossOrigin = "anonymous";
  document.head.appendChild(script);
}

/**
 * Renders a Google AdSense ad slot when VITE_ADSENSE_PUBLISHER_ID is configured.
 *
 * - In production without a publisher ID: renders nothing.
 * - In development without a publisher ID: renders a styled placeholder.
 * - With a publisher ID: renders the real AdSense <ins> element.
 */
export function AdSlot({ slotId, format = "auto", className = "", responsive = true }: AdSlotProps) {
  const insRef = useRef<HTMLModElement>(null);
  const size = FORMAT_SIZES[format];

  useEffect(() => {
    if (!PUBLISHER_ID) return;
    injectAdSenseScript(PUBLISHER_ID);
    try {
      const adsbygoogle = ((window as Window & { adsbygoogle?: unknown[] }).adsbygoogle ??= []);
      adsbygoogle.push({});
    } catch {
      // AdSense push can fail silently; never break the page
    }
  }, [slotId]);

  // No publisher ID in production → render nothing
  if (!PUBLISHER_ID && IS_PRODUCTION) return null;

  // No publisher ID in development → render a styled placeholder
  if (!PUBLISHER_ID) {
    const placeholderW = size.width > 0 ? size.width : "100%";
    const placeholderH = size.height > 0 ? size.height : 90;
    return (
      <div
        className={`flex items-center justify-center rounded-lg border border-dashed border-border/50 bg-muted/20 text-muted-foreground text-xs font-medium select-none ${className}`}
        style={{ width: placeholderW, height: placeholderH, minHeight: 60 }}
        aria-hidden="true"
      >
        <span className="opacity-50">
          Ad Slot — {slotId} ({format})
        </span>
      </div>
    );
  }

  // Real AdSense slot
  return (
    <ins
      ref={insRef}
      className={`adsbygoogle ${className}`}
      style={{
        display: "block",
        ...(responsive
          ? {}
          : size.width > 0
            ? { width: size.width, height: size.height }
            : {}),
      }}
      data-ad-client={PUBLISHER_ID}
      data-ad-slot={slotId}
      data-ad-format={responsive ? "auto" : undefined}
      data-full-width-responsive={responsive ? "true" : undefined}
    />
  );
}
