import React, { useState } from 'react';
import { useRaven } from '../../context/RavenContext';
import { ThumbsUp, ThumbsDown, CheckCircle2, MessageSquare, Send } from 'lucide-react';

export default function FeedbackBox({ referenceId = null, feedbackType = 'Report Experience', onComplete }) {
  const { addFeedback, t } = useRaven();
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
      <div className="p-3 bg-teal-50 dark:bg-teal-950/50 border border-teal-200 dark:border-teal-800 rounded-lg text-xs text-teal-900 dark:text-teal-200 flex items-center gap-2">
        <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
        <span>{t('thankYouFeedback')}</span>
      </div>
    );
  }

  return (
    <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-xs space-y-3">
      <div className="flex items-center justify-between">
        <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
          <MessageSquare className="w-3.5 h-3.5 text-teal-700 dark:text-teal-400" />
          <span>{t('feedbackPrompt')}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setRating('useful')}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold transition ${
              rating === 'useful'
                ? 'bg-teal-700 text-white'
                : 'bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600'
            }`}
          >
            <ThumbsUp className="w-3.5 h-3.5" />
            <span>{t('feedbackYes')}</span>
          </button>

          <button
            type="button"
            onClick={() => setRating('not-useful')}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold transition ${
              rating === 'not-useful'
                ? 'bg-rose-700 text-white'
                : 'bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600'
            }`}
          >
            <ThumbsDown className="w-3.5 h-3.5" />
            <span>{t('feedbackNo')}</span>
          </button>
        </div>
      </div>

      {(rating || feedbackType === 'General Feedback') && (
        <form onSubmit={handleSubmit} className="space-y-2 pt-2 border-t border-slate-200/70 dark:border-slate-700">
          {feedbackType === 'General Feedback' && (
            <div>
              <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-300 mb-1">
                {t('feedbackCategory')}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-xs p-1.5 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100"
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
            <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-300 mb-1">
              {t('feedbackImprovePrompt')}
            </label>
            <textarea
              rows={2}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={t('feedbackImprovePlaceholder')}
              className="w-full text-xs p-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:ring-1 focus:ring-teal-500"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded bg-slate-900 hover:bg-slate-800 dark:bg-teal-600 dark:hover:bg-teal-500 text-white text-xs font-semibold transition"
            >
              <Send className="w-3 h-3" />
              <span>{t('submitFeedbackBtn')}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
