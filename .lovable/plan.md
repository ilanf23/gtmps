## Goal

Change the "Podcast" link in the top navigation so it opens the specific YouTube episode the user provided, instead of the channel page.

New URL: `https://www.youtube.com/watch?v=6eb4aZzi74A&t=1757s`

## Change

**File:** `src/components/VerticalLanding/VerticalNavBar.tsx` (line 264)

Replace the `href` on the Podcast nav link:

```tsx
// before
<a
  className="vnav-link"
  href="https://www.youtube.com/@GTMforPS"
  target="_blank"
  rel="noopener noreferrer"
>
  Podcast
</a>

// after
<a
  className="vnav-link"
  href="https://www.youtube.com/watch?v=6eb4aZzi74A&t=1757s"
  target="_blank"
  rel="noopener noreferrer"
>
  Podcast
</a>
```

Keep `target="_blank"` and `rel="noopener noreferrer"` as is. No copy changes, no styling changes.

## Scope notes

- Only the top nav Podcast link changes. Other references to the `@GTMforPS` channel (footer subscribe links, About page nav, AIvsCOM section, etc.) are intentionally left pointing at the channel, since they are "subscribe / browse" surfaces rather than a single-episode CTA.
- The Core memory rule "Official YouTube channel is https://www.youtube.com/@GTMforPS" still holds for the channel itself; this single nav entry is being repurposed as a featured-episode link. No memory update needed.
