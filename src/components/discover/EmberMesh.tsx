import { useReducedMotion } from "@/hooks/useReducedMotion";

interface Props {
  intensity?: "low" | "med" | "high";
  className?: string;
}

/**
 * Animated gold-ember background mesh.
 * Three radial gradients, one warm gold, two near-black, slowly drifting.
 * Pure CSS; respects prefers-reduced-motion.
 */
const EmberMesh = ({ intensity = "med", className = "" }: Props) => {
  const reduced = useReducedMotion();
  const goldA =
    intensity === "high" ? 0.18 : intensity === "med" ? 0.12 : 0.07;
  const goldB =
    intensity === "high" ? 0.10 : intensity === "med" ? 0.07 : 0.04;

  return (
    <div
      aria-hidden
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{
        background: `
          radial-gradient(60% 50% at 70% 18%, rgba(168, 146, 58,${goldA}) 0%, rgba(168, 146, 58,0) 60%),
          radial-gradient(50% 50% at 18% 78%, rgba(168, 146, 58,${goldB}) 0%, rgba(168, 146, 58,0) 65%),
          radial-gradient(80% 60% at 50% 50%, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 70%)
        `,
        backgroundSize: "200% 200%, 200% 200%, 200% 200%",
        backgroundPosition: "0% 0%, 100% 0%, 50% 100%",
        animation: reduced ? "none" : "meshDrift 28s ease-in-out infinite",
      }}
    />
  );
};

export default EmberMesh;
