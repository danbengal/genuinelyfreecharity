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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-24 bg-gray-100 rounded-xl" />
        ))}
      </div>
    );
  }

  const cards = [
    { label: "Total Allocated (Lifetime)", value: formatCurrency(data.totalAllocated) },
    { label: "Allocated Today", value: formatCurrency(data.allocatedToday) },
    { label: "Allocated This Month", value: formatCurrency(data.allocatedThisMonth) },
    { label: "Last 30 Days", value: formatCurrency(data.allocatedLast30Days) },
    { label: "Last Allocation", value: data.lastAllocationDate ? new Date(data.lastAllocationDate).toLocaleDateString() : "—" },
    { label: "Organizations Supported", value: data.recipientCount.toString() },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {cards.map((card) => (
        <div key={card.label} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="text-sm text-gray-500">{card.label}</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">{card.value}</div>
        </div>
      ))}
    </div>
  );
}
