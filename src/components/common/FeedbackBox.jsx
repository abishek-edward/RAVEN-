import React, { useState } from 'react';
import { useRaven } from '../../context/RavenContext';
import { ThumbsUp, ThumbsDown, CheckCircle2, MessageSquare, Send } from 'lucide-react';

export default function FeedbackBox({ referenceId = null, feedbackType = 'Report Experience', onComplete }) {
  const { addFeedback } = useRaven();
  const [rating, setRating] = useState(null); // 'useful' | 'not-useful'
  const [comment, setComment] = useState('');
  const [category, setCategory] = useState('Reporting experience');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    addFeedback({
      rating,
      category,
      comment: comment.trim(),
      referenceId,
      feedbackType
    });
    setSubmitted(true);
    if (onComplete) onComplete();
  };

  if (submitted) {
    return (
      <div className="p-3 bg-teal-50 border border-teal-200 rounded-lg text-xs text-teal-900 flex items-center gap-2">
        <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
        <span>Thank you for your feedback. It helps us improve the civic reporting experience.</span>
      </div>
    );
  }

  return (
    <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-3">
      <div className="flex items-center justify-between">
        <div className="font-semibold text-slate-800 flex items-center gap-1.5">
          <MessageSquare className="w-3.5 h-3.5 text-teal-700" />
          <span>Was this reporting experience useful?</span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setRating('useful')}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold transition ${
              rating === 'useful'
                ? 'bg-teal-700 text-white'
                : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <ThumbsUp className="w-3.5 h-3.5" />
            <span>👍 Yes</span>
          </button>

          <button
            type="button"
            onClick={() => setRating('not-useful')}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold transition ${
              rating === 'not-useful'
                ? 'bg-rose-700 text-white'
                : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <ThumbsDown className="w-3.5 h-3.5" />
            <span>👎 No</span>
          </button>
        </div>
      </div>

      {(rating || feedbackType === 'General Feedback') && (
        <form onSubmit={handleSubmit} className="space-y-2 pt-2 border-t border-slate-200/70">
          {feedbackType === 'General Feedback' && (
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-xs p-1.5 rounded border border-slate-300 bg-white"
              >
                <option value="Reporting experience">Reporting experience</option>
                <option value="Scheme information">Scheme information</option>
                <option value="Civic issue tracking">Civic issue tracking</option>
                <option value="Accessibility">Accessibility</option>
                <option value="Other">Other</option>
              </select>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              What could we improve? (Optional)
            </label>
            <textarea
              rows={2}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell us what worked or how to make this civic tool better..."
              className="w-full text-xs p-2 rounded border border-slate-300 bg-white focus:ring-1 focus:ring-slate-800"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition"
            >
              <Send className="w-3 h-3" />
              <span>Submit Feedback</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
