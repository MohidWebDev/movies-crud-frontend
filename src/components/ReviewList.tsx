import React, { useRef, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ReviewCard } from "./ReviewCard";
import { Review } from "../types";

interface ReviewListProps {
  reviews: Review[];
  isLoading?: boolean;
  error?: string | null;
}

export const ReviewList: React.FC<ReviewListProps> = ({
  reviews,
  isLoading,
  error,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollButtons = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  }, []);

  useEffect(() => {
    updateScrollButtons();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateScrollButtons);
    window.addEventListener("resize", updateScrollButtons);
    return () => {
      el.removeEventListener("scroll", updateScrollButtons);
      window.removeEventListener("resize", updateScrollButtons);
    };
  }, [updateScrollButtons, reviews]);

  const scrollByCard = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-review-card]");
    const cardWidth = card ? card.offsetWidth + 12 : 280; // +12 for gap
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
        {reviews.map((review) => (
          <div
            key={review.id}
            data-review-card
            className="snap-start shrink-0 w-72 sm:w-80"
          >
            <ReviewCard review={review} />
          </div>
        ))}
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
