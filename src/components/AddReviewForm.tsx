import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { StarRating } from "./StarRating";
import { createReview } from "../services/reviewApi";
import { useAuth } from "../context/AuthContext";
import { queryKeys } from "../queryKeys";

interface AddReviewFormProps {
  movieId: string;
}

export const AddReviewForm: React.FC<AddReviewFormProps> = ({ movieId }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    mutate: submitReview,
    isPending: isSubmitting,
    error,
  } = useMutation({
    mutationFn: () =>
      createReview(movieId, { rating, comment: comment.trim() || undefined }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.reviews.byMovie(movieId),
      });
      setRating(0);
      setComment("");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || rating === 0) return;
    submitReview();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full space-y-4 bg-[#121212] border border-zinc-800 rounded-2xl p-6"
    >
      <h3 className="text-lg font-bold text-white">Write a Review</h3>

      {error && (
        <p className="text-sm text-red-400">
          {error instanceof Error ? error.message : "Failed to add review"}
        </p>
      )}

      <div>
        <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
          Rating *
        </label>
        <StarRating value={rating} onChange={setRating} size={24} />
      </div>

      <div>
        <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
          Comment (optional)
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          className="w-full px-4 py-2.5 rounded-xl bg-[#181818] border border-zinc-800 text-white text-sm focus:outline-none focus:border-[#E50914] focus:ring-2 focus:ring-[#E50914]/20"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="px-6 py-2.5 rounded-xl bg-[#E50914] hover:bg-[#F40612] text-white text-sm font-bold shadow-[0_0_15px_rgba(229,9,20,0.4)] transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
};
