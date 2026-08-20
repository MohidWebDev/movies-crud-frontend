import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Trash2, X } from "lucide-react";
import { Movie } from "../types";

interface DeleteModalProps {
  movie: Movie | null;
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteModal: React.FC<DeleteModalProps> = ({
  movie,
  isOpen,
  onConfirm,
  onCancel,
}) => {
  return (
    <AnimatePresence>
      {isOpen && movie && (
        <div
          id="delete-modal-overlay"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Backdrop fade */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal Dialog with elastic scale-up */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 15 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="relative w-full max-w-md bg-[#161616] border border-zinc-800 rounded-2xl p-6 shadow-2xl z-10"
          >
            <button
              id="close-delete-modal-btn"
              onClick={onCancel}
              className="absolute top-4 right-4 text-zinc-500 hover:text-white p-1 rounded-lg hover:bg-zinc-800/60 transition-colors cursor-pointer focus:outline-none"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-950/80 border border-red-800 flex items-center justify-center text-[#E50914] shrink-0">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white font-display">
                  Delete Movie?
                </h3>
                <p className="text-xs text-zinc-400">
                  This action cannot be undone.
                </p>
              </div>
            </div>

            <p className="text-sm text-zinc-300 mb-6 bg-zinc-900/70 p-3.5 rounded-xl border border-zinc-800/80">
              Are you sure you want to remove{" "}
              <span className="font-bold text-white font-display">
                "{movie.title}"
              </span>{" "}
              from your cinema archive?
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                id="cancel-delete-btn"
                onClick={onCancel}
                className="px-5 py-2.5 rounded-xl bg-[#222222] hover:bg-[#2c2c2c] text-zinc-300 text-sm font-semibold border border-zinc-700 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                id="confirm-delete-btn"
                onClick={onConfirm}
                className="px-5 py-2.5 rounded-xl bg-[#E50914] hover:bg-[#F40612] text-white text-sm font-bold shadow-[0_0_15px_rgba(229,9,20,0.5)] transition-all cursor-pointer"
              >
                Delete Movie
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
