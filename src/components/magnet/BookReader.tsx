import { useEffect, useMemo, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { ChevronLeft, ChevronRight, Maximize2, Minimize2 } from "lucide-react";

// Serve the worker as a static asset from /public so the URL is stable across
// dev, preview iframe, and production. Avoids Vite module-URL resolution
// quirks that broke the embed in the Lovable preview iframe.
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf-worker/pdf.worker.min.mjs";

const PDF_URL = "/book/relationship-revenue-os.pdf";

export default function BookReader() {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pdfAvailable, setPdfAvailable] = useState<boolean | null>(null);
  const [fullscreen, setFullscreen] = useState(false);
  const [containerWidth, setContainerWidth] = useState<number>(800);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Existence check (avoid mounting <Document> against an HTML 404).
  useEffect(() => {
    let cancelled = false;
    // Soft existence check — only reject on a hard 404. Some hosts return
    // application/octet-stream on HEAD even when GET serves the PDF fine,
    // so we don't gate on content-type.
    fetch(PDF_URL, { method: "HEAD" })
      .then((r) => {
        if (cancelled) return;
        setPdfAvailable(r.ok);
      })
      .catch(() => !cancelled && setPdfAvailable(false));
    return () => {
      cancelled = true;
    };
  }, []);

  // Track container width so the page renders crisply at any viewport.
  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver((entries) => {
      for (const e of entries) {
        const w = e.contentRect.width;
        // Cap at 920 for readability; subtract a little gutter.
        setContainerWidth(Math.min(920, Math.max(320, w - 32)));
      }
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [pdfAvailable]);

  // Block right-click save inside the reader region.
  const onContextMenu = (e: React.MouseEvent) => e.preventDefault();

  // Keyboard navigation.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!numPages) return;
      if (e.key === "ArrowRight" || e.key === "PageDown") {
        setPageNumber((p) => Math.min(numPages, p + 1));
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        setPageNumber((p) => Math.max(1, p - 1));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [numPages]);

  const file = useMemo(() => ({ url: PDF_URL }), []);

  const goPrev = () => setPageNumber((p) => Math.max(1, p - 1));
  const goNext = () =>
    setPageNumber((p) => (numPages ? Math.min(numPages, p + 1) : p));

  return (
    <div
      className={
        fullscreen
          ? "fixed inset-0 z-50 flex flex-col bg-[#FAF9F5]"
          : "flex-1 flex flex-col"
      }
      onContextMenu={onContextMenu}
    >
      {/* Toolbar */}
      <div className="border-b border-black/10 bg-[#EDF5EC]/90 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <p className="text-xs uppercase tracking-[0.28em] text-[#A8923A]">
            Read the Book
          </p>

          {pdfAvailable && numPages ? (
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                type="button"
                onClick={goPrev}
                disabled={pageNumber <= 1}
                className="inline-flex items-center justify-center w-8 h-8 rounded text-[#0F1E1D]/70 hover:text-[#0F1E1D] hover:bg-black/5 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs tabular-nums text-[#0F1E1D]/70 min-w-[64px] text-center">
                {pageNumber} / {numPages}
              </span>
              <button
                type="button"
                onClick={goNext}
                disabled={pageNumber >= numPages}
                className="inline-flex items-center justify-center w-8 h-8 rounded text-[#0F1E1D]/70 hover:text-[#0F1E1D] hover:bg-black/5 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                aria-label="Next page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setFullscreen((v) => !v)}
                className="ml-1 sm:ml-2 inline-flex items-center justify-center w-8 h-8 rounded text-[#0F1E1D]/70 hover:text-[#0F1E1D] hover:bg-black/5 transition-colors"
                aria-label={fullscreen ? "Exit fullscreen" : "Enter fullscreen"}
              >
                {fullscreen ? (
                  <Minimize2 className="w-4 h-4" />
                ) : (
                  <Maximize2 className="w-4 h-4" />
                )}
              </button>
            </div>
          ) : null}
        </div>
      </div>

      {/* Reader */}
      <div
        ref={containerRef}
        className="flex-1 bg-[#FAF9F5] overflow-y-auto select-none"
        style={{ WebkitUserSelect: "none" }}
      >
        {pdfAvailable === null && (
          <div className="h-full flex items-center justify-center py-20">
            <div
              className="w-8 h-8 rounded-full border-2 border-[#A8923A]/30 border-t-[#A8923A] animate-spin"
              aria-label="Loading"
            />
          </div>
        )}

        {pdfAvailable === true && (
          <div className="flex flex-col items-center py-6 sm:py-10">
            <Document
              file={file}
              onLoadSuccess={({ numPages }) => setNumPages(numPages)}
              onLoadError={(err) =>
                console.error("[BookReader] PDF load error:", err)
              }
              onSourceError={(err) =>
                console.error("[BookReader] PDF source error:", err)
              }
              loading={
                <div className="py-20">
                  <div
                    className="w-8 h-8 rounded-full border-2 border-[#A8923A]/30 border-t-[#A8923A] animate-spin"
                    aria-label="Loading"
                  />
                </div>
              }
              error={
                <p className="text-[#0F1E1D]/60 text-sm py-20">
                  We couldn't load the book.
                </p>
              }
            >
              <div
                className="relative shadow-[0_18px_60px_-20px_rgba(15, 30, 29,0.35)] bg-white"
                onClick={(e) => {
                  // Preserve scroll position — flipping the page must not
                  // jump the reader back to the top.
                  const scrollEl = containerRef.current;
                  const savedScroll = scrollEl?.scrollTop ?? 0;
                  const rect = e.currentTarget.getBoundingClientRect();
                  const clickedLeftHalf = e.clientX - rect.left < rect.width / 2;
                  if (clickedLeftHalf) {
                    if (pageNumber > 1) setPageNumber((p) => p - 1);
                  } else {
                    if (numPages && pageNumber < numPages)
                      setPageNumber((p) => p + 1);
                  }
                  // Restore scroll on next frame, after React re-renders the
                  // new page (which can briefly change content height).
                  requestAnimationFrame(() => {
                    if (scrollEl) scrollEl.scrollTop = savedScroll;
                  });
                }}
                role="button"
                tabIndex={0}
                aria-label="Click left half for previous page, right half for next page"
                style={{ cursor: "pointer" }}
              >
                <Page
                  pageNumber={pageNumber}
                  width={containerWidth}
                  renderAnnotationLayer={false}
                  renderTextLayer={false}
                />
                {/* Subtle visual hint zones — invisible but make the affordance clear on hover */}
                <div
                  className="pointer-events-none absolute inset-y-0 left-0 w-1/2"
                  aria-hidden
                />
                <div
                  className="pointer-events-none absolute inset-y-0 right-0 w-1/2"
                  aria-hidden
                />
              </div>
            </Document>

            {numPages ? (
              <div className="mt-6 flex items-center gap-3 text-xs uppercase tracking-[0.24em] text-[#0F1E1D]/50">
                <button
                  type="button"
                  onClick={goPrev}
                  disabled={pageNumber <= 1}
                  className="hover:text-[#0F1E1D] disabled:opacity-30 transition-colors"
                >
                  ← Prev
                </button>
                <span>
                  Page {pageNumber} of {numPages}
                </span>
                <button
                  type="button"
                  onClick={goNext}
                  disabled={pageNumber >= numPages}
                  className="hover:text-[#0F1E1D] disabled:opacity-30 transition-colors"
                >
                  Next →
                </button>
              </div>
            ) : null}
          </div>
        )}

        {pdfAvailable === false && (
          <div className="h-full flex flex-col items-center justify-center px-6 py-20 text-center">
            <p className="text-[#A8923A] text-xs uppercase tracking-[0.32em] mb-4">
              Coming Soon
            </p>
            <h2 className="text-2xl sm:text-3xl font-semibold text-[#0F1E1D] mb-3 max-w-xl">
              The book is on its way.
            </h2>
            <p className="text-[#0F1E1D]/60 max-w-md leading-relaxed">
              We're putting the final polish on the GTM book PDF. It'll be
              readable here as soon as it lands. In the meantime, head to the{" "}
              <span className="text-[#A8923A]">Talk to the Book</span> tab to
              ask questions about the framework.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
