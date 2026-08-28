"use client";

import { useState, useEffect } from "react";
import { StudyData } from "../types";

export function useStudySession() {
  const [copied, setCopied] = useState(false);
  const [studyData, setStudyData] = useState<StudyData>({
    fileName: "Loading document...",
    generatedQuestion: "Generating question with AI model...",
  });

  useEffect(() => {
    const rawData = sessionStorage.getItem("study_data");
    if (rawData) {
      try {
        const parsed = JSON.parse(rawData);
        setStudyData({
          fileName: parsed.fileName || "Processed document",
          generatedQuestion: parsed.generatedQuestion || "No question was generated.",
        });
      } catch (error) {
        console.error("Error reading study session data:", error);
      }
    }
  }, []);

  const copyToClipboard = () => {
    if (!studyData.generatedQuestion) return;
    navigator.clipboard.writeText(studyData.generatedQuestion);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return {
    fileName: studyData.fileName,
    generatedQuestion: studyData.generatedQuestion,
    copied,
    copyToClipboard,
  };
}