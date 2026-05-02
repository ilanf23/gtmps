// Skip link — visually hidden until focused. Lets keyboard users jump
// past the top nav directly into the main content of the current page.
//
// Pairs with the <main id="main-content" tabIndex={-1}> wrapper in App.tsx
// and the focus-on-route-change handler that lives there.

export default function SkipLink() {
  return (
    <a
      href="#main-content"
      style={{
        position: "absolute",
        left: 16,
        top: 16,
        zIndex: 1000,
        padding: "10px 16px",
        background: "#0F1E1D",
        color: "#EDF5EC",
        fontFamily: "'Inter Tight', sans-serif",
        fontSize: 14,
        fontWeight: 600,
        letterSpacing: "0.04em",
        textDecoration: "none",
        borderRadius: 4,
        transform: "translateY(-200%)",
        transition: "transform 180ms cubic-bezier(0.22, 1, 0.36, 1)",
      }}
      onFocus={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
      }}
      onBlur={(e) => {
        e.currentTarget.style.transform = "translateY(-200%)";
      }}
    >
      Skip to main content
    </a>
  );
}
