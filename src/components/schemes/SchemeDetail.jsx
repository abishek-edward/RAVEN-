import React, { useState, useEffect, useRef } from 'react';
import { useRaven } from '../../context/RavenContext';
import TrustBadge from '../common/TrustBadge';
import ImplementationGap from './ImplementationGap';
import SchemeReportForm from './SchemeReportForm';
import OfficialChannelBox from '../common/OfficialChannelBox';
import { SCHEME_CATEGORIES, SCHEME_SAMPLE_INPUTS } from '../../data/schemeSampleInputs';
import { 
  Building2, 
  MapPin, 
  ArrowLeft, 
  FileText, 
  CheckCircle, 
  Calendar, 
  ExternalLink, 
  Users, 
  Languages,
  BookOpen,
  MessageSquarePlus,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronUp,
  FileCheck2
} from 'lucide-react';

export default function SchemeDetail({ schemeId }) {
  const { 
    schemes, 
    schemeReports, 
    schemeAnalysis, 
    navigateTo,
    autoOpenSchemeForm,
    setAutoOpenSchemeForm
  } = useRaven();

  const scheme = schemes.find(s => s.id === schemeId) || schemes[0];
  const analysis = schemeAnalysis[scheme.id];
  const reports = schemeReports.filter(r => r.schemeId === scheme.id);

  // Suggested categories & 10 sample inputs
  const suggestedCategories = SCHEME_CATEGORIES[scheme.id] || [
    'Payment not received',
    'Application pending',
    'Eligibility dispute',
    'Aadhaar / bank issue',
    'Verification delay',
    'Other implementation issue'
  ];

  const sampleInputs = SCHEME_SAMPLE_INPUTS[scheme.id] || [];

  // Form state
  const [showReportForm, setShowReportForm] = useState(false);
  const [showOfficialDetails, setShowOfficialDetails] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(suggestedCategories[0]);
  const [reportText, setReportText] = useState('');
  const [activeAnalysisTab, setActiveAnalysisTab] = useState('gap'); // 'gap', 'reports'

  const formRef = useRef(null);
  const textareaRef = useRef(null);

  // Dynamic Average Reported Delay Calculation
  const reportsWithDelay = reports.filter(r => typeof r.delayDays === 'number' && !isNaN(r.delayDays));
  const dynamicAverageDelay = reportsWithDelay.length > 0
    ? Math.round(reportsWithDelay.reduce((acc, r) => acc + r.delayDays, 0) / reportsWithDelay.length)
    : (analysis?.averageDelayDays || null);

  // Reliable handleReportIssueClick
  const handleReportIssueClick = () => {
    setShowReportForm(true);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      textareaRef.current?.focus();
    }, 100);
  };

  // Auto-open if triggered from SchemeCard or deep link
  useEffect(() => {
    if (autoOpenSchemeForm) {
      setShowReportForm(true);
      setAutoOpenSchemeForm(false);
      const timer = setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        textareaRef.current?.focus();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [autoOpenSchemeForm, setAutoOpenSchemeForm]);

  const handleCategorySuggestionClick = (cat) => {
    setSelectedCategory(cat);
    setShowReportForm(true);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      textareaRef.current?.focus();
    }, 100);
  };

  const handleSampleInputClick = (sample) => {
    setReportText(sample.text);
    if (sample.category) {
      setSelectedCategory(sample.category);
    }
    setShowReportForm(true);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      textareaRef.current?.focus();
    }, 100);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Navigation & Status */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigateTo('schemes')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Government Commitments & Schemes
        </button>

        <div className="flex items-center gap-2">
          <TrustBadge type={scheme.trustLabel} size="sm" />
          <span className="text-xs px-2.5 py-1 rounded bg-slate-100 text-slate-700 font-medium border border-slate-200">
            {scheme.officialStatus}
          </span>
        </div>
      </div>

      {/* 1. Scheme Information Header */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 sm:p-8 shadow-sm">
        <div className="max-w-4xl">
          <span className="text-xs font-semibold uppercase tracking-wider text-teal-700">
            {scheme.category}
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1 tracking-tight">
            {scheme.name}
          </h1>

          <div className="flex flex-wrap items-center gap-y-2 gap-x-6 mt-3 text-xs text-slate-600">
            <div className="flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-slate-400" />
              <span>{scheme.department}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-slate-400" />
              <span>{scheme.location}</span>
            </div>
            {scheme.timeline && (
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span>{scheme.timeline}</span>
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Average Reported Delay Indicator */}
        <div className="mt-5 p-4 rounded-lg bg-amber-50/70 border border-amber-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center text-amber-800 shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                Average Reported Delay
              </div>
              <div className="text-lg font-bold text-slate-900">
                {dynamicAverageDelay ? `${dynamicAverageDelay} days` : 'Not enough data'}
              </div>
            </div>
          </div>
          <div className="text-right text-[11px] text-slate-500">
            <div className="font-medium text-slate-700">Based on citizen reports</div>
            <div>(Not an official government metric)</div>
          </div>
        </div>

        {/* Dual Language Simple Explanation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5 pt-5 border-t border-slate-100">
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1.5">
              <BookOpen className="w-4 h-4 text-teal-700" />
              Simple English Explanation
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              {scheme.simpleEnglishExplanation}
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1.5 font-sans">
              <Languages className="w-4 h-4 text-teal-700" />
              விளக்கம் (Simple Tamil Explanation)
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-sans">
              {scheme.simpleTamilExplanation}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Prominent Button: Report an Issue with this Scheme */}
      <div className="bg-gradient-to-r from-teal-900 to-slate-900 text-white rounded-lg p-5 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <MessageSquarePlus className="w-5 h-5 text-teal-400" />
            <span>Have you experienced delays or issues with {scheme.shortName}?</span>
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Share your experience to help build factual ground corroborated evidence. Your identity remains completely private.
          </p>
        </div>

        <button
          onClick={handleReportIssueClick}
          className="px-5 py-2.5 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition shadow"
        >
          Report an Issue with this Scheme
          <span className="block text-[10px] font-normal lowercase tracking-normal text-slate-900">
            Share your experience
          </span>
        </button>
      </div>

      {/* 3. Official Scheme Details (Collapsible) */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        <button
          onClick={() => setShowOfficialDetails(!showOfficialDetails)}
          className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50 transition border-b border-slate-100"
        >
          <div className="flex items-center gap-2">
            <FileCheck2 className="w-4 h-4 text-teal-700" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Official Scheme Specifications & Reference Record
            </h2>
          </div>
          {showOfficialDetails ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>

        {showOfficialDetails && (
          <div className="p-6 space-y-5 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Key Objective</h3>
                <p className="text-slate-600 leading-relaxed">{scheme.objective}</p>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Sanctioned Benefits</h3>
                <p className="text-slate-600 leading-relaxed">{scheme.benefit}</p>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Eligibility Criteria</h3>
                <p className="text-slate-600 leading-relaxed">{scheme.eligibility}</p>
              </div>
            </div>

            {scheme.requiredDocuments && (
              <div className="pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Required Verification Documents:</h3>
                  <ul className="space-y-1">
                    {scheme.requiredDocuments.map((doc, idx) => (
                      <li key={idx} className="flex items-start gap-1.5 text-slate-600">
                        <CheckCircle className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                        <span>{doc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Application Procedure & Official Source:</h3>
                  <p className="text-slate-600 leading-relaxed mb-3">
                    {scheme.applicationProcess}
                  </p>
                  <div className="p-3 bg-slate-50 rounded border border-slate-200 text-slate-700">
                    <div className="font-medium text-slate-800">Official Source Gazette:</div>
                    <div className="mt-0.5 flex items-center gap-1 text-teal-700">
                      <ExternalLink className="w-3.5 h-3.5" />
                      <a href={scheme.officialSource.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                        {scheme.officialSource.name}
                      </a>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{scheme.officialSource.reference}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 4. Scheme-Specific Category Suggestions ("You may want to report") */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-2">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-800">
          You may want to report:
        </div>
        <p className="text-[11px] text-slate-500">
          Click any frequent issue category to start a report with this classification:
        </p>
        <div className="flex flex-wrap gap-2 pt-1">
          {suggestedCategories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => handleCategorySuggestionClick(cat)}
              className="text-xs px-3 py-1.5 rounded-full bg-slate-100 hover:bg-teal-50 hover:text-teal-900 hover:border-teal-300 text-slate-700 border border-slate-200 transition font-medium text-left"
            >
              + {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 5. 10 Sample Citizen Inputs ("Suggested citizen reports") */}
      {sampleInputs.length > 0 && (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-5 shadow-sm space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-800">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Suggested citizen reports (10 examples for {scheme.shortName})</span>
            </div>
            <span className="text-[11px] text-slate-400">Tamil • English • Tanglish</span>
          </div>
          <p className="text-[11px] text-slate-500">
            Click any sample report to populate the complaint form for demo or testing:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            {sampleInputs.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSampleInputClick(sample)}
                className="text-left p-2.5 rounded bg-white hover:bg-teal-50/60 border border-slate-200 hover:border-teal-400 text-xs transition space-y-1 group"
              >
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span className="font-mono text-teal-800 font-semibold">{sample.category}</span>
                  <span>{sample.language}</span>
                </div>
                <div className="text-slate-800 font-sans group-hover:text-teal-950 line-clamp-2">
                  "{sample.text}"
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 6. Complaint Form Section (Always rendered or openable reliably) */}
      {(showReportForm || autoOpenSchemeForm) && (
        <div className="pt-2">
          <SchemeReportForm
            scheme={scheme}
            selectedCategory={selectedCategory}
            onCategoryChange={(cat) => setSelectedCategory(cat)}
            reportText={reportText}
            setReportText={setReportText}
            formRef={formRef}
            textareaRef={textareaRef}
            onReportSubmitted={() => {
              setActiveAnalysisTab('reports');
            }}
          />
        </div>
      )}

      {/* 7. Analysis & Citizen Reports Tabs */}
      <div className="pt-4">
        <div className="border-b border-slate-200 flex items-center gap-4 text-xs font-semibold">
          <button
            onClick={() => setActiveAnalysisTab('gap')}
            className={`pb-3 border-b-2 transition ${
              activeAnalysisTab === 'gap'
                ? 'border-purple-600 text-purple-900 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Implementation Gap Analysis
          </button>

          <button
            onClick={() => setActiveAnalysisTab('reports')}
            className={`pb-3 border-b-2 transition flex items-center gap-1.5 ${
              activeAnalysisTab === 'reports'
                ? 'border-blue-600 text-blue-900 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Citizen Experience Reports ({reports.length})</span>
          </button>
        </div>

        <div className="mt-6">
          {activeAnalysisTab === 'gap' ? (
            <ImplementationGap scheme={scheme} analysis={analysis} reports={reports} />
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Ground Experience Records ({reports.length} records)
                </h3>
                {reports.some(r => !r.isSeeded) && (
                  <TrustBadge type="CITIZEN" size="xs" />
                )}
              </div>

              {reports.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-lg p-8 text-center text-xs text-slate-500">
                  No citizen reports submitted for this scheme yet. Be the first to share your ground experience.
                </div>
              ) : (
                <div className="space-y-3">
                  {reports.map((report) => (
                    <div key={report.id} className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-2.5">
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                          {/* STRICT ANONYMOUS DISPLAY */}
                          <span className="font-semibold text-xs text-slate-900">
                            Anonymous Contributor
                          </span>
                          <span className="text-[11px] text-slate-400">• {report.district}</span>
                          {!report.isSeeded && (
                            <TrustBadge type="CITIZEN" size="xs" />
                          )}
                          {report.delayDays && (
                            <span className="text-[10px] font-mono px-1.5 py-0.5 bg-amber-50 text-amber-900 border border-amber-200 rounded">
                              Delay: {report.delayDays} days
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[11px] px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200 font-medium">
                            {report.category}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            Lang: {report.language}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-800 leading-relaxed font-sans">
                        "{report.reportText}"
                      </p>

                      {/* Citizen-Provided Attachments Display */}
                      {report.attachments && report.attachments.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-slate-100">
                          <div className="text-[10px] font-semibold uppercase text-slate-400 mb-1.5">
                            {!report.isSeeded ? `Citizen-Provided Evidence (${report.attachments.length})` : `Attached Reference Documents (${report.attachments.length})`}
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {report.attachments.map((att, attIdx) => (
                              <div key={attIdx} className="flex items-center gap-2 p-1.5 rounded border border-slate-200 bg-slate-50 text-xs max-w-xs">
                                {att.previewUrl ? (
                                  <img src={att.previewUrl} alt={att.name} className="w-8 h-8 object-cover rounded border" />
                                ) : (
                                  <FileText className="w-5 h-5 text-slate-500 ml-1" />
                                )}
                                <div className="text-[11px] truncate">
                                  <div className="font-medium text-slate-800 truncate">{att.name}</div>
                                  <span className="text-[10px] text-slate-400">{att.size}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between text-[11px] text-slate-500">
                        <div className="flex items-center gap-3">
                          <span>Reported: {report.dateReported}</span>
                          {report.evidenceType && (
                            <span className="text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                              {report.evidenceType}
                            </span>
                          )}
                        </div>
                        <div className="text-slate-400 font-mono text-[10px]">
                          ID: {report.id}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Official Channel Recommendations */}
      <div className="pt-2">
        <OfficialChannelBox channelKey={scheme.officialChannelKey} />
      </div>
    </div>
  );
}
