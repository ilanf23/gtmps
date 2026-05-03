// SECTIONS 03 + 04 — Your Core / Your Proof rendered side-by-side in one
// full-bleed cream section. Each card stacks its 3 boxes vertically.

import CoreAnalysisSection from "./CoreAnalysisSection";
import ProofAnalysisSection from "./ProofAnalysisSection";
import "./ResearchCard.css";

interface Props {
  observedCore: string | null;
  observedProof: string | null;
  primary: string;
  slug?: string;
}

export default function CoreProofAnalysisSection({
  observedCore,
  observedProof,
  primary,
  slug,
}: Props) {
  return (
    <section className="rc-pair-section rc-scope">
      <div className="rc-pair-container">
        <div className="rc-pair-grid">
          <CoreAnalysisSection observed={observedCore} primary={primary} slug={slug} compact />
          <ProofAnalysisSection observed={observedProof} primary={primary} slug={slug} compact />
        </div>
      </div>
    </section>
  );
}
