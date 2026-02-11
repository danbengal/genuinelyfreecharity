"use client";

import { useState } from "react";

export default function CharitySubmissionForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    charityName: "",
    website: "",
    description: "",
    reason: "",
    submitterName: "",
    submitterEmail: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch("/api/charity-submission", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit");
      }

      setSuccess(true);
      setFormData({
        charityName: "",
        website: "",
        description: "",
        reason: "",
        submitterName: "",
        submitterEmail: "",
      });

      // Close the form after 2 seconds
      setTimeout(() => {
        setIsOpen(false);
        setSuccess(false);
      }, 2000);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg sm:rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-3 sm:gap-4 hover:bg-gray-50 transition-colors group touch-manipulation"
      >
        <div className="flex-1">
          <h3 className="font-medium text-slate-900 mb-1 text-sm sm:text-base">
            Suggest a Charity
          </h3>
          <p className="text-xs sm:text-sm text-slate-600">
            Know a charity that should be included in our polls? Let us know!
          </p>
        </div>
        
        {/* Animated chevron */}
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
      
      {/* Animated content */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 sm:px-5 pb-4 sm:pb-5 border-t border-slate-100 pt-4">
          {success ? (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
              <div className="text-2xl mb-2">✨</div>
              <p className="text-green-700 font-medium">Thank you for your submission!</p>
              <p className="text-green-600 text-sm mt-1">We&apos;ll review your suggestion.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                  {error}
                </div>
              )}

              {/* Charity Name - REQUIRED */}
              <div>
                <label htmlFor="charityName" className="block text-sm font-medium text-slate-700 mb-1">
                  Charity Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="charityName"
                  name="charityName"
                  value={formData.charityName}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="e.g., American Red Cross"
                />
              </div>

              {/* Website - Optional */}
              <div>
                <label htmlFor="website" className="block text-sm font-medium text-slate-700 mb-1">
                  Website <span className="text-slate-400 text-xs">(optional)</span>
                </label>
                <input
                  type="url"
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="https://example.org"
                />
              </div>

              {/* Description - Optional */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1">
                  Description <span className="text-slate-400 text-xs">(optional)</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
                  placeholder="Brief description of what the charity does..."
                />
              </div>

              {/* Reason - Optional */}
              <div>
                <label htmlFor="reason" className="block text-sm font-medium text-slate-700 mb-1">
                  Why should we add this charity? <span className="text-slate-400 text-xs">(optional)</span>
                </label>
                <textarea
                  id="reason"
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
                  placeholder="Tell us why this charity is important to you..."
                />
              </div>

              {/* Submitter Name - Optional */}
              <div>
                <label htmlFor="submitterName" className="block text-sm font-medium text-slate-700 mb-1">
                  Your Name <span className="text-slate-400 text-xs">(optional)</span>
                </label>
                <input
                  type="text"
                  id="submitterName"
                  name="submitterName"
                  value={formData.submitterName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="Your name"
                />
              </div>

              {/* Submitter Email - Optional */}
              <div>
                <label htmlFor="submitterEmail" className="block text-sm font-medium text-slate-700 mb-1">
                  Your Email <span className="text-slate-400 text-xs">(optional)</span>
                </label>
                <input
                  type="email"
                  id="submitterEmail"
                  name="submitterEmail"
                  value={formData.submitterEmail}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="your.email@example.com"
                />
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={submitting || !formData.charityName.trim()}
                className="w-full py-3 px-6 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md active:scale-[0.98] touch-manipulation text-sm sm:text-base"
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  "Submit Suggestion"
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
