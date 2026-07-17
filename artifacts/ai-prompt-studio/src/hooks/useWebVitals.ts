import { useEffect } from "react";

type MetricName = "CLS" | "LCP" | "FCP" | "TTFB" | "INP";

interface LayoutShiftEntry extends PerformanceEntry {
  value: number;
  hadRecentInput: boolean;
}

interface LargestContentfulPaintEntry extends PerformanceEntry {
  renderTime: number;
  loadTime: number;
}

interface PerformanceEventTimingEntry extends PerformanceEntry {
  processingStart: number;
  processingEnd: number;
  interactionId?: number;
}

interface NavigationTimingEntry extends PerformanceEntry {
  responseStart: number;
  requestStart: number;
}

function sendVital(name: MetricName, value: number) {
  try {
    const baseUrl = import.meta.env.BASE_URL.replace(/\/$/, "");
    fetch(`${baseUrl}/api/analytics/track`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventType: "web_vital", toolSlug: name, mode: String(Math.round(value)) }),
      keepalive: true,
    }).catch(() => {
      // Swallow — vitals must never break the page
    });
  } catch {
    // Swallow
  }
}

function measureCLS() {
  if (!("PerformanceObserver" in window)) return;
  let clsValue = 0;
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      const e = entry as LayoutShiftEntry;
      if (!e.hadRecentInput) {
        clsValue += e.value;
      }
    }
  });
  try {
    observer.observe({ type: "layout-shift", buffered: true });
    window.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") {
        sendVital("CLS", clsValue * 1000); // scaled to ms for consistency
        observer.disconnect();
      }
    }, { once: true });
  } catch {
    observer.disconnect();
  }
}

function measureLCP() {
  if (!("PerformanceObserver" in window)) return;
  const observer = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    const last = entries[entries.length - 1] as LargestContentfulPaintEntry;
    if (last) {
      const value = last.renderTime || last.loadTime;
      sendVital("LCP", value);
    }
  });
  try {
    observer.observe({ type: "largest-contentful-paint", buffered: true });
  } catch {
    observer.disconnect();
  }
}

function measureFCP() {
  if (!("PerformanceObserver" in window)) return;
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.name === "first-contentful-paint") {
        sendVital("FCP", entry.startTime);
        observer.disconnect();
        break;
      }
    }
  });
  try {
    observer.observe({ type: "paint", buffered: true });
  } catch {
    observer.disconnect();
  }
}

function measureTTFB() {
  if (!("PerformanceObserver" in window)) return;
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.entryType === "navigation") {
        const nav = entry as NavigationTimingEntry;
        sendVital("TTFB", nav.responseStart - nav.requestStart);
        observer.disconnect();
        break;
      }
    }
  });
  try {
    observer.observe({ type: "navigation", buffered: true });
  } catch {
    observer.disconnect();
  }
}

function measureINP() {
  if (!("PerformanceObserver" in window)) return;
  let maxINP = 0;
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      const e = entry as PerformanceEventTimingEntry;
      const duration = e.processingEnd - e.processingStart;
      if (duration > maxINP) maxINP = duration;
    }
  });
  try {
    observer.observe({ type: "event", durationThreshold: 16, buffered: true });
    window.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden" && maxINP > 0) {
        sendVital("INP", maxINP);
        observer.disconnect();
      }
    }, { once: true });
  } catch {
    observer.disconnect();
  }
}

/**
 * Measures Core Web Vitals (CLS, LCP, FCP, TTFB, INP) using the browser
 * PerformanceObserver API and forwards them to /api/analytics/track.
 * Safe to call on every page — each metric is reported at most once per session.
 */
export function useWebVitals(): void {
  useEffect(() => {
    measureCLS();
    measureLCP();
    measureFCP();
    measureTTFB();
    measureINP();
  }, []);
}
