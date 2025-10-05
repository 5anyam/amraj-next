'use client';

import React, { useEffect, useState } from 'react';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon, CheckBadgeIcon } from '@heroicons/react/24/outline';
import { toast } from '../hooks/use-toast';

interface Review {
  id: number;
  date_created?: string;
  reviewer: string;
  reviewer_email?: string;
  review: string;
  rating: number;
  images?: string[];
}

interface ProductReviewsProps {
  productId: number;
  productName: string;
}

/** WooCommerce reviews API shape (subset we use) */
interface ApiMetaItem {
  key: string;
  value: unknown;
}
interface ApiReview {
  id: number;
  date_created?: string;
  reviewer?: string;
  reviewer_email?: string;
  review?: string;
  rating?: number;
  meta_data?: ApiMetaItem[];
}

const isApiMetaItem = (m: unknown): m is ApiMetaItem =>
  typeof m === 'object' &&
  m !== null &&
  'key' in m &&
  'value' in m &&
  typeof (m as Record<string, unknown>).key === 'string';

const isApiReview = (r: unknown): r is ApiReview =>
  typeof r === 'object' &&
  r !== null &&
  typeof (r as Record<string, unknown>).id === 'number';

const stripHtml = (html: string): string => {
  if (!html) return '';
  const noP = html.replace(/<\/?p[^>]*>/gi, '\n').replace(/<br\s*\/?>/gi, '\n');
  const text = noP.replace(/<[^>]+>/g, '');
  return text.replace(/\n{3,}/g, '\n\n').trim();
};

const REVIEWS_PER_PAGE = 4; // Show 4 reviews initially

