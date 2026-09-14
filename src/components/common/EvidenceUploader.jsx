import React, { useRef, useState } from 'react';
import { Upload, X, FileText, Image as ImageIcon, AlertCircle } from 'lucide-react';

export default function EvidenceUploader({ attachments, setAttachments, maxFiles = 3 }) {
  const fileInputRef = useRef(null);
  const [errorMsg, setErrorMsg] = useState('');

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleFileChange = (e) => {
    setErrorMsg('');
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    if (attachments.length + files.length > maxFiles) {
      setErrorMsg(`Maximum of ${maxFiles} attachments allowed per report.`);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    const acceptedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    const maxSizeBytes = 10 * 1024 * 1024; // 10MB

    const newAttachments = [];

    for (const file of files) {
      if (!acceptedTypes.includes(file.type.toLowerCase()) && !file.name.match(/\.(jpg|jpeg|png|pdf)$/i)) {
        setErrorMsg(`Unsupported file type: ${file.name}. Please upload JPG, PNG, or PDF.`);
        continue;
      }

      if (file.size > maxSizeBytes) {
        setErrorMsg(`File too large: ${file.name} (${formatFileSize(file.size)}). Max allowed is 10 MB.`);
        continue;
      }

      const isImage = file.type.startsWith('image/');
      const previewUrl = isImage ? URL.createObjectURL(file) : null;

      newAttachments.push({
        id: `att-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        name: file.name,
        type: file.type || (file.name.endsWith('.pdf') ? 'application/pdf' : 'image/jpeg'),
        size: formatFileSize(file.size),
        rawSize: file.size,
        isImage,
        previewUrl
      });
    }

    setAttachments(prev => [...prev, ...newAttachments].slice(0, maxFiles));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeAttachment = (idToRemove) => {
    setAttachments(prev => {
      const filtered = prev.filter(att => att.id !== idToRemove);
      return filtered;
    });
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-medium text-slate-700">
          Attach Evidence <span className="text-slate-400 font-normal">(Optional, max {maxFiles} files, up to 10 MB each)</span>
        </label>
        <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
          Citizen-Provided Evidence
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          multiple
          accept=".jpg,.jpeg,.png,.pdf"
          className="hidden"
          id="evidence-file-input"
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={attachments.length >= maxFiles}
          className="inline-flex items-center gap-1.5 px-3 py-2 border border-slate-300 rounded-md bg-white hover:bg-slate-50 disabled:bg-slate-100 disabled:text-slate-400 text-xs font-medium text-slate-700 transition shadow-sm"
        >
          <Upload className="w-3.5 h-3.5 text-slate-500" />
          <span>Upload Photo / File (JPG, PNG, PDF)</span>
        </button>

        <span className="text-[11px] text-slate-400">
          {attachments.length} of {maxFiles} selected
        </span>
      </div>

      {errorMsg && (
        <div className="flex items-center gap-1.5 text-xs text-rose-600 bg-rose-50 p-2 rounded border border-rose-200">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {attachments.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
          {attachments.map((att) => (
            <div
              key={att.id}
              className="relative group p-2.5 rounded-lg border border-slate-200 bg-slate-50 flex items-start gap-2 text-xs"
            >
              {att.isImage && att.previewUrl ? (
                <img
                  src={att.previewUrl}
                  alt={att.name}
                  className="w-12 h-12 object-cover rounded border border-slate-200 shrink-0 bg-white"
                />
              ) : (
                <div className="w-12 h-12 rounded border border-slate-200 bg-white flex flex-col items-center justify-center text-slate-400 shrink-0">
                  <FileText className="w-5 h-5 text-slate-500" />
                  <span className="text-[9px] font-bold text-slate-500 uppercase">PDF</span>
                </div>
              )}

              <div className="flex-1 min-w-0 pr-4">
                <div className="font-medium text-slate-800 truncate" title={att.name}>
                  {att.name}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1.5">
                  <span>{att.size}</span>
                  <span>•</span>
                  <span className="truncate uppercase text-[10px] font-mono text-slate-400">
                    {att.type.split('/')[1] || 'file'}
                  </span>
                </div>
                <div className="text-[10px] text-teal-700 font-medium mt-0.5">
                  Evidence
                </div>
              </div>

              <button
                type="button"
                onClick={() => removeAttachment(att.id)}
                className="absolute top-1.5 right-1.5 p-1 text-slate-400 hover:text-rose-600 rounded hover:bg-slate-200 transition"
                title="Remove attachment"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
