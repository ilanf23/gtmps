import { useEffect, useState } from "react";
import { Download, ExternalLink } from "lucide-react";

const PDF_URL = "/relationship-revenue-os.pdf";

export default function BookReader() {
  const [pdfAvailable, setPdfAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(PDF_URL, { method: "HEAD" })
      .then((r) => {
        if (cancelled) return;
        // Treat presence of an actual PDF (not a fallback HTML 404) as available.
        const ct = r.headers.get("content-type") || "";
        setPdfAvailable(r.ok && ct.toLowerCase().includes("pdf"));
      })
      .catch(() => {
        if (!cancelled) setPdfAvailable(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="flex-1 flex flex-col">
      {/* Toolbar */}
      <div className="border-b border-white/10 bg-[#120D05]/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <p className="text-xs uppercase tracking-[0.28em] text-[#B8933A]">
            Read the Book
          </p>
          <div className="flex items-center gap-2">
            {pdfAvailable && (
              <>
                <a
                  href={PDF_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-[#F5EFE0]/60 hover:text-[#F5EFE0] transition-colors px-3 py-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Open
                </a>
                <a
                  href={PDF_URL}
                  download
                  className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider bg-[#B8933A] hover:bg-[#a07c2e] text-[#120D05] font-semibold px-3 py-1.5 rounded transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download
                </a>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Reader */}
      <div className="flex-1 bg-[#0c0803]">
        {pdfAvailable === null && (
          <div className="h-full flex items-center justify-center">
            <div
              className="w-8 h-8 rounded-full border-2 border-[#B8933A]/30 border-t-[#B8933A] animate-spin"
              aria-label="Checking for book"
            />
          </div>
        )}

        {pdfAvailable === true && (
          <iframe
            src={`${PDF_URL}#view=FitH`}
            title="GTM Book"
            className="w-full h-[calc(100vh-7rem)] border-0"
          />
        )}

        {pdfAvailable === false && (
          <div className="h-full flex flex-col items-center justify-center px-6 py-20 text-center">
            <p className="text-[#B8933A] text-xs uppercase tracking-[0.32em] mb-4">
              Coming Soon
            </p>
            <h2 className="text-2xl sm:text-3xl font-semibold text-[#F5EFE0] mb-3 max-w-xl">
              The book is on its way.
            </h2>
            <p className="text-[#F5EFE0]/60 max-w-md leading-relaxed">
              We're putting the final polish on the GTM book PDF. It'll be
              readable here as soon as it lands. In the meantime, head to the{" "}
              <span className="text-[#B8933A]">Talk to the Book</span> tab to
              ask questions about the framework.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
