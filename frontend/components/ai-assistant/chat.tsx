"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { Sparkles, Send, Bot, User, X, Minimize2 } from "lucide-react";
import { useChatSSE } from "@/hooks/use-chat-sse";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const containerVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
};

const messageVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

function generateSessionId(): string {
  if (typeof window === "undefined") return "";
  let stored = sessionStorage.getItem("chat_session_id");
  if (!stored) {
    stored = crypto.randomUUID();
    sessionStorage.setItem("chat_session_id", stored);
  }
  return stored;
}

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [leadCaptured, setLeadCaptured] = useState(false);
  const sessionId = isOpen ? generateSessionId() : null;

  const { messages, isTyping, error, sendMessage, clearMessages } =
    useChatSSE({
      onLeadQualified: (lead) => {
        setLeadCaptured(true);
        console.log("Lead qualified:", lead);
      },
    });

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  const handleSend = () => {
    if (!input.trim() || !sessionId) return;

    const history = messages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    sendMessage(sessionId, input, history);
    setInput("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsMinimized(false);
  };

  const handleToggleMinimize = () => {
    setIsMinimized((prev) => !prev);
  };

  if (!isOpen) {
    return (
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-teal-400/50 hover:scale-110 transition-transform z-50"
        onClick={() => setIsOpen(true)}
      >
        <Sparkles className="w-6 h-6 text-white" />
        <span className="absolute top-0 right-0 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
      </motion.button>
    );
  }

  if (isMinimized) {
    return (
      <motion.button
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="fixed bottom-6 right-6 glass rounded-full p-4 border border-teal-400/30 hover:border-teal-400/50 transition-colors z-50"
        onClick={() => setIsMinimized(false)}
      >
        <Sparkles className="w-6 h-6 text-teal-300" />
      </motion.button>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="fixed bottom-6 right-6 w-96 h-[500px] glass rounded-2xl border border-zinc-800 flex flex-col z-50 shadow-2xl shadow-teal-400/20"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="text-sm font-medium text-white">AI Assistant</span>
            <span className="text-xs text-green-400 ml-2">Online</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleMinimize}
            className="w-8 h-8 rounded-lg hover:bg-zinc-800 flex items-center justify-center transition-colors"
          >
            <Minimize2 className="w-4 h-4 text-zinc-400" />
          </button>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-lg hover:bg-zinc-800 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-zinc-400" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            variants={messageVariants}
            className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.role === "assistant"
                  ? "bg-gradient-to-r from-teal-500 to-emerald-500"
                  : "bg-zinc-700"
              }`}
            >
              {message.role === "assistant" ? (
                <Bot className="w-4 h-4 text-white" />
              ) : (
                <User className="w-4 h-4 text-white" />
              )}
            </div>
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                message.role === "assistant"
                  ? "bg-zinc-800 text-zinc-200"
                  : "bg-teal-500 text-white"
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              <span className="text-xs text-zinc-500 mt-1 block">
                {message.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </motion.div>
        ))}

        {/* Typing Indicator */}
        <AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex gap-3"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-zinc-800 rounded-2xl px-4 py-3">
                <div className="flex gap-1">
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                    className="w-2 h-2 bg-zinc-500 rounded-full"
                  />
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity, delay: 0.1 }}
                    className="w-2 h-2 bg-zinc-500 rounded-full"
                  />
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity, delay: 0.2 }}
                    className="w-2 h-2 bg-zinc-500 rounded-full"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {error && (
          <div className="text-red-400 text-sm text-center p-2 bg-red-900/20 rounded-lg">
            {error}
          </div>
        )}

        {leadCaptured && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-green-400 text-sm text-center p-2 bg-green-900/20 rounded-lg"
          >
            Thanks! Our team will reach out soon.
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-zinc-800">
        <div className="flex items-center gap-2 bg-zinc-800/50 rounded-xl px-3 py-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 bg-transparent text-sm text-white placeholder:text-zinc-500 outline-none"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
