"use client";

import { useState } from "react";

type AnalysisResult = {
  score: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  strengths: string[];
  gaps: string[];
  suggestions: string[];
};

export default function Home() {
  const [resume, setResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAnalyze() {
    setLoading(true);
    setResult(null);
    setError(null);

    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resume, jobDescription }),
    });

    const data = await response.json();

    if (!response.ok || data.error) {
      setError(data.error ?? "Something went wrong.");
    } else {
      setResult(data);
    }
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            AI Resume Analyzer
          </h1>
          <p className="text-gray-500 text-lg">
            Paste your resume and a job description to see how well they match.
          </p>
        </div>

        {/* Input Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Resume
            </label>
            <textarea
              rows={10}
              value={resume}
              onChange={(e) => setResume(e.target.value)}
              placeholder="Paste your resume here..."
              className="w-full rounded-lg border border-gray-300 p-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Description
            </label>
            <textarea
              rows={10}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here..."
              className="w-full rounded-lg border border-gray-300 p-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 rounded-lg transition-colors"
          >
            {loading ? "Analyzing..." : "Analyze Match"}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-6 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-200 p-8 space-y-6">

            {/* Score */}
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-1">Match Score</p>
              <p className="text-6xl font-bold text-blue-600">{result.score}%</p>
            </div>

            {/* Keywords */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Matched Keywords</h3>
                <div className="flex flex-wrap gap-2">
                  {result.matchedKeywords.map((kw) => (
                    <span key={kw} className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Missing Keywords</h3>
                <div className="flex flex-wrap gap-2">
                  {result.missingKeywords.map((kw) => (
                    <span key={kw} className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Strengths */}
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Strengths</h3>
              <ul className="space-y-1">
                {result.strengths.map((s) => (
                  <li key={s} className="text-sm text-gray-600 flex gap-2">
                    <span className="text-green-500">✓</span> {s}
                  </li>
                ))}
              </ul>
            </div>

            {/* Gaps */}
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Gaps</h3>
              <ul className="space-y-1">
                {result.gaps.map((g) => (
                  <li key={g} className="text-sm text-gray-600 flex gap-2">
                    <span className="text-red-400">✗</span> {g}
                  </li>
                ))}
              </ul>
            </div>

            {/* Suggestions */}
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Suggestions</h3>
              <ul className="space-y-1">
                {result.suggestions.map((s) => (
                  <li key={s} className="text-sm text-gray-600 flex gap-2">
                    <span className="text-blue-400">→</span> {s}
                  </li>
                ))}
              </ul>
            </div>

          </div>
        )}

      </div>
    </main>
  );
}
