import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { StarRating } from "./StarRating";
import { Review } from "../types";

interface CommentModalProps {
  review: Review | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CommentModal: React.FC<CommentModalProps> = ({
  review,
  isOpen,
  onClose,
}) => {
  const formattedDate = review
    ? new Date(review.createdAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "";

  return (
    <AnimatePresence>
      {isOpen && review && (
        <div
          id="comment-modal-overlay"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 15 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="relative w-full max-w-md bg-[#161616] border border-zinc-800 rounded-2xl p-6 shadow-2xl z-10 max-h-[80vh] overflow-y-auto"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-zinc-500 hover:text-white p-1 rounded-lg hover:bg-zinc-800/60 transition-colors cursor-pointer focus:outline-none"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="pr-8 mb-3">
              <div className="flex items-center justify-between">
                <span className="text-base font-semibold text-white">
                  {review.reviewerName}
                </span>
                <span className="text-xs text-zinc-500">{formattedDate}</span>
              </div>
              <StarRating value={review.rating} size={18} />
            </div>

            <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">
              {review.comment}
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
