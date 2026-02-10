"use client";

import { useEffect, useState } from "react";

interface OrgData {
  id: string;
  name: string;
  website: string | null;
  totalLifetime: number;
  totalThisMonth: number;
  lastAllocationDate: string | null;
}

function formatCurrency(n: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
}

export default function OrganizationTotals() {
  const [orgs, setOrgs] = useState<OrgData[]>([]);

  useEffect(() => {
    fetch("/api/organizations")
      .then((r) => r.json())
      .then(setOrgs)
      .catch(() => {});
  }, []);

  if (orgs.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
        <div className="text-4xl mb-3 opacity-50">🏢</div>
        <p className="text-slate-600">No allocations recorded yet.</p>
        <p className="text-sm text-slate-400 mt-1">Check back soon!</p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop/Tablet table */}
      <div className="hidden sm:block bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-slate-200">
              <tr>
                <th className="py-4 px-6 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Organization
                </th>
                <th className="py-4 px-6 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Lifetime Total
                </th>
                <th className="py-4 px-6 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  This Month
                </th>
                <th className="py-4 px-6 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Last Allocation
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orgs.map((org) => (
                <tr key={org.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6">
                    {org.website ? (
                      <a
                        href={org.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors"
                      >
                        {org.name}
                      </a>
                    ) : (
                      <span className="text-slate-900 font-medium">{org.name}</span>
                    )}
                  </td>
                  <td className="py-4 px-6 font-semibold text-slate-900">
                    {formatCurrency(org.totalLifetime)}
                  </td>
                  <td className="py-4 px-6 text-slate-700">
                    {formatCurrency(org.totalThisMonth)}
                  </td>
                  <td className="py-4 px-6 text-sm text-slate-500">
                    {org.lastAllocationDate
                      ? new Date(org.lastAllocationDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile cards */}
      <div className="sm:hidden space-y-4">
        {orgs.map((org) => (
          <div
            key={org.id}
            className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 hover:shadow-md transition-shadow"
          >
            <div className="mb-4">
              {org.website ? (
                <a
                  href={org.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                >
                  {org.name}
                </a>
              ) : (
                <span className="text-lg font-semibold text-slate-900">{org.name}</span>
              )}
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Lifetime Total</span>
                <span className="text-lg font-bold text-slate-900">
                  {formatCurrency(org.totalLifetime)}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">This Month</span>
                <span className="font-medium text-slate-700">
                  {formatCurrency(org.totalThisMonth)}
                </span>
              </div>
              
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <span className="text-xs text-slate-400">Last Allocation</span>
                <span className="text-xs text-slate-500">
                  {org.lastAllocationDate
                    ? new Date(org.lastAllocationDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })
                    : "—"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
