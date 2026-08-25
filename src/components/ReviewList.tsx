import React from "react";
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
    <div className="space-y-3">
      {reviews.map((review) => (
        <ReviewCard key={review.id} review={review} />
      ))}
    </div>
  );
};
