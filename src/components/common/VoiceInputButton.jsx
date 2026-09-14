import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, AlertCircle } from 'lucide-react';

export default function VoiceInputButton({ onTranscript, currentText }) {
  const [isListening, setIsListening] = useState(false);
  const [selectedLang, setSelectedLang] = useState('en-IN'); // 'en-IN' or 'ta-IN'
  const [errorMessage, setErrorMessage] = useState('');
  const recognitionRef = useRef(null);

  const SpeechRecognition = typeof window !== 'undefined'
    ? window.SpeechRecognition || window.webkitSpeechRecognition
    : null;

  const isSupported = Boolean(SpeechRecognition);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const startListening = () => {
    setErrorMessage('');
    if (!SpeechRecognition) {
      setErrorMessage('Voice input is not supported in this browser. Please type your report.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = selectedLang;
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          const updated = currentText && currentText.trim()
            ? `${currentText.trim()} ${transcript}`
            : transcript;
          onTranscript(updated);
        }
      };

      recognition.onerror = (event) => {
        console.warn('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          setErrorMessage('Microphone access denied. Please enable microphone permissions in your browser.');
        } else if (event.error === 'no-speech') {
          setErrorMessage('No speech detected. Please click speak again and speak clearly.');
        } else {
          setErrorMessage(`Speech recognition error: ${event.error}`);
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      setErrorMessage('Could not initialize speech recognition.');
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  return (
    <div className="space-y-1.5">
      <div className="flex flex-wrap items-center gap-2 text-xs">
        {/* Language selector */}
        <div className="flex items-center gap-1">
          <span className="text-slate-500 font-medium">Speech:</span>
          <select
            value={selectedLang}
            onChange={(e) => setSelectedLang(e.target.value)}
            disabled={isListening}
            className="text-xs py-1 px-2 rounded border border-slate-300 bg-white font-medium text-slate-700"
          >
            <option value="en-IN">English</option>
            <option value="ta-IN">தமிழ் (Tamil)</option>
          </select>
        </div>

        {/* Mic toggle */}
        {isListening ? (
          <button
            type="button"
            onClick={stopListening}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs animate-pulse transition"
          >
            <MicOff className="w-3.5 h-3.5" />
            <span>Listening... (Click to stop)</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={startListening}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 font-semibold text-xs transition"
          >
            <Mic className="w-3.5 h-3.5 text-teal-700" />
            <span>🎙 Speak</span>
          </button>
        )}

        <span className="text-[11px] text-slate-400">
          Editable transcript — reviews before submit
        </span>
      </div>

      {!isSupported && (
        <div className="text-[11px] text-amber-800 bg-amber-50 p-1.5 rounded border border-amber-200">
          Voice input is not supported in this browser. Please type your report.
        </div>
      )}

      {errorMessage && (
        <div className="text-[11px] text-rose-700 bg-rose-50 p-1.5 rounded border border-rose-200 flex items-center gap-1">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
}
