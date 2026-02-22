"use client";

import { useEffect, useState } from "react";

interface ImpactData {
  totalAllocated: number;
  allocatedToday: number;
  allocatedThisMonth: number;
  allocatedLast30Days: number;
  lastAllocationDate: string | null;
  recipientCount: number;
}

function formatCurrency(n: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
}

export default function ImpactDashboard() {
  const [data, setData] = useState<ImpactData | null>(null);

  useEffect(() => {
    fetch("/api/impact")
      .then((r) => r.json())
      .then(setData)
      .catch(() => {});
  }, []);

  if (!data) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-32 bg-slate-50 rounded-2xl border border-slate-200 animate-pulse" />
        ))}
      </div>
    );
  }

  const cards = [
    { label: "Total Allocated", value: formatCurrency(data.totalAllocated), icon: "💰", highlight: true },
    { label: "Allocated Today", value: formatCurrency(data.allocatedToday), icon: "📅" },
    { label: "This Month", value: formatCurrency(data.allocatedThisMonth), icon: "📊" },
    { label: "Last 30 Days", value: formatCurrency(data.allocatedLast30Days), icon: "📈" },
    {
      label: "Last Allocation",
      value: data.lastAllocationDate
        ? new Date(data.lastAllocationDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
        : "—",
      icon: "🗓️",
    },
    { label: "Organizations", value: data.recipientCount.toString(), icon: "🏢" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className={`bg-white rounded-2xl border shadow-sm p-5 sm:p-6 transition-shadow hover:shadow-md ${
            card.highlight ? "border-blue-200 ring-1 ring-blue-100" : "border-slate-200"
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              {card.label}
            </span>
            <span className="text-lg opacity-50">{card.icon}</span>
          </div>
          <div className={`text-2xl sm:text-3xl font-bold ${card.highlight ? "text-blue-600" : "text-slate-900"}`}>
            {card.value}
          </div>
        </div>
      ))}
    </div>
  );
}
