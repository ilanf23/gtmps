import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { MessageCircle, X, SendHorizontal } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface MagnetChatProps {
  slug: string;
  companyName: string;
}

const INITIAL_MESSAGE: ChatMessage = {
  role: "assistant",
  content: "I've read your GTM breakdown. What would you like to dig into?",
};

export default function MagnetChat({ slug, companyName }: MagnetChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isOpen, isLoading]);

  async function sendMessage() {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMessage: ChatMessage = { role: "user", content: trimmed };
    const updated = [...messages, userMessage];
    setMessages(updated);
    setInput("");
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("magnet-chat", {
        body: { slug, messages: updated },
      });
      if (error) throw error;
      const reply: string =
        (data && typeof data.reply === "string" && data.reply) ||
        "Something went wrong. Please try again.";
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Something went wrong. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <>
      {isOpen && (
        <div
          className="fixed bottom-24 right-6 z-50 w-[calc(100vw-3rem)] sm:w-80 h-[480px] bg-[#F5EFE0] border border-[#B8933A]/30 flex flex-col shadow-2xl"
          role="dialog"
          aria-label="GTM advisor chat"
        >
          {/* Header */}
          <div className="shrink-0 bg-[#B8933A]/10 border-b border-[#B8933A]/20 px-4 py-3 flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[#B8933A] animate-pulse shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-[#1C1008] truncate">
                GTM Advisor — {companyName}
              </p>
              <p className="text-xs opacity-40 text-[#1C1008]">
                Scoped to your breakdown
              </p>
            </div>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3"
          >
            {messages.map((m, i) =>
              m.role === "assistant" ? (
                <p
                  key={i}
                  className="text-sm leading-relaxed text-[#1C1008] opacity-90"
                >
                  <span className="text-[#B8933A] mr-1.5">⊙</span>
                  {m.content}
                </p>
              ) : (
                <p
                  key={i}
                  className="text-sm leading-relaxed text-[#1C1008]/70 bg-black/5 rounded-sm px-3 py-2 max-w-[85%] ml-auto"
                >
                  {m.content}
                </p>
              ),
            )}
            {isLoading && (
              <div className="flex gap-1.5 items-center" aria-label="Thinking">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B8933A] animate-pulse" />
                <span
                  className="w-1.5 h-1.5 rounded-full bg-[#B8933A] animate-pulse"
                  style={{ animationDelay: "150ms" }}
                />
                <span
                  className="w-1.5 h-1.5 rounded-full bg-[#B8933A] animate-pulse"
                  style={{ animationDelay: "300ms" }}
                />
              </div>
            )}
          </div>

          {/* Input */}
          <div className="shrink-0 border-t border-black/10 p-3 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              disabled={isLoading}
              placeholder="Ask about your GTM…"
              className="flex-1 bg-black/5 border border-black/10 text-[#1C1008] placeholder:text-black/30 px-3 py-2 text-sm rounded-none focus:outline-none focus:border-[#B8933A]/50 disabled:opacity-50"
            />
            <button
              type="button"
              onClick={sendMessage}
              disabled={isLoading || !input.trim()}
              className="bg-[#B8933A] hover:bg-[#a07c2e] text-[#120D05] px-3 py-2 shrink-0 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              aria-label="Send message"
            >
              <SendHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Floating toggle button */}
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#B8933A] hover:bg-[#a07c2e] shadow-lg flex items-center justify-center text-[#120D05] transition-colors"
        aria-label={isOpen ? "Close chat" : "Open GTM advisor chat"}
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}
      </button>
    </>
  );
}
