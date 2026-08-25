import React from "react";
import { Star } from "lucide-react";

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  size?: number;
}

export const StarRating: React.FC<StarRatingProps> = ({
  value,
  onChange,
  size = 20,
}) => {
  const isInteractive = !!onChange;

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!isInteractive}
          onClick={() => onChange?.(star)}
          className={isInteractive ? "cursor-pointer" : "cursor-default"}
        >
          <Star
            size={size}
            className={
              star <= value ? "fill-[#E50914] text-[#E50914]" : "text-zinc-600"
            }
          />
        </button>
      ))}
    </div>
  );
};
