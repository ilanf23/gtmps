import { useEffect } from "react";

type Chapter = { num: string; title: string; meta: string; body: string };

const CHAPTERS: Chapter[] = [
  {
    num: "01",
    title: "The Dead Zone",
    meta: "Chapter 7 · 24 pages",
    body: "The named villain: 96% of every CRM is dormant relationships earned and going to waste. The chapter every PS founder reads first.",
  },
  {
    num: "02",
    title: "The Five Orbits",
    meta: "Chapter 4 · 18 pages",
    body: "Map every relationship your firm has ever built across five concentric layers. The structural backbone of the Relationship Revenue OS.",
  },
  {
    num: "03",
    title: "Building Your MAP",
    meta: "Chapter 11 · 31 pages",
    body: "The Market Activation Profile, end to end. How to convert dormant relationships into revenue without cold outreach.",
  },
];

const BADGES = ["30 Chapters", "3 Frameworks", "PS Firms $5M to $100M"];

export default function Manuscript() {
  useEffect(() => {
    const title = "The Manuscript - GTM for Professional Services | Mabbly";
    const description =
      "Relationship Revenue OS: the complete GTM operating system for professional services firms. 30 chapters covering The Dead Zone, The Five Orbits, and the MAP framework.";
    const canonical = "https://discover.mabbly.com/manuscript";

    document.title = title;

    const setMeta = (key: string, content: string, isProperty = false) => {
      const selector = isProperty ? `meta[property="${key}"]` : `meta[name="${key}"]`;
      let el = document.querySelector(selector) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(isProperty ? "property" : "name", key);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    setMeta("description", description);
    setMeta("og:title", title, true);
    setMeta("og:description", description, true);
    setMeta("og:type", "article", true);
    setMeta("og:url", canonical, true);
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", title);
    setMeta("twitter:description", description);

    let canonicalEl = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonicalEl) {
      canonicalEl = document.createElement("link");
      canonicalEl.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalEl);
    }
    canonicalEl.setAttribute("href", canonical);
  }, []);

  return (
    <main
      className="px-6 md:px-10"
      style={{
        background: "#EDF5EC",
        minHeight: "100vh",
        paddingTop: 96,
        paddingBottom: 144,
        fontFamily: "'Inter Tight', sans-serif",
      }}
    >
      <article style={{ maxWidth: 880, margin: "0 auto" }}>
        <p
          style={{
            fontSize: 13,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            color: "#A8923A",
            margin: 0,
            fontWeight: 500,
          }}
        >
          MABBLY PRESS · MANUSCRIPT
        </p>
        <div
          aria-hidden
          style={{
            width: 44,
            height: 2,
            background: "linear-gradient(90deg, #A8923A, rgba(168, 146, 58,0.3))",
            margin: "18px 0 28px",
          }}
        />

        <h1
          style={{
            fontSize: "clamp(44px, 6vw, 72px)",
            fontWeight: 500,
            color: "#2A1A08",
            lineHeight: 1.0,
            letterSpacing: "-0.035em",
            margin: "0 0 18px",
          }}
        >
          The Manuscript: Relationship Revenue OS
        </h1>

        <p
          style={{
            fontSize: "clamp(18px, 1.8vw, 22px)",
            color: "rgba(42,26,8,0.55)",
            margin: "0 0 48px",
            lineHeight: 1.5,
            fontWeight: 300,
          }}
        >
          The complete GTM operating system for professional services firms. 30 chapters. The Dead
          Zone. The Five Orbits. The MAP.
        </p>

        <section style={{ marginBottom: 56 }}>
          <h2
            style={{
              fontSize: 24,
              fontWeight: 500,
              color: "#2A1A08",
              letterSpacing: "-0.02em",
              margin: "0 0 24px",
            }}
          >
            Sample Chapters
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {CHAPTERS.map((c) => (
              <article
                key={c.num}
                style={{
                  background: "rgba(255,250,240,0.8)",
                  border: "1px solid rgba(168, 146, 58,0.18)",
                  borderRadius: 4,
                  padding: "24px 28px",
                }}
              >
                <header
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: 20,
                    flexWrap: "wrap",
                    marginBottom: 12,
                  }}
                >
                  <span
                    style={{
                      fontSize: 36,
                      fontWeight: 600,
                      color: "rgba(42,26,8,0.18)",
                      minWidth: 52,
                      letterSpacing: "-0.03em",
                    }}
                  >
                    {c.num}
                  </span>
                  <h3
                    style={{
                      fontSize: 22,
                      color: "#2A1A08",
                      fontWeight: 500,
                      letterSpacing: "-0.015em",
                      margin: 0,
                    }}
                  >
                    {c.title}
                  </h3>
                  <span
                    style={{
                      fontSize: 13,
                      color: "rgba(42,26,8,0.45)",
                      marginLeft: "auto",
                      fontWeight: 400,
                    }}
                  >
                    {c.meta}
                  </span>
                </header>
                <p
                  style={{
                    fontSize: 16,
                    color: "rgba(42,26,8,0.75)",
                    lineHeight: 1.6,
                    margin: 0,
                    fontWeight: 300,
                  }}
                >
                  {c.body}
                </p>
              </article>
            ))}
          </div>
        </section>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 64 }}>
          {BADGES.map((b) => (
            <span
              key={b}
              style={{
                border: "1px solid rgba(168, 146, 58,0.28)",
                borderRadius: 3,
                padding: "8px 16px",
                fontSize: 12.5,
                letterSpacing: "0.12em",
                color: "#6A5038",
                textTransform: "uppercase",
                fontWeight: 500,
              }}
            >
              {b}
            </span>
          ))}
        </div>

        <div
          style={{
            borderTop: "1px solid rgba(168, 146, 58,0.18)",
            paddingTop: 40,
            textAlign: "center",
          }}
        >
          <a
            href="/discover#beta-reader"
            style={{
              display: "inline-block",
              background: "#A8923A",
              color: "#fff",
              padding: "16px 32px",
              borderRadius: 3,
              fontSize: 15,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              fontWeight: 500,
              textDecoration: "none",
            }}
          >
            Apply for Early Access
          </a>
        </div>
      </article>
    </main>
  );
}
