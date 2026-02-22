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
          setPoll((p) => (p ? { ...p, alreadyVoted: true, nextAvailable: data.nextAvailable } : p));
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
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-10 animate-pulse">
        <div className="h-4 bg-slate-100 rounded w-32 mb-4" />
        <div className="h-7 bg-slate-100 rounded w-3/4 mb-8" />
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 bg-slate-50 rounded-xl" />
          ))}
        </div>
        <div className="h-14 bg-blue-50 rounded-xl mt-8" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-10 text-center">
        <p className="text-slate-500">{error}</p>
      </div>
    );
  }

  if (!poll) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-10 text-center">
        <div className="text-4xl mb-3 opacity-40">📊</div>
        <p className="text-slate-600 font-medium">No active poll right now.</p>
        <p className="text-sm text-slate-400 mt-1">Check back soon!</p>
      </div>
    );
  }

  const totalVotes = poll.options.reduce((sum, o) => sum + (o._count?.votes || 0), 0);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-10 animate-fade-in">
      <div className="mb-6 sm:mb-8">
        <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-2">
          Today&apos;s Question
        </p>
        <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
          {poll.question}
        </h3>
      </div>

      {submitted && poll.alreadyVoted && poll.nextAvailable && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-xl">
          <p className="text-sm text-blue-700">
            Thanks for participating! You can vote again at{" "}
            <span className="font-semibold">
              {new Date(poll.nextAvailable).toLocaleString()}
            </span>
          </p>
        </div>
      )}

      <div className="space-y-3 mb-6 sm:mb-8">
        {poll.options.map((option) => {
          const votes = option._count?.votes || 0;
          const pct = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;

          if (submitted) {
            return (
              <div
                key={option.id}
                className="relative overflow-hidden rounded-xl border border-slate-200 bg-slate-50"
              >
                <div
                  className="absolute inset-y-0 left-0 bg-blue-100 animate-bar"
                  style={{ width: `${pct}%` }}
                />
                <div className="relative flex items-center justify-between p-4 sm:p-5">
                  <span className="font-medium text-slate-900 text-sm sm:text-base">
                    {option.text}
                  </span>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xl sm:text-2xl font-bold text-blue-600">{pct}%</span>
                    <span className="text-xs text-slate-400">({votes.toLocaleString()})</span>
                  </div>
                </div>
              </div>
            );
          }

          return (
            <button
              key={option.id}
              onClick={() => setSelected(option.id)}
              className={`w-full text-left p-4 sm:p-5 rounded-xl border-2 transition-all active:scale-[0.98] ${
                selected === option.id
                  ? "border-blue-600 bg-blue-50 shadow-md"
                  : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                    selected === option.id
                      ? "border-blue-600 bg-blue-600"
                      : "border-slate-300"
                  }`}
                >
                  {selected === option.id && (
                    <div className="w-2 h-2 bg-white rounded-full" />
                  )}
                </div>
                <span className="font-medium text-slate-900 sm:text-lg">{option.text}</span>
              </div>
            </button>
          );
        })}
      </div>

      {!submitted && (
        <button
          onClick={handleSubmit}
          disabled={!selected || submitting}
          className="w-full py-4 px-6 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md active:scale-[0.98] text-base sm:text-lg"
        >
          {submitting ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Submitting…
            </span>
          ) : (
            "Submit Your Response"
          )}
        </button>
      )}

      {submitted && (
        <div className="mt-6 pt-6 border-t border-slate-200 text-center">
          <p className="text-sm text-slate-500">
            <span className="font-semibold text-slate-700">{totalVotes.toLocaleString()}</span>{" "}
            total response{totalVotes !== 1 ? "s" : ""}
          </p>
        </div>
      )}
    </div>
  );
}
