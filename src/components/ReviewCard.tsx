import React from "react";
import { Trash2 } from "lucide-react";
import { StarRating } from "./StarRating";
import { Review } from "../types";

interface ReviewCardProps {
  review: Review;
  isAdmin?: boolean;
  onDelete?: (reviewId: string) => void;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({
  review,
  isAdmin,
  onDelete,
}) => {
  const formattedDate = new Date(review.createdAt).toLocaleDateString(
    undefined,
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    },
  );

  const handleDeleteClick = () => {
    onDelete?.(review.id);
  };

  return (
    <div className="h-full flex flex-col bg-[#121212] border border-zinc-800 rounded-xl p-4 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-white">
          {review.reviewerName}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-500">{formattedDate}</span>
          {isAdmin && (
            <button
              onClick={handleDeleteClick}
              aria-label="Delete review"
              className="text-zinc-600 hover:text-red-500 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
      <StarRating value={review.rating} size={16} />
      {review.comment && (
        <p className="text-sm text-zinc-400">{review.comment}</p>
      )}
    </div>
  );
};
