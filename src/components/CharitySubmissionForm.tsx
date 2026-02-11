"use client";

import { useState } from "react";

export default function CharitySubmissionForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    charityName: "",
    website: "",
    description: "",
    reason: "",
    submitterName: "",
    submitterEmail: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.charityName.trim()) return;

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/charity-submission", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to submit");
      }

      setSubmitted(true);
      setForm({
        charityName: "",
        website: "",
        description: "",
        reason: "",
        submitterName: "",
        submitterEmail: "",
      });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg sm:rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-3 sm:gap-4 hover:bg-gray-50 transition-colors group touch-manipulation"
      >
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="text-lg">💡</span>
          <span className="font-medium text-slate-900 text-sm sm:text-base leading-snug">
            Suggest a Charity
          </span>
        </div>

        <svg
          className={`w-5 h-5 text-slate-400 shrink-0 transition-all duration-300 group-hover:text-slate-600 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 sm:px-5 pb-4 sm:pb-5 border-t border-slate-100 pt-3 sm:pt-4">
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
            Know a charity that should be included in our polls? Submit a request
            below and we&apos;ll review it. Only the charity name is required.
          </p>

          {submitted ? (
            <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-center">
              <p className="text-sm text-green-700 font-medium">
                ✅ Thank you! Your suggestion has been submitted for review.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-2 text-xs text-green-600 underline hover:text-green-700"
              >
                Submit another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Charity Name - Required */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1">
                  Charity Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.charityName}
                  onChange={(e) => setForm({ ...form, charityName: e.target.value })}
                  placeholder="e.g. American Red Cross"
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>

              {/* Website */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1">
                  Website
                </label>
                <input
                  type="url"
                  value={form.website}
                  onChange={(e) => setForm({ ...form, website: e.target.value })}
                  placeholder="https://www.example.org"
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1">
                  Brief Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="What does this charity do?"
                  rows={2}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                />
              </div>

              {/* Reason */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1">
                  Why Should We Add Them?
                </label>
                <textarea
                  value={form.reason}
                  onChange={(e) => setForm({ ...form, reason: e.target.value })}
                  placeholder="Why do you think this charity should be included?"
                  rows={2}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                />
              </div>

              {/* Submitter Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={form.submitterName}
                    onChange={(e) => setForm({ ...form, submitterName: e.target.value })}
                    placeholder="Optional"
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>

                {/* Submitter Email */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1">
                    Your Email
                  </label>
                  <input
                    type="email"
                    value={form.submitterEmail}
                    onChange={(e) => setForm({ ...form, submitterEmail: e.target.value })}
                    placeholder="Optional"
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              {error && (
                <p className="text-xs text-red-600">{error}</p>
              )}

              <button
                type="submit"
                disabled={submitting || !form.charityName.trim()}
                className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm active:scale-[0.98] touch-manipulation"
              >
                {submitting ? "Submitting..." : "Submit Suggestion"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
