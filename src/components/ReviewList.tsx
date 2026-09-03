import React, { useRef, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, ChevronsUp } from "lucide-react";
import { ReviewCard } from "./ReviewCard";
import { Review } from "../types";

interface ReviewListProps {
  reviews: Review[];
  isLoading?: boolean;
  error?: string | null;
}

const VISIBLE_IN_CAROUSEL = 4;
const REVIEWS_PER_PAGE = 6;

export const ReviewList: React.FC<ReviewListProps> = ({
  reviews,
  isLoading,
  error,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const updateScrollButtons = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  }, []);

  useEffect(() => {
    if (isExpanded) return;
    updateScrollButtons();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateScrollButtons);
    window.addEventListener("resize", updateScrollButtons);
    return () => {
      el.removeEventListener("scroll", updateScrollButtons);
      window.removeEventListener("resize", updateScrollButtons);
    };
  }, [updateScrollButtons, reviews, isExpanded]);

  const scrollByCard = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-review-card]");
    const cardWidth = card ? card.offsetWidth + 12 : 280;
    el.scrollBy({
      left: direction === "left" ? -cardWidth : cardWidth,
      behavior: "smooth",
    });
  };

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

  // EXPANDED VIEW — paginated grid
  if (isExpanded) {
    const totalPages = Math.ceil(reviews.length / REVIEWS_PER_PAGE);
    const start = (currentPage - 1) * REVIEWS_PER_PAGE;
    const pageReviews = reviews.slice(start, start + REVIEWS_PER_PAGE);

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {pageReviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>

        <div className="flex items-center justify-between pt-1">
          <button
            onClick={() => {
              setIsExpanded(false);
              setCurrentPage(1);
            }}
            className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <ChevronsUp className="w-4 h-4" />
            Show Less
          </button>

          {totalPages > 1 && (
            <div className="flex items-center gap-3">
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
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                aria-label="Next page"
                className="p-1.5 rounded-full border border-zinc-700 text-zinc-300 hover:border-[#E50914] hover:text-[#E50914] disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // COLLAPSED VIEW — carousel, capped at 4 + "See More" tile
  const carouselReviews = reviews.slice(0, VISIBLE_IN_CAROUSEL);
  const hasMore = reviews.length > VISIBLE_IN_CAROUSEL;

  return (
    <div className="relative">
      {canScrollLeft && (
        <button
          onClick={() => scrollByCard("left")}
          aria-label="Scroll reviews left"
          className="absolute -left-2 sm:left-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-[#121212]/90 border border-zinc-700 text-white hover:border-[#E50914] hover:text-[#E50914] transition-all cursor-pointer shadow-lg"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      )}

      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hide px-1 py-1"
      >
        {carouselReviews.map((review) => (
          <div
            key={review.id}
            data-review-card
            className="snap-start shrink-0 w-72 sm:w-80"
          >
            <ReviewCard review={review} />
          </div>
        ))}

        {hasMore && (
          <div data-review-card className="snap-start shrink-0 w-72 sm:w-80">
            <button
              onClick={() => setIsExpanded(true)}
              className="h-full w-full flex flex-col items-center justify-center gap-1 bg-[#121212] border border-zinc-800 hover:border-[#E50914] rounded-xl p-4 transition-colors cursor-pointer"
            >
              <span className="text-sm font-semibold text-white">See More</span>
              <span className="text-xs text-zinc-500">
                {reviews.length - VISIBLE_IN_CAROUSEL} more review
                {reviews.length - VISIBLE_IN_CAROUSEL !== 1 ? "s" : ""}
              </span>
            </button>
          </div>
        )}
      </div>

      {canScrollRight && (
        <button
          onClick={() => scrollByCard("right")}
          aria-label="Scroll reviews right"
          className="absolute -right-2 sm:right-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-[#121212]/90 border border-zinc-700 text-white hover:border-[#E50914] hover:text-[#E50914] transition-all cursor-pointer shadow-lg"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
