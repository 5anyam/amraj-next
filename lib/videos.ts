/** Product reels. Files live in /public/videos, posters in /public/videos/posters.
 *  Files are mapped by what each clip actually shows — several file names don't match
 *  their content (e.g. weight.mp4 is a prostate reel, prostate-4.mp4 is a weight reel).
 *
 *  To add a reel: drop the MP4 in /public/videos, add a 540px-wide WebP poster to
 *  /public/videos/posters, and add an entry below. Set `hidden: true` to pull a reel
 *  without deleting it. See README → "Videos". */

export interface ProductVideo {
  id: string;
  src: string;
  poster: string;
  /** Slug of the product this reel is about — links the card to that product. */
  productSlug: string;
  /** Screen-reader label for the video. */
  title: string;
  /** Show in the homepage reels strip. */
  homepage?: boolean;
  hidden?: boolean;
  /** On-screen wording flagged for FSSAI / ASCI review. Not rendered. */
  complianceNote?: string;
}

export const VIDEOS: ProductVideo[] = [
  // ── Prostate ──
  {
    id: 'prostate-ugc',
    src: '/videos/prostate.mp4',
    poster: '/videos/posters/prostate-ugc.webp',
    productSlug: 'advanced-prostate-care',
    title: 'Customer talks about Advanced Prostate Care',
    homepage: true,
  },
  {
    id: 'prostate-ingredients',
    src: '/videos/weight.mp4',
    poster: '/videos/posters/prostate-ingredients.webp',
    productSlug: 'advanced-prostate-care',
    title: 'The ingredients in Advanced Prostate Care',
    complianceNote: 'Mentions Shilajit (not in the listed ingredients) and "antibacterial properties".',
  },
  {
    id: 'prostate-testimonial',
    src: '/videos/prostate-1.mp4',
    poster: '/videos/posters/prostate-testimonial.webp',
    productSlug: 'advanced-prostate-care',
    title: 'Customer testimonial — Advanced Prostate Care',
    complianceNote: 'Doctor-coat actor; "3 mahine ka complete course", "problem reduce".',
  },
  {
    id: 'prostate-doctor',
    src: '/videos/prostate-3.mp4',
    poster: '/videos/posters/prostate-doctor.webp',
    productSlug: 'advanced-prostate-care',
    title: 'Prostate health explained — Advanced Prostate Care',
    complianceNote: 'Doctor persona, surgery footage, "swelling reduce hogi", "mere patients ne".',
  },
  {
    id: 'prostate-story',
    src: '/videos/prostate-5.mp4',
    poster: '/videos/posters/prostate-story.webp',
    productSlug: 'advanced-prostate-care',
    title: 'A customer story — Advanced Prostate Care',
    complianceNote: '"third month tak prostate…", "unhone 1 din me".',
  },

  // ── Liver ──
  {
    id: 'liver-ugc',
    src: '/videos/liver.mp4',
    poster: '/videos/posters/liver-ugc.webp',
    productSlug: 'advanced-liver-detox',
    title: 'Customer talks about Advanced Liver Detox',
    homepage: true,
  },
  {
    id: 'liver-review',
    src: '/videos/liver-2.mp4',
    poster: '/videos/posters/liver-review.webp',
    productSlug: 'advanced-liver-detox',
    title: 'Customer review — Advanced Liver Detox',
    homepage: true,
    complianceNote: '"pehle 10 din", "result dekh ke".',
  },

  // ── Weight ──
  {
    id: 'weight-explainer',
    src: '/videos/weeight-2.mp4',
    poster: '/videos/posters/weight-explainer.webp',
    productSlug: 'weight-management-pro',
    title: 'How Weight Management Pro+ fits your routine',
    homepage: true,
  },
  {
    id: 'weight-journey',
    src: '/videos/weight%20management.mp4',
    poster: '/videos/posters/weight-journey.webp',
    productSlug: 'weight-management-pro',
    title: 'A weight management journey with Weight Management Pro+',
    complianceNote: 'Before/after weights ("89 KG"), "let your body heal", "support your hormones".',
  },
  {
    id: 'weight-fitness',
    src: '/videos/prostate-4.mp4',
    poster: '/videos/posters/weight-fitness.webp',
    productSlug: 'weight-management-pro',
    title: 'Weight Management Pro+ with an active lifestyle',
    complianceNote: '"60 Days – Visible Result", "Clinically Studied", "Faster Result".',
  },
];

export const homepageVideos = () => VIDEOS.filter((v) => v.homepage && !v.hidden);
export const videosForProduct = (slug: string) => VIDEOS.filter((v) => v.productSlug === slug && !v.hidden);
