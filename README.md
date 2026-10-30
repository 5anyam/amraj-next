This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/pages/api-reference/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/pages/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Videos

Product reels play in a horizontal strip on the homepage (after the bestsellers) and on each
product page (above the reviews, showing only that product's reels).

How they behave:
- Only one video plays at a time; starting one pauses the others.
- The most visible reel autoplays (muted) as you scroll to it and pauses when it scrolls away.
- A reel the visitor paused stays paused until it leaves the screen.
- The mute button is shared — unmuting carries over to the next reel.
- No video bytes load until a reel is near the screen; visitors with reduced motion or
  Data Saver on get tap-to-play only.

### Add or replace a reel

1. Put the MP4 in `public/videos/` (a name without spaces is easiest).
2. Make a poster: one frame of the video, 540px wide, saved as WebP in `public/videos/posters/`.
   Pick a frame without claim text on it.
3. Add an entry to `VIDEOS` in `lib/videos.ts`: `src`, `poster`, the `productSlug` it belongs to,
   a `title` (read out by screen readers), and `homepage: true` if it should appear on the homepage.
4. To take a reel down without deleting it, set `hidden: true`.

### File specs

- Vertical 9:16, 720×1280 (576×1024 is fine), H.264 + AAC in `.mp4`, under ~15 MB.
- Export with "fast start" / "web optimised" so playback starts before the file finishes downloading.
- Burn in captions for any speech — reels start muted.
- Keep on-screen wording within FSSAI / ASCI rules: no cure, disease or guaranteed-result claims,
  no "clinically proven" without a study, and no doctor endorsements unless the doctor is real
  and consented.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn-pages-router) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/pages/building-your-application/deploying) for more details.
# surakshamarket
# ormdesk
