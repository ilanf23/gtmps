import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import ReactMarkdown from "react-markdown";
import { SendHorizontal } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const WELCOME: ChatMessage = {
  role: "assistant",
  content:
    "Ask me anything about the GTM book. Frameworks, chapters, examples, or how to apply them to your firm.",
};

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/book-chat`;

export default function BookChat() {
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isLoading]);

  // Auto-grow textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = `${Math.min(ta.scrollHeight, 200)}px`;
  }, [input]);

  async function sendMessage() {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMessage: ChatMessage = { role: "user", content: trimmed };
    const next = [...messages, userMessage];
    setMessages(next);
    setInput("");
    setIsLoading(true);

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: next }),
      });

      if (resp.status === 429) {
        toast({
          title: "Slow down",
          description: "Too many requests. Please wait a moment and try again.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      if (resp.status === 402) {
        toast({
          title: "Out of credits",
          description: "AI credits are exhausted. Please contact support.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      if (!resp.ok || !resp.body) {
        throw new Error(`Stream failed: ${resp.status}`);
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      let assistantSoFar = "";
      let streamDone = false;

      // Push placeholder assistant message
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") {
            streamDone = true;
            break;
          }
          try {
            const parsed = JSON.parse(jsonStr);
            const content: string | undefined =
              parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantSoFar += content;
              setMessages((prev) => {
                const copy = [...prev];
                const last = copy[copy.length - 1];
                if (last?.role === "assistant") {
                  copy[copy.length - 1] = { ...last, content: assistantSoFar };
                }
                return copy;
              });
            }
          } catch {
            // Partial JSON across chunks — re-buffer
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      // Flush trailing
      if (textBuffer.trim()) {
        for (let raw of textBuffer.split("\n")) {
          if (!raw) continue;
          if (raw.endsWith("\r")) raw = raw.slice(0, -1);
          if (raw.startsWith(":") || raw.trim() === "") continue;
          if (!raw.startsWith("data: ")) continue;
          const jsonStr = raw.slice(6).trim();
          if (jsonStr === "[DONE]") continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const content: string | undefined =
              parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantSoFar += content;
              setMessages((prev) => {
                const copy = [...prev];
                const last = copy[copy.length - 1];
                if (last?.role === "assistant") {
                  copy[copy.length - 1] = { ...last, content: assistantSoFar };
                }
                return copy;
              });
            }
          } catch {
            /* ignore */
          }
        }
      }

      if (!assistantSoFar) {
        setMessages((prev) => {
          const copy = [...prev];
          const last = copy[copy.length - 1];
          if (last?.role === "assistant" && !last.content) {
            copy[copy.length - 1] = {
              ...last,
              content: "I couldn't generate a response. Try rephrasing.",
            };
          }
          return copy;
        });
      }
    } catch (e) {
      console.error("BookChat error", e);
      toast({
        title: "Something went wrong",
        description: "Couldn't reach the book chat. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 overflow-y-auto" ref={scrollRef}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col gap-6">
          {messages.map((m, i) =>
            m.role === "assistant" ? (
              <div
                key={i}
                className="flex gap-3 sm:gap-4 items-start"
              >
                <span
                  className="mt-1 w-6 h-6 rounded-full bg-[#B8933A]/15 border border-[#B8933A]/40 text-[#B8933A] text-xs flex items-center justify-center shrink-0"
                  aria-hidden
                >
                  ⊙
                </span>
                <div className="text-[15px] leading-relaxed text-[#1C1008]/90 prose prose-sm max-w-none prose-headings:text-[#1C1008] prose-strong:text-[#1C1008] prose-a:text-[#B8933A]">
                  {m.content ? (
                    <ReactMarkdown>{m.content}</ReactMarkdown>
                  ) : (
                    <span className="inline-flex gap-1.5 items-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#B8933A] animate-pulse" />
                      <span
                        className="w-1.5 h-1.5 rounded-full bg-[#B8933A] animate-pulse"
                        style={{ animationDelay: "150ms" }}
                      />
                      <span
                        className="w-1.5 h-1.5 rounded-full bg-[#B8933A] animate-pulse"
                        style={{ animationDelay: "300ms" }}
                      />
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <div key={i} className="flex justify-end">
                <div className="max-w-[85%] bg-black/5 border border-black/10 rounded-lg px-4 py-3 text-[15px] leading-relaxed text-[#1C1008]/90">
                  {m.content}
                </div>
              </div>
            ),
          )}
        </div>
      </div>

      {/* Input bar */}
      <div className="border-t border-black/10 bg-[#FBF8F4]/95 backdrop-blur sticky bottom-0">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex gap-2 items-end bg-black/5 border border-black/10 rounded-xl px-3 py-2 focus-within:border-[#B8933A]/50 transition-colors">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              disabled={isLoading}
              placeholder="Ask about the GTM book…"
              rows={1}
              className="flex-1 bg-transparent text-[15px] text-[#1C1008] placeholder:text-black/30 focus:outline-none resize-none py-1.5 max-h-[200px]"
            />
            <button
              type="button"
              onClick={sendMessage}
              disabled={isLoading || !input.trim()}
              className="bg-[#B8933A] hover:bg-[#a07c2e] text-[#120D05] w-9 h-9 rounded-lg shrink-0 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              aria-label="Send message"
            >
              <SendHorizontal className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[11px] text-black/30 text-center mt-2">
            Scoped to the GTM book content. Press Enter to send · Shift+Enter for newline.
          </p>
        </div>
      </div>
    </div>
  );
}
