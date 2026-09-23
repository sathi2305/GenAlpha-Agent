import React, { useState } from "react";
import { ThumbsUp, ThumbsDown, X, Check } from "lucide-react";

interface FeedbackModalProps {
  isOpen: boolean;
  messageId: string | null;
  initialRating: 'positive' | 'negative' | null;
  onClose: () => void;
  onSubmit: (messageId: string, rating: 'positive' | 'negative', comment: string) => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  messageId,
  initialRating,
  onClose,
  onSubmit
}) => {
  const [rating, setRating] = useState<'positive' | 'negative'>(initialRating || 'positive');
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen || !messageId) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(messageId, rating, comment);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setComment("");
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div 
        id="feedback-modal-card"
        className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-2xl relative text-zinc-100"
      >
        <button
          id="close-feedback-btn"
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-200 p-1 rounded-lg hover:bg-zinc-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-6">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-3">
              <Check className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-white">Thank You for Your Feedback!</h3>
            <p className="text-sm text-zinc-400 mt-1">Your feedback helps improve our multi-agent routing and safety accuracy.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <h3 className="text-lg font-semibold text-white mb-2">Provide Response Feedback</h3>
            <p className="text-xs text-zinc-400 mb-4">
              Help our AI Orchestrator optimize agent selection, accuracy, and safety compliance.
            </p>

            <div className="flex gap-3 mb-4">
              <button
                type="button"
                id="feedback-positive-btn"
                onClick={() => setRating("positive")}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border text-sm font-medium transition ${
                  rating === "positive"
                    ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-300"
                    : "bg-zinc-800/60 border-zinc-700/60 text-zinc-400 hover:bg-zinc-800"
                }`}
              >
                <ThumbsUp className="w-4 h-4" />
                Helpful & Accurate
              </button>
              <button
                type="button"
                id="feedback-negative-btn"
                onClick={() => setRating("negative")}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border text-sm font-medium transition ${
                  rating === "negative"
                    ? "bg-rose-500/20 border-rose-500/50 text-rose-300"
                    : "bg-zinc-800/60 border-zinc-700/60 text-zinc-400 hover:bg-zinc-800"
                }`}
              >
                <ThumbsDown className="w-4 h-4" />
                Needs Improvement
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                Optional Details (What went well or what was missing?)
              </label>
              <textarea
                id="feedback-comment-input"
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="E.g., Great breakdown of the scam attack stages, or wanted deeper code details..."
                className="w-full bg-zinc-800/80 border border-zinc-700 rounded-lg p-3 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                id="cancel-feedback-btn"
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-sm text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                id="submit-feedback-btn"
                className="px-5 py-2 rounded-lg text-sm font-medium bg-blue-600 hover:bg-blue-500 text-white transition shadow-sm"
              >
                Submit Feedback
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
