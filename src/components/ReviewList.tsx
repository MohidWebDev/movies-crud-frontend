import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ReviewCard } from "./ReviewCard";
import { Review } from "../types";

interface ReviewListProps {
  reviews: Review[];
  isLoading?: boolean;
  error?: string | null;
  isAdmin?: boolean;
  onDeleteReview?: (reviewId: string) => void;
}

const REVIEWS_PER_PAGE = 4;

export const ReviewList: React.FC<ReviewListProps> = ({
  reviews,
  isLoading,
  error,
  isAdmin,
  onDeleteReview,
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  if (isLoading) {
    return <p className="text-sm text-zinc-400">Loading reviews...</p>;
  }

  if (error) {
    return <p className="text-sm text-red-400">{error}</p>;
  }

  if (reviews.length === 0) {
    return (
      <p className="text-sm text-zinc-400">No reviews yet — be the first!</p>
    );
  }

  const totalPages = Math.ceil(reviews.length / REVIEWS_PER_PAGE);
  const start = (currentPage - 1) * REVIEWS_PER_PAGE;
  const pageReviews = reviews.slice(start, start + REVIEWS_PER_PAGE);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {pageReviews.map((review) => (
          <ReviewCard
            key={review.id}
            review={review}
            isAdmin={isAdmin}
            onDelete={onDeleteReview}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            aria-label="Previous page"
            className="p-1.5 rounded-full border border-zinc-700 text-zinc-300 hover:border-[#E50914] hover:text-[#E50914] disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs text-zinc-500">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            aria-label="Next page"
            className="p-1.5 rounded-full border border-zinc-700 text-zinc-300 hover:border-[#E50914] hover:text-[#E50914] disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
