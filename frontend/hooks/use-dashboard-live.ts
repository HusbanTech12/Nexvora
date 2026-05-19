import { useState, useEffect, useRef, useCallback } from "react";

interface DashboardLive {
  total_leads: number;
  new_leads: number;
  today_leads: number;
  timestamp: string;
}

export function useDashboardLive() {
  const [data, setData] = useState<DashboardLive | null>(null);
  const [connected, setConnected] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const connect = useCallback(() => {
    const controller = new AbortController();
    abortRef.current = controller;

    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

    async function stream() {
      try {
        const res = await fetch(`${apiUrl}/api/dashboard/live`, {
          signal: controller.signal,
        });

        if (!res.ok) return;

        setConnected(true);
        const reader = res.body?.getReader();
        if (!reader) return;

        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              try {
                const parsed = JSON.parse(line.slice(6));
                setData(parsed);
              } catch {
                // skip
              }
            }
          }
        }
      } catch {
        // reconnect after 5s
        if (!controller.signal.aborted) {
          setTimeout(connect, 5000);
        }
      } finally {
        setConnected(false);
      }
    }

    stream();
  }, []);

  useEffect(() => {
    connect();
    return () => abortRef.current?.abort();
  }, [connect]);

  return { data, connected };
}
