"use client";

import { CloudCheckIcon } from "@/src/components/icons/CloudCheckIcon";
import { usePdfUpload } from "../hooks/usePdfUpload";

export function UploadCard() {
  const {
    isDragging,
    isLoading,
    errorMessage,
    fileInputRef,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileInputChange,
    openFilePicker,
  } = usePdfUpload();

  return (
    <div className="w-full max-w-lg rounded-3xl border border-stone-200/60 bg-white p-6 shadow-2xl shadow-black/15 sm:p-8">
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        accept=".pdf"
        className="hidden"
      />

      <div className="flex items-center gap-4 pb-6 border-b border-stone-100">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#fde9e7] text-[#752b26]">
          <CloudCheckIcon className="h-6 w-6" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-[#752b26]">Upload files</h3>
          <p className="text-xs text-[#752b26]/60">Upload a PDF to generate AI questions</p>
        </div>
      </div>

      {errorMessage && (
        <div className="mt-4 rounded-xl bg-red-50 p-3 text-xs font-semibold text-red-700 border border-red-200">
           {errorMessage}
        </div>
      )}

      {isLoading ? (
        <div className="mt-6 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#752b26]/30 bg-[#fde9e7]/20 py-22 px-6 text-center">
          <div className="h-10 w-10 animate-spin rounded-full border-3 border-[#752b26] border-t-transparent" />
          <p className="mt-4 text-sm font-bold text-[#752b26]">Analyzing PDF with AI...</p>
          <p className="mt-1 text-xs text-[#752b26]/60">Your model is generating the question</p>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={openFilePicker}
          className={`mt-6 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed py-22 px-6 text-center cursor-pointer transition-all duration-200 ${
            isDragging
              ? "border-[#752b26] bg-[#fde9e7]/30 scale-[1.01]"
              : "border-stone-300/90 bg-white hover:border-[#752b26]/40 hover:bg-[#fde9e7]/10"
          }`}
        >
          <div className="flex h-10 w-10 items-center justify-center text-[#752b26]">
            <CloudCheckIcon className="h-7 w-7" />
          </div>

          <p className="mt-3 text-sm font-semibold text-[#752b26]/80">
            {isDragging ? "Drop your PDF here!" : "Drag & drop your PDF or click to browse"}
          </p>

          <button
            type="button"
            className="mt-5 inline-flex items-center justify-center rounded-full border border-[#f5c6c1] bg-[#fde9e7] px-6 py-2 text-xs font-bold text-[#752b26] shadow-sm transition-all duration-200 hover:scale-105 active:scale-95 pointer-events-none"
          >
            Select PDF
          </button>
        </div>
      )}

    </div>
  );
}