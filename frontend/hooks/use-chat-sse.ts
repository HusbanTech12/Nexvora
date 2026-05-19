import { useState, useCallback, useRef } from "react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface UseChatSSEOptions {
  onLeadQualified?: (lead: { name: string; email: string }) => void;
}

export function useChatSSE(options?: UseChatSSEOptions) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(
    async (sessionId: string, content: string, history?: { role: string; content: string }[]) => {
      if (!content.trim()) return;

      const userMessage: Message = {
        id: Date.now().toString(),
        role: "user",
        content,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMessage]);
      setIsTyping(true);
      setError(null);

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const controller = new AbortController();
      abortControllerRef.current = controller;

      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

      try {
        const response = await fetch(`${apiUrl}/api/chat/stream`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            session_id: sessionId,
            message: content,
            history: history || [],
          }),
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }

        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error("No response body");
        }

        const decoder = new TextDecoder();
        let fullResponse = "";
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
                const data = JSON.parse(line.slice(6));

                if (data.chunk) {
                  fullResponse += data.chunk;
                  setMessages((prev) => {
                    const existing = prev.find(
                      (m) => m.id === "streaming-assistant"
                    );
                    if (existing) {
                      return prev.map((m) =>
                        m.id === "streaming-assistant"
                          ? { ...m, content: fullResponse }
                          : m
                      );
                    }
                    return [
                      ...prev,
                      {
                        id: "streaming-assistant",
                        role: "assistant",
                        content: fullResponse,
                        timestamp: new Date(),
                      },
                    ];
                  });
                }

                if (data.lead_qualified) {
                  options?.onLeadQualified?.(data.lead);
                }

                if (data.done) {
                  setMessages((prev) =>
                    prev.map((m) =>
                      m.id === "streaming-assistant"
                        ? { ...m, id: Date.now().toString() }
                        : m
                    )
                  );
                  setIsTyping(false);
                }
              } catch {
                // Skip malformed JSON lines
              }
            }
          }
        }
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") return;
        const message = err instanceof Error ? err.message : "Failed to get response";
        setError(message);
        setIsTyping(false);
        setMessages((prev) => prev.filter((m) => m.id !== "streaming-assistant"));
      }
    },
    [options]
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    isTyping,
    error,
    sendMessage,
    clearMessages,
  };
}
