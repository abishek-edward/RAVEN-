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
  ShieldCheck,
  Crosshair,
  Navigation,
  X
} from 'lucide-react';

export default function CivicReportForm({ onReportSubmitted }) {
  const { addCivicReport, profile, t } = useRaven();

  const [text, setText] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [district, setDistrict] = useState(profile.district || 'Chennai');
  const [coords, setCoords] = useState(null); // { lat: number, lng: number } or null
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsMessage, setGpsMessage] = useState('');
  const [durationDays, setDurationDays] = useState(14);
  const [attachments, setAttachments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedReport, setSubmittedReport] = useState(null);
  const [errors, setErrors] = useState({});

  const detectedLanguage = detectLanguage(text);

  const quickSamples = [
    'Street light இரண்டு வாரமா work ஆகல.',
    'Road romba மோசமா இருக்கு, potholes நிறைய.',
    'Anna Nagarல இந்த road முழுக்க pothole இருக்கு, rain வந்தா water நிறைய நிற்குது.',
    'இந்த தெருவில் இரண்டு வாரமாக street light வேலை செய்யவில்லை.'
  ];

  // Demo coordinates for prototype testing
  const demoCoordinatePresets = [
    { label: 'Perambur Center', lat: 13.1098, lng: 80.2452, area: 'Perambur, Stephenson Road' },
    { label: 'Anna Nagar Center', lat: 13.0850, lng: 80.2101, area: 'Anna Nagar, 6th Avenue' },
    { label: 'Velachery Center', lat: 12.9815, lng: 80.2180, area: 'Velachery Main Road' },
    { label: 'T. Nagar Center', lat: 13.0418, lng: 80.2337, area: 'Usman Road, T. Nagar' },
    { label: 'Koyambedu Center', lat: 13.0694, lng: 80.1948, area: 'Koyambedu Market Junction' }
  ];

  const handleAcquireGPS = () => {
    if (!navigator.geolocation) {
      setGpsMessage('Browser geolocation not supported. Use demo coordinates or locality text.');
      return;
    }

    setGpsLoading(true);
    setGpsMessage('');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = parseFloat(pos.coords.latitude.toFixed(6));
        const lng = parseFloat(pos.coords.longitude.toFixed(6));
        setCoords({ lat, lng });
        setGpsLoading(false);
        setGpsMessage(`Real GPS acquired: ${lat}, ${lng}`);
      },
      (err) => {
        setGpsLoading(false);
        setGpsMessage(`GPS unavailable (${err.message || 'Permission denied'}). Falling back to text address.`);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const validateForm = () => {
    const errs = {};
    if (!category || !category.trim()) {
      errs.category = 'Please select an issue category';
    }
    if (!text || !text.trim()) {
      errs.text = 'Description of the issue is required';
    } else if (text.trim().length < 5) {
      errs.text = 'Please provide a more detailed description (at least 5 characters)';
    }
    if (!location || !location.trim()) {
      errs.location = 'Location is required. Please specify a street address, landmark, or area';
    }
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Strict mandatory fields validation
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});

    setIsSubmitting(true);

    try {
      const report = await addCivicReport({
        text: text.trim(),
        category: category.trim(),
        location: location.trim(),
        district,
        latitude: coords ? coords.lat : null,
        longitude: coords ? coords.lng : null,
        durationDays: parseInt(durationDays, 10) || 7,
        attachments
      });

      setSubmittedReport(report);
      setText('');
      setCategory('');
      setLocation('');
      setCoords(null);
      setGpsMessage('');
      setAttachments([]);
      setErrors({});

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
    <div className="bg-white dark:bg-slate-800 border-2 border-blue-600/30 dark:border-blue-500/40 rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-blue-700 dark:text-blue-400" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wide">
            {t('reportCivicHeader')}
          </h3>
        </div>
        <TrustBadge type="CITIZEN" size="xs" />
      </div>

      <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
        {t('reportCivicDesc')}
      </p>

      {/* Strict Anonymous Privacy Notice */}
      <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-900/60 rounded-lg border border-slate-200 dark:border-slate-700 text-xs flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
          <ShieldCheck className="w-4 h-4 text-teal-700 dark:text-teal-400 shrink-0" />
          <div>
            <span className="font-semibold text-slate-900 dark:text-white">{t('anonymousNotice')}</span>
          </div>
        </div>
        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
          Private Submission
        </span>
      </div>

      {/* Citizen Fast Response + Fast Trigger Notification + Feedback Loop */}
      {submittedReport && (
        <div className="mt-4 space-y-4">
          <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs space-y-3">
            {/* Header / Receipt */}
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
              <div>
                <div className="font-bold text-sm text-emerald-950 dark:text-emerald-100 flex items-center gap-2">
                  <span>Your report has been received.</span>
                  <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-emerald-200/80 dark:bg-emerald-800 text-emerald-900 dark:text-emerald-100 font-semibold">
                    {submittedReport.id}
                  </span>
                </div>
                <div className="mt-1 text-emerald-800 dark:text-emerald-300 leading-relaxed">
                  {submittedReport.citizenFastResponse?.clusterAssociation || `Your report appears related to civic issue cluster ${submittedReport.clusterId} in your area.`}
                </div>
              </div>
            </div>

            {/* Evidence Assessment Badge (Platform Analysis 🟣) */}
            {submittedReport.evidenceAssessment && (
              <div className="p-2.5 rounded bg-purple-100/60 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800 text-purple-950 dark:text-purple-200 text-[11px]">
                <div className="font-bold flex items-center gap-1.5 text-purple-900 dark:text-purple-300">
                  <TrustBadge type="ANALYSIS" size="xs" />
                  <span>{submittedReport.evidenceAssessment.label}</span>
                </div>
                <p className="mt-1 leading-relaxed text-purple-900/90 dark:text-purple-300/90">
                  {submittedReport.evidenceAssessment.explanation}
                </p>
              </div>
            )}

            {/* Government Fast Trigger Identified */}
            {submittedReport.fastTrigger && (
              <div className="p-3 rounded bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-blue-950 dark:text-blue-200 text-[11px] space-y-1.5">
                <div className="font-bold uppercase tracking-wider text-blue-900 dark:text-blue-300 flex items-center justify-between">
                  <span>Government Fast Trigger Identified</span>
                  <span className="font-mono text-[10px] bg-blue-200 dark:bg-blue-800 text-blue-900 dark:text-blue-100 px-1.5 py-0.5 rounded">
                    {submittedReport.fastTrigger.ward}
                  </span>
                </div>
                <div className="font-semibold text-slate-800 dark:text-slate-200">
                  {submittedReport.fastTrigger.department}
                </div>
                <div className="text-slate-600 dark:text-slate-400 flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span>Sector: <strong>{submittedReport.fastTrigger.sector}</strong></span>
                  <span>Helpline: <strong>{submittedReport.fastTrigger.officialChannel?.helpline}</strong></span>
                </div>
              </div>
            )}

            {/* Official Response Truth */}
            <div className="pt-2 border-t border-emerald-200/60 dark:border-emerald-800/60 flex items-center justify-between text-[11px]">
              <div className="text-slate-600 dark:text-slate-400">
                Official Status: <strong className="text-slate-800 dark:text-slate-200">{submittedReport.citizenFastResponse?.officialStatus || 'No official response received yet.'}</strong>
              </div>
              <button
                type="button"
                onClick={() => setSubmittedReport(null)}
                className="font-bold text-emerald-900 dark:text-emerald-300 hover:underline"
              >
                Submit another report
              </button>
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
            <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>Sample inputs (Click to load):</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {quickSamples.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setText(sample);
                    if (errors.text) setErrors(prev => ({ ...prev, text: null }));
                  }}
                  className="text-[11px] px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 text-left transition"
                >
                  "{sample}"
                </button>
              ))}
            </div>
          </div>

          {/* Description with Language Classification and Voice-to-Text */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="issueText" className="block text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                <span>{t('describeIssueLabel')}</span>
                <span className="text-rose-500 font-bold">*</span>
              </label>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold text-rose-500 bg-rose-50 dark:bg-rose-950/60 px-1.5 py-0.5 rounded border border-rose-200 dark:border-rose-900">
                  Required
                </span>
                <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
                  <span>Detected:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600">
                    {detectedLanguage}
                  </span>
                </div>
              </div>
            </div>

            <textarea
              id="issueText"
              rows={3}
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                if (errors.text && e.target.value.trim().length >= 5) {
                  setErrors(prev => ({ ...prev, text: null }));
                }
              }}
              placeholder="Describe the issue in Tamil, English, or Tanglish (e.g. Street light இரண்டு வாரமா work ஆகல...)"
              className={`w-full text-xs p-3 border rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-400 focus:ring-2 font-sans transition ${
                errors.text
                  ? 'border-rose-500 focus:ring-rose-500 bg-rose-50/20 dark:bg-rose-950/20'
                  : 'border-slate-300 dark:border-slate-600 focus:ring-blue-700 focus:border-blue-700'
              }`}
            />

            {/* Validation Message */}
            {errors.text && (
              <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.text}</span>
              </p>
            )}

            {/* Voice-to-Text */}
            <div className="mt-2">
              <VoiceInputButton
                currentText={text}
                onTranscript={(transcribed) => {
                  setText(transcribed);
                  if (errors.text && transcribed.trim().length >= 5) {
                    setErrors(prev => ({ ...prev, text: null }));
                  }
                }}
              />
            </div>
          </div>

          {/* Category & District */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="civicCategory" className="block text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                  <span>{t('issueCategoryLabel')}</span>
                  <span className="text-rose-500 font-bold">*</span>
                </label>
                <span className="text-[10px] uppercase font-bold text-rose-500 bg-rose-50 dark:bg-rose-950/60 px-1.5 py-0.5 rounded border border-rose-200 dark:border-rose-900">
                  Required
                </span>
              </div>
              <select
                id="civicCategory"
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  if (errors.category && e.target.value.trim()) {
                    setErrors(prev => ({ ...prev, category: null }));
                  }
                }}
                className={`w-full text-xs p-2.5 border rounded-md bg-white dark:bg-slate-700 font-medium text-slate-800 dark:text-slate-200 focus:ring-2 transition ${
                  errors.category
                    ? 'border-rose-500 focus:ring-rose-500 bg-rose-50/20 dark:bg-rose-950/20'
                    : 'border-slate-300 dark:border-slate-600 focus:ring-blue-700'
                }`}
              >
                <option value="">-- Select Issue Category (Required) * --</option>
                <option value="Street Infrastructure">Street Infrastructure (Streetlights, Signs)</option>
                <option value="Roads">Roads & Potholes</option>
                <option value="Waste">Waste & Solid Waste Management</option>
                <option value="Water">Water Supply & Leakage</option>
                <option value="Drainage">Drainage & Sewage Overflow</option>
                <option value="Public Facilities">Public Facilities & Parks</option>
                <option value="Other">Other Civic Issue</option>
              </select>

              {/* Validation Message */}
              {errors.category && (
                <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.category}</span>
                </p>
              )}
            </div>

            <div>
              <label htmlFor="district" className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">
                {t('districtLabel')}
              </label>
              <select
                id="district"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 font-medium text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-700"
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
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="location" className="block text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-500 dark:text-slate-400" />
                  <span>{t('locationAddressLabel')}</span>
                  <span className="text-rose-500 font-bold">*</span>
                </label>
                <span className="text-[10px] uppercase font-bold text-rose-500 bg-rose-50 dark:bg-rose-950/60 px-1.5 py-0.5 rounded border border-rose-200 dark:border-rose-900">
                  Required
                </span>
              </div>
              <input
                id="location"
                type="text"
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value);
                  if (errors.location && e.target.value.trim()) {
                    setErrors(prev => ({ ...prev, location: null }));
                  }
                }}
                placeholder="e.g. 3rd Cross Street near school"
                className={`w-full text-xs p-2.5 border rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 transition ${
                  errors.location
                    ? 'border-rose-500 focus:ring-rose-500 bg-rose-50/20 dark:bg-rose-950/20'
                    : 'border-slate-300 dark:border-slate-600 focus:ring-blue-700'
                }`}
              />

              {/* Validation Message */}
              {errors.location && (
                <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.location}</span>
                </p>
              )}
            </div>

            <div>
              <label htmlFor="durationDays" className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-500 dark:text-slate-400" />
                {t('durationUnaddressedLabel')}
              </label>
              <input
                id="durationDays"
                type="number"
                min="1"
                max="365"
                value={durationDays}
                onChange={(e) => setDurationDays(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-700"
              />
            </div>
          </div>

          {/* GPS Coordinates & Jurisdiction Capture */}
          <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-lg border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200">
                <Navigation className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                <span>Geographic Coordinates (GPS)</span>
              </div>
              <button
                type="button"
                onClick={handleAcquireGPS}
                disabled={gpsLoading}
                className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded bg-teal-600 hover:bg-teal-700 text-white font-medium shadow-sm transition disabled:opacity-50"
              >
                <Crosshair className="w-3 h-3" />
                <span>{gpsLoading ? 'Acquiring GPS...' : 'Use My GPS Location'}</span>
              </button>
            </div>

            {coords ? (
              <div className="flex items-center justify-between p-2 rounded bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 text-xs">
                <div className="flex items-center gap-2 text-teal-900 dark:text-teal-200 font-mono text-[11px]">
                  <span className="font-semibold text-teal-700 dark:text-teal-400">Attached Coordinates:</span>
                  <span>{coords.lat.toFixed(4)}° N, {coords.lng.toFixed(4)}° E</span>
                </div>
                <button
                  type="button"
                  onClick={() => { setCoords(null); setGpsMessage(''); }}
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  title="Remove coordinates"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed space-y-1">
                <p>
                  No GPS coordinates attached. The server will resolve jurisdiction using your text locality keywords, or mark as "Unassigned" if unknown.
                </p>
                <div className="flex flex-wrap items-center gap-1 pt-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Demo Locality Presets:</span>
                  {demoCoordinatePresets.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setCoords({ lat: preset.lat, lng: preset.lng });
                        if (!location) setLocation(preset.area);
                        if (errors.location) setErrors(prev => ({ ...prev, location: null }));
                        setGpsMessage(`Preset selected: ${preset.label} (${preset.lat}, ${preset.lng})`);
                      }}
                      className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {gpsMessage && (
              <div className="text-[11px] text-teal-700 dark:text-teal-400 font-medium">
                {gpsMessage}
              </div>
            )}
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
            className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 px-4 rounded bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-500 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white text-xs font-semibold shadow-sm transition"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isSubmitting ? t('submittingBtn') : t('submitCivicReportBtn')}</span>
          </button>
        </form>
      )}
    </div>
  );
}
