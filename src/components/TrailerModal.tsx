import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { getYouTubeEmbedUrl } from "../utils/youtube";

interface TrailerModalProps {
  videoId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export const TrailerModal: React.FC<TrailerModalProps> = ({
  videoId,
  isOpen,
  onClose,
}) => {
  return (
    <AnimatePresence>
      {isOpen && videoId && (
        <div
          id="trailer-modal-overlay"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 15 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="relative w-full max-w-3xl z-10"
          >
            <button
              onClick={onClose}
              className="absolute -top-10 right-0 text-zinc-400 hover:text-white p-1.5 rounded-lg hover:bg-zinc-800/60 transition-colors cursor-pointer focus:outline-none"
              aria-label="Close trailer"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-zinc-800 shadow-2xl bg-black">
              <iframe
                src={getYouTubeEmbedUrl(videoId)}
                title="Movie Trailer"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
