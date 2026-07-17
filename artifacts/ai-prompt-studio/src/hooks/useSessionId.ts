import { useState, useEffect } from 'react';

export function useSessionId(): string {
  const [sessionId, setSessionId] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const existing = localStorage.getItem('aps_session_id');
      if (existing) return existing;
      
      try {
        const id = crypto.randomUUID();
        localStorage.setItem('aps_session_id', id);
        return id;
      } catch (e) {
        // Fallback for non-secure contexts if crypto.randomUUID is not available
        const fallbackId = 'aps_' + Math.random().toString(36).substring(2, 15);
        localStorage.setItem('aps_session_id', fallbackId);
        return fallbackId;
      }
    }
    return '';
  });

  // Ensure it's generated even if SSR/hydration mismatch happens
  useEffect(() => {
    if (!sessionId) {
      try {
        const id = crypto.randomUUID();
        localStorage.setItem('aps_session_id', id);
        setSessionId(id);
      } catch (e) {
        const fallbackId = 'aps_' + Math.random().toString(36).substring(2, 15);
        localStorage.setItem('aps_session_id', fallbackId);
        setSessionId(fallbackId);
      }
    }
  }, [sessionId]);

  return sessionId;
}
