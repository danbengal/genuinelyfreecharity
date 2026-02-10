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
    return <p className="text-gray-500 text-center py-4">No allocations recorded yet.</p>;
  }

  return (
    <div>
      <div className="flex justify-end mb-3">
        <button onClick={downloadCSV} className="text-sm text-blue-600 hover:underline">
          Download CSV
        </button>
      </div>

      {/* Desktop/Tablet table */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-gray-500">
              <th className="py-2 px-3 font-medium">Date</th>
              <th className="py-2 px-3 font-medium">Recipient</th>
              <th className="py-2 px-3 font-medium">Period</th>
              <th className="py-2 px-3 font-medium">Gross</th>
              <th className="py-2 px-3 font-medium">Costs</th>
              <th className="py-2 px-3 font-medium">Net</th>
              <th className="py-2 px-3 font-medium">Proof</th>
              <th className="py-2 px-3 font-medium">Notes</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((e) => (
              <tr key={e.id} className="border-b border-gray-100">
                <td className="py-2 px-3 whitespace-nowrap">{new Date(e.allocatedAt).toLocaleDateString()}</td>
                <td className="py-2 px-3">{e.recipientName}</td>
                <td className="py-2 px-3">{e.periodLabel}</td>
                <td className="py-2 px-3">{formatCurrency(e.grossRevenue)}</td>
                <td className="py-2 px-3">{formatCurrency(e.operatingCosts)}</td>
                <td className="py-2 px-3 font-medium">{formatCurrency(e.netAmount)}</td>
                <td className="py-2 px-3">
                  {e.proofUrl ? <a href={e.proofUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View</a> : "—"}
                </td>
                <td className="py-2 px-3 text-gray-500">{e.notes || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="sm:hidden space-y-3">
        {entries.map((e) => (
          <div key={e.id} className="bg-white rounded-lg border border-gray-200 p-4 text-sm">
            <div className="flex justify-between items-start mb-2">
              <span className="font-medium text-gray-900">{e.recipientName}</span>
              <span className="text-gray-500 text-xs">{new Date(e.allocatedAt).toLocaleDateString()}</span>
            </div>
            <div className="text-gray-500 text-xs mb-2">{e.periodLabel}</div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div><span className="text-gray-500">Gross:</span> {formatCurrency(e.grossRevenue)}</div>
              <div><span className="text-gray-500">Costs:</span> {formatCurrency(e.operatingCosts)}</div>
              <div><span className="text-gray-500">Net:</span> <span className="font-medium">{formatCurrency(e.netAmount)}</span></div>
            </div>
            {e.proofUrl && (
              <a href={e.proofUrl} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-blue-600 hover:underline text-xs">
                View proof
              </a>
            )}
            {e.notes && <p className="mt-1 text-gray-500 text-xs">{e.notes}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
