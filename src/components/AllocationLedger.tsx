"use client";

import { useEffect, useState } from "react";

interface AllocationEntry {
  id: string;
  allocatedAt: string;
  recipientName: string;
  periodLabel: string;
  grossRevenue: number;
  operatingCosts: number;
  netAmount: number;
  proofUrl: string | null;
  notes: string | null;
}

function formatCurrency(n: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
}

export default function AllocationLedger() {
  const [entries, setEntries] = useState<AllocationEntry[]>([]);

  useEffect(() => {
    fetch("/api/allocations")
      .then((r) => r.json())
      .then(setEntries)
      .catch(() => {});
  }, []);

  const downloadCSV = () => {
    const headers = ["Date", "Recipient", "Period", "Gross Revenue", "Operating Costs", "Net Amount", "Proof URL", "Notes"];
    const rows = entries.map((e) => [
      new Date(e.allocatedAt).toLocaleDateString(),
      e.recipientName,
      e.periodLabel,
      e.grossRevenue.toFixed(2),
      e.operatingCosts.toFixed(2),
      e.netAmount.toFixed(2),
      e.proofUrl || "",
      e.notes || "",
    ]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "allocations.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (entries.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center">
        <div className="text-4xl mb-3 opacity-40">📋</div>
        <p className="text-slate-600 font-medium">No allocations recorded yet.</p>
        <p className="text-sm text-slate-400 mt-1">The transparency ledger will appear here.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button
          onClick={downloadCSV}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Download CSV
        </button>
      </div>

      {/* Desktop table */}
      <div className="hidden sm:block bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                <th className="py-3.5 px-5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Recipient</th>
                <th className="py-3.5 px-5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Period</th>
                <th className="py-3.5 px-5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Gross</th>
                <th className="py-3.5 px-5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Costs</th>
                <th className="py-3.5 px-5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Net</th>
                <th className="py-3.5 px-5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Proof</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {entries.map((e) => (
                <tr key={e.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-5 whitespace-nowrap text-slate-600">
                    {new Date(e.allocatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </td>
                  <td className="py-3.5 px-5 font-medium text-slate-900">{e.recipientName}</td>
                  <td className="py-3.5 px-5 text-slate-600">{e.periodLabel}</td>
                  <td className="py-3.5 px-5 text-slate-600">{formatCurrency(e.grossRevenue)}</td>
                  <td className="py-3.5 px-5 text-slate-600">{formatCurrency(e.operatingCosts)}</td>
                  <td className="py-3.5 px-5 font-semibold text-slate-900">{formatCurrency(e.netAmount)}</td>
                  <td className="py-3.5 px-5">
                    {e.proofUrl ? (
                      <a href={e.proofUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-500">
                        View
                      </a>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile cards */}
      <div className="sm:hidden space-y-3">
        {entries.map((e) => (
          <div key={e.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <div className="flex items-start justify-between mb-3">
              <span className="font-semibold text-slate-900">{e.recipientName}</span>
              <span className="text-xs text-slate-500">
                {new Date(e.allocatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </span>
            </div>
            <div className="text-xs text-slate-500 mb-4">{e.periodLabel}</div>
            <div className="grid grid-cols-3 gap-3 mb-3">
              <div>
                <div className="text-xs text-slate-400 mb-1">Gross</div>
                <div className="text-sm font-medium text-slate-700">{formatCurrency(e.grossRevenue)}</div>
              </div>
              <div>
                <div className="text-xs text-slate-400 mb-1">Costs</div>
                <div className="text-sm font-medium text-slate-700">{formatCurrency(e.operatingCosts)}</div>
              </div>
              <div>
                <div className="text-xs text-slate-400 mb-1">Net</div>
                <div className="text-sm font-bold text-slate-900">{formatCurrency(e.netAmount)}</div>
              </div>
            </div>
            {e.proofUrl && (
              <a href={e.proofUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-500">
                View proof →
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
