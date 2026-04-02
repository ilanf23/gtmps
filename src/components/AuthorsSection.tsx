import adamPhoto from "@/assets/adam-fridman.png";
import richardPhoto from "@/assets/richard-ashbaugh.png";
import { Linkedin, Youtube } from "lucide-react";

const AuthorsSection = () => {
  return (
    <section id="authors" className="px-6 py-20 md:px-20 md:py-28 bg-warm-white">
      <div className="max-w-[1080px] mx-auto stagger-children">
        <span className="font-mono uppercase tracking-[0.2em] text-gold scroll-reveal" style={{ fontSize: 10 }}>
          The Authors
        </span>

        <h2
          className="font-display font-black text-text-dark mt-5 scroll-reveal"
          style={{ fontSize: "clamp(34px, 4vw, 52px)", lineHeight: 1.05, letterSpacing: "-0.02em" }}
        >
          Written by practitioners. Not researchers.
        </h2>

        <p className="font-sans text-text-body mt-4 scroll-reveal" style={{ fontSize: 16, maxWidth: 560 }}>
          Two insiders who have lived the Dead Zone problem from inside the firms that Mabbly now serves. Their combined experience is the reason this book is different from every other marketing book written for business services.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          {/* Adam */}
          <div className="glass-card-light rounded-xl p-10 scroll-reveal">
            <img
              src={adamPhoto}
              alt="Adam Fridman"
              className="w-40 h-40 rounded-full object-cover mx-auto md:mx-0"
              style={{ border: "3px solid rgba(184,147,58,0.3)" }}
            />
            <h3 className="font-display font-bold text-text-dark mt-6" style={{ fontSize: 28 }}>Adam Fridman</h3>
            <p className="font-mono uppercase text-gold mt-1.5" style={{ fontSize: 10, letterSpacing: "0.14em" }}>
              Founder, Mabbly · Author · Host, Signal Activated Growth Podcast
            </p>
            <p className="font-sans text-text-body mt-4" style={{ fontSize: 14, lineHeight: 1.78 }}>
              Adam Fridman founded Mabbly in 2013 and has spent 12 years building GTM systems for professional services firms across North America. He is the author of The Science of Story, the result of 500 interviews with the world's leading storytellers, brand builders, and culture architects. His Signal Activated Growth podcast has produced 100 episodes exploring how relationships drive revenue in professional services. He is building Mabbly AI, the first signal activated growth platform built for PS firm business development at mabbly.ai.
            </p>
            <div className="flex flex-wrap gap-2 mt-5">
              {["Author · The Science of Story", "500 Interviews", "100+ Podcast Episodes", "12 Years, Mabbly"].map((c) => (
                <span
                  key={c}
                  className="font-mono uppercase rounded-full"
                  style={{ fontSize: 8, padding: "5px 14px", border: "1px solid rgba(0,0,0,0.12)", color: "rgba(0,0,0,0.5)" }}
                >
                  {c}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-3 mt-5">
              <a href="https://linkedin.com/in/adamfridman" target="_blank" rel="noopener noreferrer" className="text-text-body hover:text-gold transition-colors"><Linkedin size={18} /></a>
              <a href="https://www.youtube.com/@SignalActivatedGrowth" target="_blank" rel="noopener noreferrer" className="text-text-body hover:text-gold transition-colors"><Youtube size={18} /></a>
            </div>
            <a
              href="https://www.amazon.com/Science-Story-Brand-Reflection-Culture/dp/0999876503"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono uppercase text-gold block mt-4"
              style={{ fontSize: 10 }}
            >
              The Science of Story on Amazon →
            </a>
          </div>

          {/* Richard */}
          <div className="glass-card-light rounded-xl p-10 scroll-reveal">
            <img
              src={richardPhoto}
              alt="Richard Ashbaugh"
              className="w-40 h-40 rounded-full object-cover mx-auto md:mx-0"
              style={{ border: "3px solid rgba(184,147,58,0.3)" }}
            />
            <h3 className="font-display font-bold text-text-dark mt-6" style={{ fontSize: 28 }}>Richard Ashbaugh</h3>
            <p className="font-mono uppercase text-gold mt-1.5" style={{ fontSize: 10, letterSpacing: "0.14em" }}>
              CEO, Mabbly · Former CMO, AArete · Former CMO, Lotis Blue Consulting
            </p>
            <p className="font-sans text-text-body mt-4" style={{ fontSize: 14, lineHeight: 1.78 }}>
              Richard Ashbaugh has spent more than 26 years across nine professional services firms building and scaling go-to-market systems. As CMO of AArete, a global management consulting firm with more than 500 professionals and $125M in annual revenue, he built the GTM infrastructure that many professional services firms spend decades trying to replicate. Earlier in his career, he helped lead the growth of A.T. Kearney from a $250 million firm to a $1.2 billion firm over seven years by implementing the right go-to-market processes and commercial discipline. He later served as Partner and CMO of Lotis Blue Consulting, where he instilled the proper GTM processes to help position the firm for a successful acquisition. Richard has been the exact buyer that firms like Mabbly now serve. He is not explaining professional services GTM from the outside. Instead, he built it, ran it, and is now co-authoring the system designed to replace what is broken.
            </p>
            <div className="flex flex-wrap gap-2 mt-5">
              {["Former CMO, AArete ($125M+)", "Former CMO, Lotis Blue", "26 Years PS Experience", "CEO, Mabbly"].map((c) => (
                <span
                  key={c}
                  className="font-mono uppercase rounded-full"
                  style={{ fontSize: 8, padding: "5px 14px", border: "1px solid rgba(0,0,0,0.12)", color: "rgba(0,0,0,0.5)" }}
                >
                  {c}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-3 mt-5">
              <a href="https://linkedin.com/in/richardfashbaugh" target="_blank" rel="noopener noreferrer" className="text-text-body hover:text-gold transition-colors"><Linkedin size={18} /></a>
              <a href="https://www.youtube.com/@SignalActivatedGrowth" target="_blank" rel="noopener noreferrer" className="text-text-body hover:text-gold transition-colors"><Youtube size={18} /></a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AuthorsSection;
