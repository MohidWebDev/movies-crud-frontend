import React from "react";
import { StarRating } from "./StarRating";
import { Review } from "../types";

interface ReviewCardProps {
  review: Review;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  const formattedDate = new Date(review.createdAt).toLocaleDateString(
    undefined,
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    },
  );

  return (
    <div className="h-full flex flex-col bg-[#121212] border border-zinc-800 rounded-xl p-4 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-white">
          {review.reviewerName}
        </span>
        <span className="text-xs text-zinc-500">{formattedDate}</span>
      </div>
      <StarRating value={review.rating} size={16} />
      {review.comment && (
        <p className="text-sm text-zinc-400">{review.comment}</p>
      )}
    </div>
  );
};
