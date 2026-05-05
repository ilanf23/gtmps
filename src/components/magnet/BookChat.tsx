import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import ReactMarkdown from "react-markdown";
import { SendHorizontal } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface BookChatProps {
  /** Firm name for personalized empty-state prompts. */
  firmName?: string | null;
  /** Plain-language vertical label (e.g. "law firms", "consulting practices"). */
  verticalLabel?: string | null;
}

const WELCOME: ChatMessage = {
  role: "assistant",
  content:
    "Ask Adam anything about the GTM book - frameworks, chapters, or how to apply Relationship Revenue OS to your firm.",
};

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/book-chat`;

/**
 * Build 4 to 6 suggested prompts personalized to the firm in scope. Falls back
 * to generic-but-still-specific prompts when we don't have a firm name yet.
 */
function buildSuggestedPrompts(
  firmName: string | null | undefined,
  verticalLabel: string | null | undefined,
): string[] {
  const firm = firmName?.trim() || null;
  const vertical = verticalLabel?.trim() || null;

  const firmRef = firm ?? "our firm";
  const peerRef = vertical
    ? `firms like ${firm ?? "ours"} in ${vertical}`
    : `firms like ${firm ?? "ours"}`;

  const prompts = [
    `How would the Five Orbits framework apply to ${firmRef}?`,
    vertical
      ? `What does the book say about ${vertical}?`
      : `What does the book say about firms in our category?`,
    `Give me the 30-second pitch for why ${firmRef} should care about Relationship Revenue OS.`,
    `Which chapter should I read first if I only have 20 minutes?`,
    `What are the most common origination mistakes ${peerRef} make?`,
    `Walk me through the dormant-relationship reactivation playbook.`,
  ];

  // De-dupe defensively in case vertical/firm collapse to the same wording.
  return Array.from(new Set(prompts)).slice(0, 6);
}

export default function BookChat({ firmName, verticalLabel }: BookChatProps = {}) {
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Empty-state shows when no user message has been sent yet (only the
  // initial welcome is in the transcript).
  const isEmptyState =
    messages.length === 1 && messages[0].role === "assistant" && !isLoading;

  const suggestedPrompts = useMemo(
    () => buildSuggestedPrompts(firmName, verticalLabel),
    [firmName, verticalLabel],
  );

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

  async function sendMessage(override?: string) {
    const trimmed = (override ?? input).trim();
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
            // Partial JSON across chunks - re-buffer
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
                  className="mt-1 w-6 h-6 rounded-full bg-[#A8923A]/15 border border-[#A8923A]/40 text-[#A8923A] text-xs flex items-center justify-center shrink-0"
                  aria-hidden
                >
                  ⊙
                </span>
                <div className="text-[15px] leading-relaxed text-[#0F1E1D]/90 prose prose-sm max-w-none prose-headings:text-[#0F1E1D] prose-strong:text-[#0F1E1D] prose-a:text-[#A8923A]">
                  {m.content ? (
                    <ReactMarkdown>{m.content}</ReactMarkdown>
                  ) : (
                    <span className="inline-flex gap-1.5 items-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#A8923A] animate-pulse" />
                      <span
                        className="w-1.5 h-1.5 rounded-full bg-[#A8923A] animate-pulse"
                        style={{ animationDelay: "150ms" }}
                      />
                      <span
                        className="w-1.5 h-1.5 rounded-full bg-[#A8923A] animate-pulse"
                        style={{ animationDelay: "300ms" }}
                      />
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <div key={i} className="flex justify-end">
                <div className="max-w-[85%] bg-black/5 border border-black/10 rounded-lg px-4 py-3 text-[15px] leading-relaxed text-[#0F1E1D]/90">
                  {m.content}
                </div>
              </div>
            ),
          )}

          {/* ─── Empty-state: "Ask Adam" framing + per-firm prompt chips ─── */}
          {isEmptyState ? (
            <div
              className="mt-2 sm:mt-4 flex flex-col gap-4"
              data-testid="bookchat-empty-state"
            >
              <div className="flex items-start gap-3 sm:gap-4">
                <span
                  className="mt-0.5 w-6 h-6 rounded-full bg-[#A8923A]/15 border border-[#A8923A]/40 text-[#A8923A] text-[10px] font-mono uppercase tracking-[0.14em] flex items-center justify-center shrink-0"
                  aria-hidden
                >
                  A
                </span>
                <div className="flex flex-col gap-1">
                  <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-[#A8923A]/90">
                    Ask Adam
                  </p>
                  <p className="text-[14px] sm:text-[15px] leading-relaxed text-[#0F1E1D]/70">
                    Adam co-wrote the book. Pick a starter or ask anything in your own
                    words
                    {firmName ? (
                      <>
                        {" "}- answers are framed for{" "}
                        <span className="font-medium text-[#0F1E1D]">
                          {firmName}
                        </span>
                      </>
                    ) : null}
                    .
                  </p>
                </div>
              </div>

              <ul
                className="flex flex-col gap-2 pl-9 sm:pl-10"
                aria-label="Suggested prompts"
              >
                {suggestedPrompts.map((prompt) => (
                  <li key={prompt}>
                    <button
                      type="button"
                      onClick={() => sendMessage(prompt)}
                      disabled={isLoading}
                      className="group w-full text-left rounded-lg border border-black/10 bg-black/[0.02] hover:bg-black/[0.04] hover:border-[#A8923A]/40 px-3.5 py-2.5 text-[14px] leading-snug text-[#0F1E1D]/85 hover:text-[#0F1E1D] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-between gap-3"
                    >
                      <span>{prompt}</span>
                      <span
                        aria-hidden
                        className="text-[#A8923A]/60 group-hover:text-[#A8923A] transition-colors text-[1.05em] leading-none shrink-0"
                      >
                        →
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>

      {/* Input bar */}
      <div className="border-t border-black/10 bg-[#EDF5EC]/95 backdrop-blur sticky bottom-0">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex gap-2 items-end bg-black/5 border border-black/10 rounded-xl px-3 py-2 focus-within:border-[#A8923A]/50 transition-colors">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              disabled={isLoading}
              placeholder={
                firmName
                  ? `Ask Adam about ${firmName} and the book…`
                  : "Ask Adam about the GTM book…"
              }
              rows={1}
              className="flex-1 bg-transparent text-[15px] text-[#0F1E1D] placeholder:text-black/30 focus:outline-none resize-none py-1.5 max-h-[200px]"
            />
            <button
              type="button"
              onClick={() => sendMessage()}
              disabled={isLoading || !input.trim()}
              className="bg-[#A8923A] hover:bg-[#8F7C2F] text-[#0F1E1D] w-9 h-9 rounded-lg shrink-0 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              aria-label="Send message"
            >
              <SendHorizontal className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[11px] text-black/30 text-center mt-2">
            Scoped to the GTM book content. Press Enter to send · Shift+Enter for new line.
          </p>
        </div>
      </div>
    </div>
  );
}