const ProductReviews: React.FC<ProductReviewsProps> = ({ productId, productName }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [visibleCount, setVisibleCount] = useState<number>(REVIEWS_PER_PAGE); // Track visible reviews

  const [formData, setFormData] = useState<{
    reviewer: string;
    reviewer_email: string;
    review: string;
    rating: number;
  }>({
    reviewer: '',
    reviewer_email: '',
    review: '',
    rating: 0,
  });

  const API_BASE = 'https://cms.amraj.in/wp-json/wc/v3';
  const CONSUMER_KEY = 'ck_7610f309972822bfa8e87304ea6c47e9e93b8ff6';
  const CONSUMER_SECRET = 'cs_0f117bc7ec4611ca378adde03010f619c0af59b2';

  useEffect(() => {
    if (productId) {
      void loadReviews();
    }
  }, [productId]);

  const parseImageUrlsFromMeta = (meta?: ApiMetaItem[]): string[] | undefined => {
    if (!Array.isArray(meta)) return undefined;
    const urlsItem = meta.find((m) => isApiMetaItem(m) && m.key === 'amraj_review_image_urls');
    if (!urlsItem) return undefined;
    const v = urlsItem.value;
    if (Array.isArray(v) && v.every((x) => typeof x === 'string')) {
      return v as string[];
    }
    return undefined;
  };

  const loadReviews = async (): Promise<void> => {
    try {
      setLoading(true);

      const url =
        `${API_BASE}/products/reviews?product=${productId}` +
        `&consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}` +
        `&per_page=100&status=approved`;

      const res = await fetch(url);
      if (!res.ok) {
        setReviews([]);
        return;
      }

      const data: unknown = await res.json();
      const list: ApiReview[] = Array.isArray(data) ? data.filter(isApiReview) : [];

      const mapped: Review[] = list.map((rev) => {
        const images = parseImageUrlsFromMeta(rev.meta_data);
        return {
          id: rev.id,
          reviewer: rev.reviewer ? String(rev.reviewer) : 'Anonymous',
          reviewer_email: rev.reviewer_email ? String(rev.reviewer_email) : undefined,
          review: stripHtml(rev.review ? String(rev.review) : ''),
          rating: typeof rev.rating === 'number' ? rev.rating : 0,
          date_created: rev.date_created ? String(rev.date_created) : undefined,
          images,
        };
      });

      setReviews(mapped);
    } catch {
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const submitReview = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!formData.reviewer || !formData.review || formData.rating === 0) {
      toast({
        title: 'Error',
        description: 'Please fill all fields and select a rating',
        variant: 'destructive',
      });
      return;
    }
    setSubmitting(true);
    try {
      const url =
        `${API_BASE}/products/reviews?consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}`;

      const payload = {
        product_id: productId,
        review: formData.review,
        reviewer: formData.reviewer,
        reviewer_email: formData.reviewer_email || '',
        rating: formData.rating,
        status: 'approved',
      } as const;

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errTxt = await res.text();
        throw new Error(errTxt || 'Failed to submit review');
      }

      toast({ title: 'Thank you!', description: 'Review submitted successfully.' });
      setFormData({ reviewer: '', reviewer_email: '', review: '', rating: 0 });
      setShowForm(false);
      await loadReviews();
    } catch (err) {
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to submit review',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const StarRating = ({
    rating,
    onChange,
    interactive = false,
  }: {
    rating: number;
    onChange?: (value: number) => void;
    interactive?: boolean;
  }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => interactive && onChange?.(star)}
          className={`${interactive ? 'cursor-pointer active:scale-95' : 'cursor-default'} transition-transform`}
          aria-label={`Rate ${star}`}
          disabled={!interactive}
        >
          {star <= rating ? (
            <StarIcon className="h-5 w-5 text-yellow-400" />
          ) : (
            <StarOutlineIcon className="h-5 w-5 text-gray-300" />
          )}
        </button>
      ))}
    </div>
  );

  const averageRating =
    reviews.length > 0
      ? reviews.reduce<number>((acc, r) => acc + (r.rating || 0), 0) / reviews.length
      : 0;

  // Get visible reviews based on visibleCount
  const visibleReviews = reviews.slice(0, visibleCount);
  const hasMore = visibleCount < reviews.length;

  // Handle "Show More" button click
  const handleShowMore = () => {
    setVisibleCount(prev => Math.min(prev + REVIEWS_PER_PAGE, reviews.length));
  };

  // Handle "Show Less" button click
  const handleShowLess = () => {
    setVisibleCount(REVIEWS_PER_PAGE);
    // Scroll to reviews section
    const reviewsSection = document.getElementById('reviews-list');
    if (reviewsSection) {
      reviewsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="bg-white rounded-2xl shadow border border-gray-100">
      {/* Header */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-teal-500 to-orange-500">
        <div className="flex items-center justify-between">
          <h2 className="text-white font-bold text-lg sm:text-xl">Customer Reviews</h2>
          <span className="text-white/90 text-xs sm:text-sm">
            {reviews.length} review{reviews.length !== 1 ? 's' : ''}
          </span>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <StarRating rating={Math.round(averageRating)} />
          <span className="text-white font-semibold text-sm sm:text-base">
            {averageRating > 0 ? averageRating.toFixed(1) : '0.0'}
          </span>
        </div>
      </div>

      <div className="p-4 sm:p-6">
        {/* Toggle */}
        <div className="mb-4 sm:mb-6">
          <button
            onClick={() => setShowForm((s) => !s)}
            className="w-full sm:w-auto px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-teal-500 to-orange-500 hover:from-teal-600 hover:to-orange-600 transition"
          >
            {showForm ? 'Cancel' : '✍️ Write a Review'}
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <form onSubmit={submitReview} className="mb-6 space-y-3 sm:space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Name *</label>
                <input
                  type="text"
                  required
                  value={formData.reviewer}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData((s) => ({ ...s, reviewer: e.target.value }))
                  }
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 outline-none text-sm"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Email (optional)</label>
                <input
                  type="email"
                  value={formData.reviewer_email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData((s) => ({ ...s, reviewer_email: e.target.value }))
                  }
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 outline-none text-sm"
                  placeholder="your.email@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Rating *</label>
              <StarRating
                rating={formData.rating}
                onChange={(v: number) => setFormData((s) => ({ ...s, rating: v }))}
                interactive
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Review *</label>
              <textarea
                required
                value={formData.review}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setFormData((s) => ({ ...s, review: e.target.value }))
                }
                rows={4}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 outline-none text-sm resize-none"
                placeholder="Share your experience…"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className={`w-full sm:w-auto px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-teal-500 to-orange-500 hover:from-teal-600 hover:to-orange-600 transition ${
                submitting ? 'opacity-60 cursor-not-allowed' : ''
              }`}
            >
              {submitting ? 'Submitting…' : 'Submit Review'}
            </button>
          </form>
        )}

        {/* Reviews */}
        {loading ? (
          <div className="py-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-teal-500 border-t-transparent mx-auto"></div>
            <p className="text-gray-600 text-sm mt-2">Loading reviews…</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="py-8 text-center">
            <div className="text-5xl mb-2">⭐</div>
            <p className="text-gray-600 text-sm">Be the first to review {productName}!</p>
          </div>
        ) : (
          <>
            <ul id="reviews-list" className="space-y-4 sm:space-y-5">
              {visibleReviews.map((r) => (
                <li
                  key={r.id}
                  className="p-4 sm:p-5 rounded-xl border border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      {/* Verified Badge */}
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-gray-900 text-sm sm:text-base">
                          {r.reviewer || 'Anonymous'}
                        </p>
                        <div className="flex items-center gap-1 px-2 py-0.5 bg-teal-100 rounded-full border border-teal-300">
                          <CheckBadgeIcon className="h-4 w-4 text-teal-600" />
                          <span className="text-xs font-semibold text-teal-700">Verified</span>
                        </div>
                      </div>
                      <div className="mt-1 flex items-center gap-2">
                        <StarRating rating={r.rating || 0} />
                        {r.date_created && (
                          <span className="text-xs text-gray-500">
                            {new Date(r.date_created).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <p className="mt-3 text-gray-700 text-sm sm:text-base whitespace-pre-wrap">
                    {stripHtml(r.review || '')}
                  </p>

                  {Array.isArray(r.images) && r.images.length > 0 && (
                    <div className="mt-3 grid grid-cols-3 gap-2">
                      {r.images.map((src, i) => (
                        <img
                          key={`${r.id}-${i}`}
                          src={src}
                          alt="Review photo"
                          className="w-full h-24 sm:h-28 object-cover rounded-md border border-gray-200"
                          loading="lazy"
                        />
                      ))}
                    </div>
                  )}
                </li>
              ))}
            </ul>

            {/* Show More / Show Less Buttons */}
            {(hasMore || visibleCount > REVIEWS_PER_PAGE) && (
              <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                {hasMore && (
                  <button
                    onClick={handleShowMore}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-teal-500 to-orange-500 hover:from-teal-600 hover:to-orange-600 transition-all transform hover:-translate-y-0.5 shadow-md hover:shadow-lg"
                  >
                    Show More Reviews ({reviews.length - visibleCount} remaining)
                  </button>
                )}
                
                {visibleCount > REVIEWS_PER_PAGE && (
                  <button
                    onClick={handleShowLess}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl text-sm font-semibold text-gray-700 bg-white border-2 border-gray-300 hover:border-teal-500 hover:text-teal-600 transition-all"
                  >
                    Show Less
                  </button>
                )}
              </div>
            )}

            {/* Review Counter */}
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Showing <span className="font-semibold text-teal-600">{visibleReviews.length}</span> of{' '}
                <span className="font-semibold text-teal-600">{reviews.length}</span> reviews
              </p>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default ProductReviews;
