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
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-4" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <div key={i} className="h-12 bg-gray-100 rounded-lg" />)}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center text-gray-500">
        {error}
      </div>
    );
  }

  if (!poll) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center text-gray-500">
        No active poll right now. Check back soon!
      </div>
    );
  }

  const totalVotes = poll.options.reduce((sum, o) => sum + (o._count?.votes || 0), 0);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-1">Today&apos;s Question</h2>
      <p className="text-sm text-gray-500 mb-4">Choose one option. Results update instantly.</p>
      <h3 className="text-xl font-medium text-gray-800 mb-5">{poll.question}</h3>

      {submitted && poll.alreadyVoted && poll.nextAvailable && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">
          Thanks for coming back! You can participate again at{" "}
          {new Date(poll.nextAvailable).toLocaleString()}.
        </div>
      )}

      <div className="space-y-3">
        {poll.options.map((option) => {
          const votes = option._count?.votes || 0;
          const pct = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;

          if (submitted) {
            return (
              <div key={option.id} className="relative overflow-hidden rounded-lg border border-gray-200">
                <div
                  className="absolute inset-0 bg-blue-50 transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
                <div className="relative flex items-center justify-between p-3">
                  <span className="font-medium text-gray-800">{option.text}</span>
                  <span className="text-sm text-gray-600 ml-2 whitespace-nowrap">{pct}% ({votes})</span>
                </div>
              </div>
            );
          }

          return (
            <button
              key={option.id}
              onClick={() => setSelected(option.id)}
              className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                selected === option.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <span className="font-medium text-gray-800">{option.text}</span>
            </button>
          );
        })}
      </div>

      {!submitted && (
        <button
          onClick={handleSubmit}
          disabled={!selected || submitting}
          className="mt-5 w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {submitting ? "Submitting..." : "Submit"}
        </button>
      )}

      {submitted && (
        <p className="mt-4 text-center text-sm text-gray-500">
          {totalVotes} total response{totalVotes !== 1 ? "s" : ""}
        </p>
      )}
    </div>
  );
}
