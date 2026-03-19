"use client";

import { useRef, useState } from "react";

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
  const [dark, setDark] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  async function handleExportPDF() {
    if (!resultRef.current) return;
    const html2pdf = (await import("html2pdf.js")).default;
    html2pdf()
      .set({
        margin: 16,
        filename: "resume-analysis.pdf",
        html2canvas: { scale: 2 },
      })
      .from(resultRef.current)
      .save();
  }

  async function handleAnalyze() {
    if (!resume.trim() || !jobDescription.trim()) {
      setError("Please fill in both your resume and the job description.");
      return;
    }

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
    <div className={dark ? "dark" : ""}>
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 transition-colors">
        <div className="max-w-3xl mx-auto">

          {/* Dark Mode Toggle */}
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setDark(!dark)}
              className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {dark ? "Light Mode yay!" : "Dark Mode oOoOo!"}
            </button>
          </div>

          {/* Header */}
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
              AI Resume Analyzer
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              Paste your resume and a job description to see how well they match.
            </p>
          </div>

          {/* Input Form */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Your Resume
              </label>
              <textarea
                rows={10}
                value={resume}
                onChange={(e) => setResume(e.target.value)}
                placeholder="Paste your resume here..."
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 p-3 text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Job Description
              </label>
              <textarea
                rows={10}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description here..."
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 p-3 text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Analyzing...
                </>
              ) : (
                "Analyze Match"
              )}
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="mt-6 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-xl p-4 text-sm">
              <strong>Error:</strong> {error}
            </div>
          )}

          {/* Results */}
          {result && (
            <>
            <div ref={resultRef} className="mt-8 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 space-y-6">

              {/* Score */}
              <div className="text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Match Score</p>
                <p className={`text-6xl font-bold ${
                  result.score >= 75 ? "text-green-600 dark:text-green-400" :
                  result.score >= 50 ? "text-yellow-500 dark:text-yellow-400" :
                  "text-red-500 dark:text-red-400"
                }`}>{result.score}%</p>
              </div>

              {/* Keywords */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Matched Keywords</h3>
                  <div className="flex flex-wrap gap-2">
                    {result.matchedKeywords.map((kw) => (
                      <span key={kw} className="bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 text-xs px-2 py-1 rounded-full">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Missing Keywords</h3>
                  <div className="flex flex-wrap gap-2">
                    {result.missingKeywords.map((kw) => (
                      <span key={kw} className="bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400 text-xs px-2 py-1 rounded-full">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Strengths */}
              <div>
                <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Strengths</h3>
                <ul className="space-y-1">
                  {result.strengths.map((s) => (
                    <li key={s} className="text-sm text-gray-600 dark:text-gray-400 flex gap-2">
                      <span className="text-green-500">✓</span> {s}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Gaps */}
              <div>
                <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Gaps</h3>
                <ul className="space-y-1">
                  {result.gaps.map((g) => (
                    <li key={g} className="text-sm text-gray-600 dark:text-gray-400 flex gap-2">
                      <span className="text-red-400">✗</span> {g}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Suggestions */}
              <div>
                <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Suggestions</h3>
                <ul className="space-y-1">
                  {result.suggestions.map((s) => (
                    <li key={s} className="text-sm text-gray-600 dark:text-gray-400 flex gap-2">
                      <span className="text-blue-400">→</span> {s}
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            {/* Export Button */}
            <button
              onClick={handleExportPDF}
              className="mt-4 w-full bg-gray-800 dark:bg-gray-600 hover:bg-gray-900 dark:hover:bg-gray-500 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              Export as PDF
            </button>
            </>
          )}

          {/* Footer */}
          <footer className="mt-12 text-center text-sm text-gray-400">
            <p>Built by Adhil Ashraf</p>
            <div className="mt-2 flex justify-center gap-4">
              <a href="https://github.com/AdhilAshraf12" target="_blank" rel="noopener noreferrer" className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                GitHub
              </a>
              <a href="https://www.linkedin.com/in/adhil-ashraf-319a99239/" target="_blank" rel="noopener noreferrer" className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                LinkedIn
              </a>
            </div>
            <p className="mt-2">&copy; {new Date().getFullYear()} All rights reserved.</p>
          </footer>

        </div>
      </main>
    </div>
  );
}
