import React, { useState, useEffect } from 'react';
import { useRaven } from '../../context/RavenContext';
import { detectLanguage } from '../../utils/languageDetector';
import TrustBadge from '../common/TrustBadge';
import VoiceInputButton from '../common/VoiceInputButton';
import EvidenceUploader from '../common/EvidenceUploader';
import FeedbackBox from '../common/FeedbackBox';
import { SCHEME_CATEGORIES } from '../../data/schemeSampleInputs';
import { MessageSquare, Send, CheckCircle2, ShieldCheck, Clock } from 'lucide-react';

export default function SchemeReportForm({ 
  scheme, 
  onReportSubmitted,
  selectedCategory,
  onCategoryChange,
  reportText,
  setReportText,
  formRef,
  textareaRef
}) {
  const { addSchemeReport } = useRaven();

  const categories = SCHEME_CATEGORIES[scheme.id] || [
    'Payment not received',
    'Application pending',
    'Eligibility issue',
    'Aadhaar / bank issue',
    'Verification delay',
    'Other implementation issue'
  ];

  const [category, setCategory] = useState(selectedCategory || categories[0]);
  const [delayDays, setDelayDays] = useState(60);
  const [attachments, setAttachments] = useState([]);
  const [college, setCollege] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedReport, setSubmittedReport] = useState(null);

  // Sync category if prop changes from parent quick-chips
  useEffect(() => {
    if (selectedCategory) {
      setCategory(selectedCategory);
    }
  }, [selectedCategory]);

  const detectedLanguage = detectLanguage(reportText);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reportText.trim()) return;

    setIsSubmitting(true);

    try {
      const report = await addSchemeReport({
        schemeId: scheme.id,
        reportText: reportText.trim(),
        category,
        delayDays: delayDays ? parseInt(delayDays, 10) : undefined,
        college: college.trim() || undefined,
        attachments
      });

      setSubmittedReport(report);
      setReportText('');
      setAttachments([]);
      if (onReportSubmitted) {
        onReportSubmitted(report);
      }
    } catch (err) {
      console.error('Submission failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div ref={formRef} id="scheme-complaint-form" className="bg-white border-2 border-teal-600/30 rounded-lg p-6 shadow-sm scroll-mt-24">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-teal-700" />
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
            Report an Issue with {scheme.shortName}
          </h3>
        </div>
        <TrustBadge type="CITIZEN" size="xs" />
      </div>

      {/* Strict Anonymous Privacy Notice */}
      <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-slate-700">
          <ShieldCheck className="w-4 h-4 text-teal-700 shrink-0" />
          <div>
            <span className="font-semibold text-slate-900">Your identity is kept private.</span>
            <span className="text-slate-500 ml-1">Privacy: Anonymous to the public.</span>
          </div>
        </div>
        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white text-slate-600 border border-slate-200">
          Private Submission
        </span>
      </div>

      {/* Success Notification + Feedback Loop */}
      {submittedReport && (
        <div className="mt-4 space-y-4">
          <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
              <div>
                <div className="font-semibold text-emerald-950">
                  Citizen experience report recorded ({submittedReport.id})
                </div>
                <div className="mt-1 text-emerald-800">
                  Your report has been logged under <strong>{submittedReport.category}</strong> as <strong>Anonymous Citizen</strong> from {submittedReport.district}. It is now contributing to the platform's ground reality analysis for {scheme.shortName}.
                </div>
                <button
                  type="button"
                  onClick={() => setSubmittedReport(null)}
                  className="mt-2 text-[11px] font-semibold text-emerald-900 underline block"
                >
                  Submit another report for this scheme
                </button>
              </div>
            </div>
          </div>

          {/* Post-Report Feedback */}
          <FeedbackBox
            referenceId={submittedReport.id}
            feedbackType="Scheme Report Experience"
          />
        </div>
      )}

      {!submittedReport && (
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Category Selector */}
          <div>
            <label htmlFor="schemeCategory" className="block text-xs font-semibold text-slate-800 mb-1">
              Issue Category <span className="text-red-500">*</span>
            </label>
            <select
              id="schemeCategory"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                if (onCategoryChange) onCategoryChange(e.target.value);
              }}
              className="w-full text-xs p-2.5 border border-slate-300 rounded-md bg-white font-medium text-slate-800 focus:ring-2 focus:ring-teal-700"
            >
              {categories.map((cat, idx) => (
                <option key={idx} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Text Area with Live Language Classification and Voice-to-Text */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="reportText" className="block text-xs font-semibold text-slate-800">
                Citizen Experience Statement <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-1 text-[11px] text-slate-500">
                <span>Detected Language:</span>
                <span className="font-semibold text-slate-800 px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200">
                  {detectedLanguage}
                </span>
              </div>
            </div>

            <textarea
              ref={textareaRef}
              id="reportText"
              rows={3}
              required
              value={reportText}
              onChange={(e) => setReportText(e.target.value)}
              placeholder="Describe your experience in Tamil, English, or Tanglish (e.g. Pudhumai Penn oda payment இன்னும் வரல...)"
              className="w-full text-xs p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-teal-700 focus:border-teal-700 font-sans"
            />

            {/* Voice-to-Text Controller */}
            <div className="mt-2">
              <VoiceInputButton
                currentText={reportText}
                onTranscript={(transcribed) => setReportText(transcribed)}
              />
            </div>
          </div>

          {/* Duration / Delay Days Input */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="delayDays" className="block text-xs font-medium text-slate-700 mb-1 flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-500" />
                Reported Delay Duration (in days)
              </label>
              <input
                id="delayDays"
                type="number"
                min="0"
                max="730"
                value={delayDays}
                onChange={(e) => setDelayDays(e.target.value)}
                placeholder="e.g. 68"
                className="w-full text-xs p-2.5 border border-slate-300 rounded-md focus:ring-2 focus:ring-teal-700"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                How many days since expected date or application submission?
              </span>
            </div>

            <div>
              <label htmlFor="college" className="block text-xs font-medium text-slate-700 mb-1">
                Institution / Local Ward (Optional)
              </label>
              <input
                id="college"
                type="text"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                placeholder="e.g. Govt College / Ward 4"
                className="w-full text-xs p-2.5 border border-slate-300 rounded-md focus:ring-2 focus:ring-teal-700"
              />
            </div>
          </div>

          {/* Real Photo / File Attachment Uploader */}
          <div className="pt-1">
            <EvidenceUploader
              attachments={attachments}
              setAttachments={setAttachments}
              maxFiles={3}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !reportText.trim()}
            className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 px-4 rounded bg-teal-800 hover:bg-teal-700 disabled:bg-slate-300 text-white text-xs font-semibold shadow-sm transition"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Submit Scheme Citizen Experience Report</span>
          </button>
        </form>
      )}
    </div>
  );
}
