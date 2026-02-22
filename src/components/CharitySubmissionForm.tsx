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
      setForm({ charityName: "", website: "", description: "", reason: "", submitterName: "", submitterEmail: "" });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-colors";

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm transition-shadow hover:shadow-md">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">💡</span>
          <span className="font-semibold text-slate-900 sm:text-lg">Suggest a Charity</span>
        </div>
        <svg
          className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-[900px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-5 sm:px-6 pb-5 sm:pb-6 border-t border-slate-100 pt-4">
          <p className="text-sm text-slate-600 leading-relaxed mb-5">
            Know a charity that should be included in our polls? Submit it below. Only the charity name is required.
          </p>

          {submitted ? (
            <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
              <p className="text-sm text-emerald-700 font-medium">
                ✅ Thank you! Your suggestion has been submitted for review.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-2 text-xs text-emerald-600 hover:text-emerald-700 underline"
              >
                Submit another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Charity Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.charityName}
                  onChange={(e) => setForm({ ...form, charityName: e.target.value })}
                  placeholder="e.g. American Red Cross"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Website</label>
                <input
                  type="url"
                  value={form.website}
                  onChange={(e) => setForm({ ...form, website: e.target.value })}
                  placeholder="https://www.example.org"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Brief Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="What does this charity do?"
                  rows={2}
                  className={`${inputClass} resize-none`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Why Should We Add Them?</label>
                <textarea
                  value={form.reason}
                  onChange={(e) => setForm({ ...form, reason: e.target.value })}
                  placeholder="Why do you think this charity should be included?"
                  rows={2}
                  className={`${inputClass} resize-none`}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Your Name</label>
                  <input
                    type="text"
                    value={form.submitterName}
                    onChange={(e) => setForm({ ...form, submitterName: e.target.value })}
                    placeholder="Optional"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Your Email</label>
                  <input
                    type="email"
                    value={form.submitterEmail}
                    onChange={(e) => setForm({ ...form, submitterEmail: e.target.value })}
                    placeholder="Optional"
                    className={inputClass}
                  />
                </div>
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <button
                type="submit"
                disabled={submitting || !form.charityName.trim()}
                className="w-full py-3.5 px-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-sm active:scale-[0.98]"
              >
                {submitting ? "Submitting…" : "Submit Suggestion"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
