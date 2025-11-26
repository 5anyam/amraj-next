'use client';

import React, { useEffect, useState } from 'react';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon, CheckBadgeIcon, ChatBubbleLeftEllipsisIcon } from '@heroicons/react/24/outline';
import { toast } from '../hooks/use-toast';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

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

const ProductReviews: React.FC<ProductReviewsProps> = ({ productId, productName }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [expandedReviews, setExpandedReviews] = useState<Set<number>>(new Set());

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
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => interactive && onChange?.(star)}
          className={`${
            interactive ? 'cursor-pointer hover:scale-110 active:scale-95' : 'cursor-default'
          } transition-transform duration-200`}
          aria-label={`Rate ${star}`}
          disabled={!interactive}
        >
          {star <= rating ? (
            <StarIcon className="h-5 w-5 text-amber-400" />
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

  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: reviews.filter((r) => r.rating === rating).length,
    percentage: reviews.length > 0 ? (reviews.filter((r) => r.rating === rating).length / reviews.length) * 100 : 0,
  }));

  const toggleExpandReview = (reviewId: number) => {
    setExpandedReviews((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(reviewId)) {
        newSet.delete(reviewId);
      } else {
        newSet.add(reviewId);
      }
      return newSet;
    });
  };

  return (
    <section id="reviews-section" className="bg-white rounded-2xl shadow-sm border border-gray-200">
      {/* Modern Header with Stats */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-gray-900 font-bold text-xl sm:text-2xl flex items-center gap-2">
            <ChatBubbleLeftEllipsisIcon className="h-6 w-6 sm:h-7 sm:w-7 text-emerald-600" />
            Customer Reviews
          </h2>
          <button
            onClick={() => setShowForm((s) => !s)}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            {showForm ? 'Cancel' : '✍️ Write Review'}
          </button>
        </div>

        {/* Rating Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Average Rating */}
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-5xl font-bold text-gray-900">{averageRating > 0 ? averageRating.toFixed(1) : '0.0'}</div>
              <StarRating rating={Math.round(averageRating)} />
              <p className="text-sm text-gray-600 mt-1">
                Based on {reviews.length} review{reviews.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-2">
            {ratingDistribution.map((dist) => (
              <div key={dist.rating} className="flex items-center gap-2">
                <div className="flex items-center gap-1 w-16">
                  <span className="text-sm font-medium text-gray-700">{dist.rating}</span>
                  <StarIcon className="h-4 w-4 text-amber-400" />
                </div>
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all duration-500"
                    style={{ width: `${dist.percentage}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600 w-12 text-right">{dist.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Review Form */}
        {showForm && (
          <div className="mb-8 p-6 bg-gradient-to-br from-emerald-50 to-blue-50 rounded-xl border-2 border-emerald-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Share Your Experience</h3>
            <form onSubmit={submitReview} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.reviewer}
                    onChange={(e) => setFormData((s) => ({ ...s, reviewer: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email (optional)</label>
                  <input
                    type="email"
                    value={formData.reviewer_email}
                    onChange={(e) => setFormData((s) => ({ ...s, reviewer_email: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Your Rating *</label>
                <StarRating
                  rating={formData.rating}
                  onChange={(v) => setFormData((s) => ({ ...s, rating: v }))}
                  interactive
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Your Review *</label>
                <textarea
                  required
                  value={formData.review}
                  onChange={(e) => setFormData((s) => ({ ...s, review: e.target.value }))}
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all resize-none"
                  placeholder="Share your experience with this product..."
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className={`w-full sm:w-auto px-6 py-3 rounded-xl text-base font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-all duration-200 shadow-md hover:shadow-lg ${
                  submitting ? 'opacity-60 cursor-not-allowed' : ''
                }`}
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Submitting...
                  </span>
                ) : (
                  'Submit Review'
                )}
              </button>
            </form>
          </div>
        )}

        {/* Reviews Slider */}
        {loading ? (
          <div className="py-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-600 text-base">Loading reviews...</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="py-12 text-center">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ChatBubbleLeftEllipsisIcon className="h-10 w-10 text-emerald-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No reviews yet</h3>
            <p className="text-gray-600 mb-4">Be the first to share your experience with {productName}!</p>
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-3 rounded-xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-all"
            >
              Write First Review
            </button>
          </div>
        ) : (
          <>
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={20}
              slidesPerView={1}
              navigation
              pagination={{ clickable: true }}
              autoplay={{ delay: 5000, disableOnInteraction: false }}
              breakpoints={{
                640: {
                  slidesPerView: 1,
                },
                768: {
                  slidesPerView: 2,
                },
                1024: {
                  slidesPerView: 3,
                },
              }}
              className="reviews-swiper pb-12"
            >
              {reviews.map((r) => {
                const isExpanded = expandedReviews.has(r.id);
                const isLongReview = r.review.length > 250;
                const displayReview = isExpanded || !isLongReview ? r.review : r.review.slice(0, 250) + '...';

                return (
                  <SwiperSlide key={r.id}>
                    <div className="p-5 rounded-xl border-2 border-gray-200 bg-white hover:border-emerald-300 hover:shadow-md transition-all duration-200 h-full flex flex-col">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                              {(r.reviewer || 'A')[0].toUpperCase()}
                            </div>
                            <div>
                              <p className="font-bold text-gray-900 text-base">{r.reviewer || 'Anonymous'}</p>
                              <div className="flex items-center gap-2">
                                <CheckBadgeIcon className="h-4 w-4 text-emerald-600" />
                                <span className="text-xs font-semibold text-emerald-700">Verified Purchase</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mb-3">
                        <StarRating rating={r.rating || 0} />
                      </div>

                      <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap flex-grow">{displayReview}</p>

                      {isLongReview && (
                        <button
                          onClick={() => toggleExpandReview(r.id)}
                          className="mt-2 text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors text-left"
                        >
                          {isExpanded ? 'Show Less' : 'Read More'}
                        </button>
                      )}

                      {Array.isArray(r.images) && r.images.length > 0 && (
                        <div className="mt-4 grid grid-cols-2 gap-2">
                          {r.images.slice(0, 4).map((src, i) => (
                            <img
                              key={`${r.id}-${i}`}
                              src={src}
                              alt="Review photo"
                              className="w-full h-20 object-cover rounded-lg border-2 border-gray-200 hover:border-emerald-400 transition-all cursor-pointer"
                              loading="lazy"
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>

            {/* Review Counter */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Total <span className="font-bold text-emerald-600">{reviews.length}</span> reviews
              </p>
            </div>
          </>
        )}
      </div>

      <style jsx global>{`
        .reviews-swiper .swiper-button-next,
        .reviews-swiper .swiper-button-prev {
          color: #059669;
          background: white;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        
        .reviews-swiper .swiper-button-next:after,
        .reviews-swiper .swiper-button-prev:after {
          font-size: 18px;
          font-weight: bold;
        }
        
        .reviews-swiper .swiper-pagination-bullet {
          background: #059669;
          opacity: 0.3;
          width: 10px;
          height: 10px;
        }
        
        .reviews-swiper .swiper-pagination-bullet-active {
          opacity: 1;
          width: 24px;
          border-radius: 5px;
        }
      `}</style>
    </section>
  );
};

export default ProductReviews;
