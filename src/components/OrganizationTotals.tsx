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
      <p className="text-gray-500 text-center py-4">No allocations recorded yet.</p>
    );
  }

  return (
    <>
      {/* Desktop/Tablet table */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-200 text-sm text-gray-500">
              <th className="py-3 px-4 font-medium">Organization</th>
              <th className="py-3 px-4 font-medium">Lifetime Total</th>
              <th className="py-3 px-4 font-medium">This Month</th>
              <th className="py-3 px-4 font-medium">Last Allocation</th>
            </tr>
          </thead>
          <tbody>
            {orgs.map((org) => (
              <tr key={org.id} className="border-b border-gray-100">
                <td className="py-3 px-4">
                  {org.website ? (
                    <a href={org.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {org.name}
                    </a>
                  ) : org.name}
                </td>
                <td className="py-3 px-4 font-medium">{formatCurrency(org.totalLifetime)}</td>
                <td className="py-3 px-4">{formatCurrency(org.totalThisMonth)}</td>
                <td className="py-3 px-4 text-sm text-gray-500">
                  {org.lastAllocationDate ? new Date(org.lastAllocationDate).toLocaleDateString() : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="sm:hidden space-y-3">
        {orgs.map((org) => (
          <div key={org.id} className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="font-medium text-gray-900">
              {org.website ? (
                <a href={org.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  {org.name}
                </a>
              ) : org.name}
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
              <div><span className="text-gray-500">Lifetime:</span> <span className="font-medium">{formatCurrency(org.totalLifetime)}</span></div>
              <div><span className="text-gray-500">This month:</span> {formatCurrency(org.totalThisMonth)}</div>
              <div className="col-span-2 text-gray-500">
                Last: {org.lastAllocationDate ? new Date(org.lastAllocationDate).toLocaleDateString() : "—"}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
