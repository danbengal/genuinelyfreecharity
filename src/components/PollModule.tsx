"use client";

import { useState, useEffect, useCallback } from "react";

interface PollOption {
  id: string;
  text: string;
  _count?: { votes: number };
}

interface PollData {
  id: string;
  question: string;
  options: PollOption[];
  totalVotes: number;
  alreadyVoted: boolean;
  nextAvailable?: string;
}

export default function PollModule() {
  const [poll, setPoll] = useState<PollData | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPoll = useCallback(async () => {
    try {
      const res = await fetch("/api/poll");
      if (!res.ok) throw new Error("Failed to load poll");
      const data = await res.json();
      setPoll(data);
      if (data.alreadyVoted) setSubmitted(true);
    } catch {
      setError("Could not load the poll. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPoll();
  }, [fetchPoll]);

  const handleSubmit = async () => {
    if (!selected || !poll) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/poll/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pollId: poll.id, optionId: selected }),
      });
      if (!res.ok) {
        const data = await res.json();
        if (data.alreadyVoted) {
          setSubmitted(true);
          setPoll((p) => p ? { ...p, alreadyVoted: true, nextAvailable: data.nextAvailable } : p);
        } else {
          throw new Error(data.error || "Failed to submit");
        }
        return;
      }
      const data = await res.json();
      setPoll(data);
      setSubmitted(true);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 animate-pulse">
        <div className="h-7 bg-slate-100 rounded-lg w-3/4 mb-6" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-slate-50 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
        <div className="text-slate-400 mb-2">⚠️</div>
        <p className="text-slate-600">{error}</p>
      </div>
    );
  }

  if (!poll) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
        <div className="text-slate-400 mb-2">📊</div>
        <p className="text-slate-600">No active poll right now. Check back soon!</p>
      </div>
    );
  }

  const totalVotes = poll.options.reduce((sum, o) => sum + (o._count?.votes || 0), 0);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 animate-fade-in">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
            Today&apos;s Question
          </h2>
        </div>
        <h3 className="text-2xl font-bold text-slate-900 leading-tight">
          {poll.question}
        </h3>
      </div>

      {/* Already voted notice */}
      {submitted && poll.alreadyVoted && poll.nextAvailable && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-xl">
          <p className="text-sm text-blue-700 leading-relaxed">
            ✨ Thanks for coming back! You can participate again at{" "}
            <span className="font-medium">
              {new Date(poll.nextAvailable).toLocaleString()}
            </span>
          </p>
        </div>
      )}

      {/* Options */}
      <div className="space-y-3 mb-6">
        {poll.options.map((option) => {
          const votes = option._count?.votes || 0;
          const pct = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;

          if (submitted) {
            return (
              <div
                key={option.id}
                className="relative overflow-hidden rounded-xl border border-slate-200 bg-gray-50 group"
              >
                {/* Animated gradient bar */}
                <div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-blue-400 opacity-20 animate-slide-in"
                  style={{ width: `${pct}%` }}
                />
                
                <div className="relative flex items-center justify-between p-5">
                  <span className="font-medium text-slate-900 pr-4">
                    {option.text}
                  </span>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-2xl font-bold text-blue-600">
                      {pct}%
                    </span>
                    <span className="text-sm text-slate-500">
                      ({votes.toLocaleString()})
                    </span>
                  </div>
                </div>
              </div>
            );
          }

          return (
            <button
              key={option.id}
              onClick={() => setSelected(option.id)}
              className={`w-full text-left p-5 rounded-xl border-2 transition-all group ${
                selected === option.id
                  ? "border-blue-600 bg-blue-50 shadow-md scale-[1.02]"
                  : "border-slate-200 hover:border-slate-300 hover:bg-gray-50 hover:shadow-sm"
              }`}
            >
              <div className="flex items-center gap-4">
                {/* Radio indicator */}
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                    selected === option.id
                      ? "border-blue-600 bg-blue-600"
                      : "border-slate-300 group-hover:border-slate-400"
                  }`}
                >
                  {selected === option.id && (
                    <div className="w-2 h-2 bg-white rounded-full" />
                  )}
                </div>
                
                <span className="font-medium text-slate-900 text-lg">
                  {option.text}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Submit button */}
      {!submitted && (
        <button
          onClick={handleSubmit}
          disabled={!selected || submitting}
          className="w-full py-4 px-6 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md disabled:hover:shadow-sm"
        >
          {submitting ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Submitting...
            </span>
          ) : (
            "Submit Your Response"
          )}
        </button>
      )}

      {/* Results footer */}
      {submitted && (
        <div className="mt-6 pt-6 border-t border-slate-200 text-center">
          <p className="text-sm text-slate-500">
            <span className="font-semibold text-slate-700">
              {totalVotes.toLocaleString()}
            </span>{" "}
            total response{totalVotes !== 1 ? "s" : ""}
          </p>
        </div>
      )}
    </div>
  );
}
