const logos = [
  "Workiva",
  "Tiger 21",
  "Lactation Network",
  "AArete",
  "NoDoz",
  "Lotis Blue",
];

const SocialProofBar = () => {
  return (
    <section className="px-6 py-10 md:px-20 md:py-14 bg-cream">
      <div className="max-w-[1080px] mx-auto">
        <p
          className="font-mono uppercase text-center mb-8 scroll-reveal"
          style={{ fontSize: 10, color: "rgba(0,0,0,0.35)", letterSpacing: "0.2em" }}
        >
          TRUSTED BY FIRMS ACROSS NORTH AMERICA
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4 scroll-reveal">
          {logos.map((name) => (
            <span
              key={name}
              className="font-display font-bold"
              style={{ fontSize: 18, color: "rgba(0,0,0,0.22)", letterSpacing: "-0.01em" }}
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialProofBar;
