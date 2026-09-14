import React, { useState } from 'react';
import { useRaven } from '../../context/RavenContext';
import { detectLanguage } from '../../utils/languageDetector';
import TrustBadge from '../common/TrustBadge';
import VoiceInputButton from '../common/VoiceInputButton';
import EvidenceUploader from '../common/EvidenceUploader';
import FeedbackBox from '../common/FeedbackBox';
import { 
  AlertCircle, 
  Send, 
  CheckCircle2, 
  Sparkles, 
  MapPin, 
  Clock,
  ShieldCheck
} from 'lucide-react';

export default function CivicReportForm({ onReportSubmitted }) {
  const { addCivicReport, profile } = useRaven();

  const [text, setText] = useState('');
  const [category, setCategory] = useState('Street Infrastructure');
  const [location, setLocation] = useState('');
  const [district, setDistrict] = useState(profile.district || 'Chennai');
  const [durationDays, setDurationDays] = useState(14);
  const [attachments, setAttachments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedReport, setSubmittedReport] = useState(null);

  const detectedLanguage = detectLanguage(text);

  const quickSamples = [
    'Street light இரண்டு வாரமா work ஆகல.',
    'Road romba மோசமா இருக்கு, potholes நிறைய.',
    'Anna Nagarல இந்த road முழுக்க pothole இருக்கு, rain வந்தா water நிறைய நிற்குது.',
    'இந்த தெருவில் இரண்டு வாரமாக street light வேலை செய்யவில்லை.'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    setIsSubmitting(true);

    try {
      const report = await addCivicReport({
        text: text.trim(),
        category,
        location: location.trim() || `${district} Local Area`,
        district,
        durationDays: parseInt(durationDays, 10) || 7,
        attachments
      });

      setSubmittedReport(report);
      setText('');
      setLocation('');
      setAttachments([]);

      if (onReportSubmitted) {
        onReportSubmitted(report);
      }
    } catch (err) {
      console.error('Civic report submission failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white border-2 border-blue-600/30 rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-blue-700" />
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
            Report an Everyday Civic Issue
          </h3>
        </div>
        <TrustBadge type="CITIZEN" size="xs" />
      </div>

      <p className="mt-2 text-xs text-slate-500 leading-relaxed">
        Report neighborhood municipal and infrastructure problems (streetlights, potholes, waste, drainage, water). 
        Input supports Tamil, English, or Mixed Tamil-English.
      </p>

      {/* Strict Anonymous Privacy Notice */}
      <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-slate-700">
          <ShieldCheck className="w-4 h-4 text-teal-700 shrink-0" />
          <div>
            <span className="font-semibold text-slate-900">Your identity is kept private.</span>
            <span className="text-slate-500 ml-1">Anonymous to the public.</span>
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
                  Civic report recorded ({submittedReport.id})
                </div>
                <div className="mt-1 text-emerald-800">
                  Your report has been assigned to cluster <strong>{submittedReport.clusterId}</strong> as <strong>Anonymous Citizen</strong>. The platform has updated the deterministic AI-Assisted Priority Score for this collective issue.
                </div>
                <button
                  type="button"
                  onClick={() => setSubmittedReport(null)}
                  className="mt-2 text-[11px] font-semibold text-emerald-900 underline block"
                >
                  Submit another civic issue
                </button>
              </div>
            </div>
          </div>

          <FeedbackBox
            referenceId={submittedReport.id}
            feedbackType="Civic Report Experience"
          />
        </div>
      )}

      {!submittedReport && (
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Quick Click Samples */}
          <div>
            <div className="text-[11px] font-medium text-slate-500 mb-1 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>Sample inputs (Click to load):</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {quickSamples.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setText(sample)}
                  className="text-[11px] px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-left transition"
                >
                  "{sample}"
                </button>
              ))}
            </div>
          </div>

          {/* Description with Language Classification and Voice-to-Text */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="issueText" className="block text-xs font-semibold text-slate-800">
                Issue Description <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-1 text-[11px] text-slate-500">
                <span>Detected Language:</span>
                <span className="font-semibold text-slate-800 px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200">
                  {detectedLanguage}
                </span>
              </div>
            </div>

            <textarea
              id="issueText"
              rows={3}
              required
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Describe the issue in Tamil, English, or Tanglish (e.g. Street light இரண்டு வாரமா work ஆகல...)"
              className="w-full text-xs p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-700 focus:border-blue-700 font-sans"
            />

            {/* Voice-to-Text */}
            <div className="mt-2">
              <VoiceInputButton
                currentText={text}
                onTranscript={(transcribed) => setText(transcribed)}
              />
            </div>
          </div>

          {/* Category & District */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="civicCategory" className="block text-xs font-semibold text-slate-800 mb-1">
                Civic Category
              </label>
              <select
                id="civicCategory"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-md bg-white font-medium text-slate-800 focus:ring-2 focus:ring-blue-700"
              >
                <option value="Street Infrastructure">Street Infrastructure (Streetlights, Signs)</option>
                <option value="Roads">Roads & Potholes</option>
                <option value="Waste">Waste & Solid Waste Management</option>
                <option value="Water">Water Supply & Leakage</option>
                <option value="Drainage">Drainage & Sewage Overflow</option>
                <option value="Public Facilities">Public Facilities & Parks</option>
                <option value="Other">Other Civic Issue</option>
              </select>
            </div>

            <div>
              <label htmlFor="district" className="block text-xs font-semibold text-slate-800 mb-1">
                District / Administrative Region
              </label>
              <select
                id="district"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-md bg-white font-medium text-slate-800 focus:ring-2 focus:ring-blue-700"
              >
                <option value="Chennai">Chennai</option>
                <option value="Madurai">Madurai</option>
                <option value="Coimbatore">Coimbatore</option>
                <option value="Tiruchirappalli">Tiruchirappalli</option>
                <option value="Salem">Salem</option>
                <option value="Tirunelveli">Tirunelveli</option>
              </select>
            </div>
          </div>

          {/* Specific Location & Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="location" className="block text-xs font-medium text-slate-700 mb-1 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-500" />
                Specific Street / Ward / Landmark
              </label>
              <input
                id="location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. 3rd Cross Street near school"
                className="w-full text-xs p-2.5 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-700"
              />
            </div>

            <div>
              <label htmlFor="durationDays" className="block text-xs font-medium text-slate-700 mb-1 flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-500" />
                Issue Duration (Days observed)
              </label>
              <input
                id="durationDays"
                type="number"
                min="1"
                max="365"
                value={durationDays}
                onChange={(e) => setDurationDays(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-700"
              />
            </div>
          </div>

          {/* Real Photo / File Attachment Input */}
          <div className="pt-1">
            <EvidenceUploader
              attachments={attachments}
              setAttachments={setAttachments}
              maxFiles={3}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !text.trim()}
            className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 px-4 rounded bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white text-xs font-semibold shadow-sm transition"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Submit Everyday Civic Issue Report</span>
          </button>
        </form>
      )}
    </div>
  );
}
