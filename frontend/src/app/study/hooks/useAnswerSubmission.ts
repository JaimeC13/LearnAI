"use client";

import { useState } from "react";

export function useAnswerSubmission() {
  const [answer, setAnswer] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleAnswerChange = (text: string) => {
    setAnswer(text);
  };

  const submitAnswer = async () => {
    if (!answer.trim()) return;

    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const editAnswer = () => {
    setIsSubmitted(false);
  };

  return {
    answer,
    isSubmitting,
    isSubmitted,
    handleAnswerChange,
    submitAnswer,
    editAnswer,
  };
}