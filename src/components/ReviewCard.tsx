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
    <div className="h-full min-h-52 flex flex-col bg-[#121212] border border-zinc-800 rounded-xl p-5 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-base font-semibold text-white">
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
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
      <StarRating value={review.rating} size={18} />
      {review.comment ? (
        <p className="text-sm text-zinc-400 leading-relaxed">
          {review.comment}
        </p>
      ) : (
        <p className="text-sm text-zinc-600 italic">No comment left.</p>
      )}
    </div>
  );
};
