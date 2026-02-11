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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 animate-pulse">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-28 sm:h-32 bg-gray-50 rounded-xl border border-slate-200" />
        ))}
      </div>
    );
  }

  const cards = [
    { 
      label: "Total Allocated", 
      sublabel: "Lifetime", 
      value: formatCurrency(data.totalAllocated),
      icon: "💰",
      highlight: true 
    },
    { 
      label: "Allocated Today", 
      sublabel: "Last 24 hours", 
      value: formatCurrency(data.allocatedToday),
      icon: "📅" 
    },
    { 
      label: "This Month", 
      sublabel: "Current month", 
      value: formatCurrency(data.allocatedThisMonth),
      icon: "📊" 
    },
    { 
      label: "Last 30 Days", 
      sublabel: "Rolling total", 
      value: formatCurrency(data.allocatedLast30Days),
      icon: "📈" 
    },
    { 
      label: "Last Allocation", 
      sublabel: "Most recent", 
      value: data.lastAllocationDate 
        ? new Date(data.lastAllocationDate).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
          }) 
        : "—",
      icon: "🗓️" 
    },
    { 
      label: "Organizations", 
      sublabel: "Supported", 
      value: data.recipientCount.toString(),
      icon: "🏢" 
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {cards.map((card, i) => (
        <div
          key={card.label}
          className={`bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6 hover:shadow-md transition-shadow ${
            card.highlight ? 'ring-2 ring-blue-600 ring-opacity-20' : ''
          }`}
          style={{ animationDelay: `${i * 50}ms` }}
        >
          <div className="flex items-start justify-between mb-2 sm:mb-3">
            <div className="flex-1">
              <div className="text-xs sm:text-sm font-medium text-slate-500 mb-1">
                {card.label}
              </div>
              <div className="text-xs text-slate-400">
                {card.sublabel}
              </div>
            </div>
            <div className="text-xl sm:text-2xl opacity-50">
              {card.icon}
            </div>
          </div>
          
          <div className={`text-2xl sm:text-3xl font-bold ${
            card.highlight ? 'text-blue-600' : 'text-slate-900'
          }`}>
            {card.value}
          </div>
        </div>
      ))}
    </div>
  );
}
