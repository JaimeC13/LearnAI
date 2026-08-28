"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { uploadPdfAndGenerateQuestion } from "../services/questionService";

export function usePdfUpload() {
  const router = useRouter();
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".pdf")) {
      setErrorMessage("Please upload a valid PDF file.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const result = await uploadPdfAndGenerateQuestion(file);

      sessionStorage.setItem("study_data", JSON.stringify({
        fileName: result.filename,
        generatedQuestion: result.generated_question,
        preview: result.extracted_text_preview,
      }));

      router.push("/study");
    } catch (error: any) {
      console.error("PDF upload error:", error);
      setErrorMessage(error.message || "Failed to process document with AI");
      setIsLoading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      processFile(e.target.files[0]);
    }
  };

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  return {
    isDragging,
    isLoading,
    errorMessage,
    fileInputRef,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileInputChange,
    openFilePicker,
  };
}