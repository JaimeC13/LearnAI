"use client";

import Link from "next/link";
import { useStudySession } from "@/src/app/study/hooks/useStudySession";
import { QuestionnaireCard } from "@/src/app/study/components/QuestionnaireCard";

export default function StudyPage() {
  const { fileName, generatedQuestion } = useStudySession();

  return (
    <div className="min-h-[calc(100vh-4rem)] w-full bg-transparent px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
       
        <div className="flex items-center justify-between pb-6 border-b border-stone-200/60">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#752b26]/60">
              Study Area
            </span>
            <h1 className="text-2xl font-extrabold text-[#752b26] sm:text-3xl">
              AI-Generated Question
            </h1>
            <p className="text-sm text-stone-500 mt-1">
              Document:{" "}
              <span className="font-semibold text-stone-700">{fileName}</span>
            </p>
          </div>

          <Link
            href="/"
            className="rounded-full border border-stone-300 bg-white px-5 py-2.5 text-xs font-bold text-[#752b26] transition-all hover:bg-stone-50 shadow-sm"
          >
            ← Upload another document
          </Link>
        </div>

        <div className="mt-8">
          <QuestionnaireCard question={generatedQuestion} />
        </div>

      </div>
    </div>
  );
}