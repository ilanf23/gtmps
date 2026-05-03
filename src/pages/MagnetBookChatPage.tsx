import { useParams } from "react-router-dom";
import MagnetShell from "@/components/magnet/MagnetShell";
import BookChat from "@/components/magnet/BookChat";
import { useClientTheme } from "@/hooks/useClientTheme";
import { useVerticalFlow } from "@/hooks/useVerticalFlow";
import type { VerticalFlowSlug } from "@/content/verticalFlow";

/**
 * Plain-language label for each vertical, used inside the chat empty-state
 * prompts (e.g. "What does the book say about law firms?"). Kept here rather
 * than added to verticalFlow.ts so we don't widen that data shape just for
 * one consumer - and so the wording can stay chat-conversational without
 * affecting the generated copy on the assess/wait/result pages.
 */
const VERTICAL_LABELS: Record<VerticalFlowSlug, string | null> = {
  general: null,
  consulting: "consulting practices",
  law: "law firms",
  accounting: "accounting and tax firms",
  msp: "MSPs",
  advisory: "advisory practices",
  ae: "architecture and engineering firms",
  recruiting: "executive search firms",
  agency: "marketing and creative agencies",
};

export default function MagnetBookChatPage() {
  const { slug } = useParams<{ slug: string }>();
  const theme = useClientTheme(slug);
  const { slug: verticalSlug } = useVerticalFlow();
  const verticalLabel = VERTICAL_LABELS[verticalSlug];

  return (
    <MagnetShell>
      <BookChat firmName={theme.companyName} verticalLabel={verticalLabel} />
    </MagnetShell>
  );
}
