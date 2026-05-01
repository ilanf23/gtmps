# Light beige background for sections 3 + 4

Apply a subtle light beige (`#F7F1E6`) background to Core Analysis (section 3) and Proof Analysis (section 4) on every microsite, so they read as a paired "diagnostic" block distinct from neighboring sections.

The tint extends edge-to-edge of the content column using negative horizontal margins matched by equal padding, so no other characters, spacing, or width changes occur on the page.

## Files

1. `src/components/magnet/v10/CoreAnalysisSection.tsx` — on the outer `<section>`:
   - Add classes `-mx-6 px-6 md:-mx-10 md:px-10`
   - Add `style={{ backgroundColor: "#F7F1E6" }}`

2. `src/components/magnet/v10/ProofAnalysisSection.tsx` — same change on its outer `<section>`.

That's it. No other components, content, or styling touched.

## Out of scope

- All other microsite sections
- Inner `OHQ` panel backgrounds (still `#FBF8F4`, which provides a nice card-on-tint contrast against the new beige)
- Mobile-specific styling (the negative margin + padding works fluidly across breakpoints since the parent container has `px-6`)
